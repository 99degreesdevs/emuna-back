import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities";
import { Users } from "src/users/entities";
import { isUUID } from "class-validator";
import { ProductCat } from "./interfaces/products-category.enum";
import { Package } from "src/package/entities";
import { ProductsCat } from "src/products-cat/entities";
import { SearchProductDto } from "./dto/search-package.dto";
import { PageMetaDto } from "src/common/pagination";

@Injectable()
export class ProductsService {
  private readonly productLogger = new Logger("Products Service");

  constructor(
    @Inject("PRODUCT_REPOSITORY")
    private readonly productRepository: typeof Product,
    @Inject("PACKAGE_REPOSITORY")
    private readonly packageRepository: typeof Package
  ) {}
  async create(createProductDto: CreateProductDto, userId: string) {
    try {
      const products = await this.productRepository.create({
        ...createProductDto,
        createdBy: userId,
      });
      const { deletedAt, updatedAt, updatedBy, createdBy, ...restProducts } =
        products.dataValues;
      if (createProductDto.category === ProductCat.PACKAGE) {
        await this.packageRepository.bulkCreate(
          createProductDto.packageCustom.map((item) => ({
            ...item,
            sku: products.sku,
          }))
        );
      }

      return {
        message: `Se creó el producto o servicio ${createProductDto.product} exitosamente.`,
        product: restProducts,
      };
    } catch (error) { 
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: [
            "deletedAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "createdAt",
            "details",
          ],
        },
        include:[ 
          {
            model: ProductsCat,
            as: "categoryProduct",
            foreignKey: "category", 
            attributes: ["category"],
          }
        ]
      });

      return {
        message: `Se obtuvieron ${products.length} productos y servicios exitosamente.`,
        total: products.length,
        products: products,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllPagination(pageOptionsDto: SearchProductDto) {
    
    const whereConditions: any = {};

    if (pageOptionsDto.category && pageOptionsDto.category > 0) {
      whereConditions.category = pageOptionsDto.category;
    }
    try {
      const itemCount = await this.productRepository.count({
        where: whereConditions,
      });
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      const products = await this.productRepository.findAll({
        offset: (pageOptionsDto.page - 1) * pageOptionsDto.take,
        limit: pageOptionsDto.take,
        order: [["createdAt", pageOptionsDto.order]],
        where: whereConditions,
        attributes: {
          exclude: [
            "deletedAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "createdAt",
            "details",
          ],
        },
        include:[ 
          {
            model: ProductsCat,
            as: "categoryProduct",
            foreignKey: "category", 
            attributes: ["category"],
          }
        ]
      }); 
      return {
        message: `Se obtuvieron ${products.length} productos y servicios exitosamente.`,
        total: products.length,
        
        products: products,
        meta: pageMetaDto,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(sku: string) {
    try {
      if (!isUUID(sku))
        throw new BadRequestException("El sku no cumple con el formato.");

      const _product = await this.productRepository.findByPk(sku, {
        order: [["createdAt", "ASC"]],
        attributes: { exclude: ["deletedAt", "createdBy"] },
        include: [
          {
            model: Users,
            as: "productCreatedBy",
            foreignKey: "createdBy",
            attributes: ["userId", "name"],
          },
          {
            model: Users,
            as: "productUpdatedBy",
            foreignKey: "updatedBy",
            attributes: ["userId", "name"],
          },
          {
            model: ProductsCat,
            as: "categoryProduct",
            foreignKey: "category", 
            attributes: ["category", "isPhysical", "requiresInventory", "requiresShipping", "canBePartOfPackage", "description", "isActive"],
          }
        ],
      });

      if (!_product) {
        throw new NotFoundException(
          `El producto o servicio con el sku ${sku} no existe`
        );
      }

      

      const productsJson = _product.toJSON();
      const { productCreatedBy, productUpdatedBy, ...rest } = productsJson;
      const product = {
        ...rest,
        createdBy: {
          userId: productCreatedBy.userId,
          name: productCreatedBy.name,
        },
        updatedBy: productUpdatedBy
          ? {
              userId: productUpdatedBy.userId,
              name: productUpdatedBy.name,
            }
          : null,
        packageCustom: undefined
      };

      if(product.category === ProductCat.PACKAGE){
        const packageProduct = await this.packageRepository.findAll({
          where: { sku },
          attributes: { exclude: ["deletedAt", "createdBy", "sku", "createdAt", "updatedAt", "updatedBy"] },
          include:[
            {
              model: ProductsCat,
              foreignKey: "category",
              as: "packageProductCat",
              attributes: [["category", "name"]],
              // [["category", "name"]]
            }
          ]
        });
        product.packageCustom = packageProduct;
      }

   
      return {
        message: `Se obtuvo el producto o servicio con el sku ${sku} exitosamente`,
        product: product,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    sku: string,
    updateProductDto: UpdateProductDto,
    userId: string
  ) {
    try {
      if (!isUUID(sku))
        throw new BadRequestException("El sku no cumple con el formato.");

      const _product = await this.productRepository.findByPk(sku);

      if (!_product) {
        throw new NotFoundException(
          `El sku  ${sku} para el producto o servicio no existe`
        );
      }

      const product = await this.productRepository.update(
        { ...updateProductDto, updatedBy: userId },
        { where: { sku }, returning: true, individualHooks: true }
      );

      const {
        deletedAt,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        ...restProduct
      } = product[1][0].dataValues;

      return {
        message: `Se actualizó el producto o servicio con el sku ${sku} exitosamente.`,
        product: restProduct,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(sku: string) {
    try {
      if (!isUUID(sku))
        throw new BadRequestException("El sku no cumple con el formato.");

      const product = await this.productRepository.findByPk(sku);

      if (!product) {
        throw new NotFoundException(
          `El producto o servicio con el sku ${sku} no existe.`
        );
      }

      await this.productRepository.destroy({
        where: { sku },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó correctamente el producto o servicio con el sku ${sku}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.log("Error:", error.message, error.stack);
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.productLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
