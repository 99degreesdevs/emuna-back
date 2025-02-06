import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Product } from "src/products/entities";
import { isUUID } from "class-validator";
import { Users } from "src/users/entities";
import { Order } from "./entities";
import { Fiscal } from "src/fiscal/entities";
import { Op } from "sequelize";

import { Products } from "./interfaces/products.interface";
import { ProductCat } from "src/products/interfaces/products-category.enum";
import { Address } from "src/address/entities";

@Injectable()
export class OrdersService {
  private readonly orderLogger = new Logger("Orders Service");

  constructor(
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order,
    @Inject("PRODUCT_REPOSITORY")
    private readonly productsRepository: typeof Product,
    @Inject("ADDRESS_REPOSITORY")
    private readonly addressRepository: typeof Address
  ) {}

  async create(createOrderDto: CreateOrderDto, buyerUser: string) {
    const skuIds: string[] = createOrderDto.products.map(
      (product) => product.sku
    );

    const _items = await this.findProductsByIds(skuIds);

    if (_items.length === 0 || _items.length !== skuIds.length) {
      throw new BadRequestException({
        message: "No se encontraron productos con los skus proporcionados",
        products: skuIds.filter(
          (sku) => !_items.find((item) => item.sku === sku)
        ),
      });
    }
 
    const productsMap = new Map(
      createOrderDto.products.map((product) => [product.sku, product])
    );

    let productsFail = [];

    let isPhysical = [];

    const products = _items
      .map((item) => {
        const product = productsMap.get(item.sku);
        isPhysical.push(item.category === ProductCat.PRODUCT);
        if (
          item.category === ProductCat.PRODUCT &&
          product.amount > item.stockQuantity
        ) {
          productsFail.push({
            sku: item.sku,
            product: item.product,
          });
        }

        return {
          sku: item.sku,
          product: item.product,
          price: item.price,
          discount: item.discount,
          category: item.category,
          amount: product ? product.amount : 0,
        };
      })
      .filter((item) => item.amount > 0);
    if (productsFail.length > 0) {
      throw new BadRequestException({
        message: "Algunos productos no cuentan con stock disponible",
        products: productsFail,
      });
    }

    if (isPhysical.includes(true)) {
      if (createOrderDto.addressId) {
        const address = await this.addressRepository.findOne({
          where: { id: createOrderDto.addressId, userId: buyerUser },
        });
        if (!address) {
          throw new BadRequestException("La dirección proporcionada no existe");
        }
      } else {
        const address = await this.addressRepository.findOne({
          where: { userId: buyerUser, isDefault: true },
        });
        if (!address) {
          throw new BadRequestException(
            "El usuario no cuenta con una dirección predeterminada, agregue o asigne una para continuar."
          );
        }
        createOrderDto.addressId = address.id;
      }
    }

    try {
      const order = await this.orderRepository.create({
        ...createOrderDto,
        requiresShipping: isPhysical.includes(true),
        products,
        buyerUser,
      });
      const { deletedAt, updatedAt, ...restOrder } = order.dataValues;

      return {
        message: `Se creó la orden exitosamente.`,
        order: restOrder,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const orders = await this.orderRepository.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: [
            "deletedAt",
            "updatedAt",
            "createdBy",
            "products",
            "buyerUser",
          ],
        },
      });

      return {
        message: `Se obtuvieron ${orders.length} ordenes exitosamente.`,
        total: orders.length,
        orders: orders,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      if (!isUUID(id))
        throw new BadRequestException(
          "El número de orden no cumple con el formato."
        );

      const _order = await this.orderRepository.findByPk(id, {
        attributes: { exclude: ["deletedAt", "updatedAt"] },
        include: [
          {
            model: Users,
            as: "buyerOrder",
            foreignKey: "buyerUser",
            attributes: ["userId", "name", "email", "phone"],
            include: [
              {
                model: Fiscal,
                foreignKey: "userId",
                as: "fiscalUsers",
                attributes: ["address", "RFC", "cRF", "cUsoCFDI"],
              },
            ],
          },
        ],
      });

      if (!_order) {
        throw new NotFoundException(`La orden con el id ${id} no existe`);
      }

      const orderJson = _order.toJSON();
      const { buyerOrder, buyerUser, products, ...rest } = orderJson;
      const orden = {
        ...rest,
        buyer: {
          userId: buyerOrder.userId,
          name: buyerOrder.name,
          email: buyerOrder.email,
          phone: buyerOrder.phone,
          fiscal: buyerOrder.fiscalUsers,
        },
        products,
      };

      return {
        message: `Se obtuvo la orden con el ${id} exitosamente`,
        order: orden,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(order: string, updateOrderDto: UpdateOrderDto) {
    try {
      if (!isUUID(order))
        throw new BadRequestException(
          "El número de orden no cumple con el formato."
        );

      const _order = await this.orderRepository.findByPk(order);

      if (!_order) {
        throw new NotFoundException(`El número de orden ${order}  no existe`);
      }

      // const orderSet = await this.orderRepository.update(
      //   { ...updateOrderDto },
      //   { where: { order }, returning: true, individualHooks: true }
      // );

      // const { deletedAt, ...restProduct } = orderSet[1][0].dataValues;

      return {
        message: `Se actualizó la orden con el id ${order} exitosamente.`,
        order: "hol",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(order: string) {
    try {
      if (!isUUID(order))
        throw new BadRequestException(
          "El número de orden no cumple con el formato."
        );

      const orderSet = await this.orderRepository.findByPk(order);

      if (!orderSet) {
        throw new NotFoundException(`El número de orden ${order} no existe`);
      }

      await this.orderRepository.destroy({
        where: { order },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó la orden con el id ${order} exitosamente.`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findProductsByIds(skus: string[]) {
    try {
      const skuList = await this.productsRepository.findAll({
        where: {
          sku: {
            [Op.in]: skus,
          },
        },
        attributes: [
          "sku",
          "category",
          "stockQuantity",
          "product",
          "price",
          "discount",
        ],
      });

      if (!skuList) {
        throw new NotFoundException(
          "No se encontraron productos con los skus proporcionados"
        );
      }

      const result = skuList.map((product) => {
        // if( product.stockQuantity === 0 && product.category === ProductCat.PRODUCT ) {
        //   throw new BadRequestException(`El producto: -${product.product}-   no cuenta con stock disponible`);
        // }
        return {
          sku: product.sku,
          product: product.product,
          price: product.price,
          discount: product.discountAmount,
          category: product.category,
          stockQuantity: product.stockQuantity,
        };
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.orderLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
