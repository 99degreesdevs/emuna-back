import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Order } from "src/orders/entities";
import { Status } from "./interfaces/status-pay.enum";
import { PaylodWebhookDto } from "./dto/payload-webhook.dto";
import { OrderStatus } from "src/orders/interfaces/orders_status.enum";
import { Package } from "src/package/entities";
import { Credit } from "src/credits/entities";
import { Shipment } from "src/shipments/entities";
import { Product } from "src/products/entities";
import { Sequelize } from "sequelize-typescript";

interface ProductsCategory {
  sku: string;
  product?: string;
  amount: number;
  price?: string;
  category?: number;
  discount?: string;
}

@Injectable()
export class WebhookService {
  private readonly webHookLogger = new Logger("WebHook Service");

  constructor(
    @Inject("ORDER_REPOSITORY")
    private readonly orderRepository: typeof Order,
    @Inject("PACKAGE_REPOSITORY")
    private readonly packageRepository: typeof Package,
    @Inject("CREDIT_REPOSITORY")
    private readonly creditRepository: typeof Credit,
    @Inject("SHIPMENT_REPOSITORY")
    private readonly shipmentRepository: typeof Shipment,
    @Inject("PRODUCT_REPOSITORY")
    private readonly productRepository: typeof Product,

    private readonly sequelize: Sequelize
  ) {}

  async updateStatusOrder(payloadWebhookDto: PaylodWebhookDto) {
    try {
      const order = await this.findOrder(payloadWebhookDto);

      this.validateOrder(order);

      switch (payloadWebhookDto.status) {
        case Status.rejected:
          return await this.handleRejectedOrder(payloadWebhookDto.orderId);
        case Status.pending:
          return await this.handlePendingOrder(payloadWebhookDto.orderId);
        case Status.approved:
          return this.handleApprovedOrder(order);
        default:
          throw new BadRequestException("Estado de la orden no reconocido.");
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private async findOrder(payloadWebhookDto: PaylodWebhookDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        order: payloadWebhookDto.orderId,
        buyerUser: payloadWebhookDto.userId,
      },
    });

    if (!order) {
      throw new NotFoundException(
        "No se encontró la orden con las credenciales proporcionadas."
      );
    }

    return order;
  }

  private validateOrder(order: Order): void {
    if (order.isFinished) {
      throw new BadRequestException("La orden ya ha sido finalizada.");
    }
  }

  private async handleRejectedOrder(orderId: string) {
    await this.orderRepository.update(
      { status: OrderStatus.CANCELADO, isFinished: true },
      { where: { order: orderId } }
    );
    return { message: "ok", status: 200 };
  }

  private async handlePendingOrder(orderId: string) {
    await this.orderRepository.update(
      { status: OrderStatus.PENDIENTE, isFinished: false },
      { where: { order: orderId } }
    );
    return { message: "ok", status: 200 };
  }

  private async handleApprovedOrder(products) {
    const {
      1: productos = [],
      2: clases = [],
      3: ceremonias = [],
      4: paquetes = [],
    } = this.categorizeProducts(products.products);

    if (paquetes.length !== 0) {
      const { 2: _clases = [], 3: _ceremonias = [] } =
        await this.getPackageItems(paquetes);
      if (_clases) clases.push(..._clases);
      if (_ceremonias) ceremonias.push(..._ceremonias);
    }

    if (clases.length !== 0)
      await this.genereteCredits(clases, 2, products.buyerUser, products.order);
    if (ceremonias.length !== 0)
      await this.genereteCredits(
        ceremonias,
        3,
        products.buyerUser,
        products.order
      );
    if (productos.length !== 0) {
      const itemsShiping = await this.sendProductsToPackage(
        productos,
        products.order,
        products.buyerUser,
        products.addressId
      );
      const transaction = await this.sequelize.transaction();
      const stockQuantityPromise = itemsShiping.map(async (product) => {
        return this.productRepository.decrement(
          { stockQuantity: 1 },
          { where: { sku: product.sku }, transaction },
          
        );
      });
      
      try {
        await Promise.all(stockQuantityPromise);
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        this.handleError(error);
      }
    }

    await this.orderRepository.update(
      { status: OrderStatus.PAGADO, isFinished: true },
      { where: { order: products.order } }
    );

    return { status: 200 };
  }

  private async sendProductsToPackage(
    products: any[],
    orderId: string,
    userId: string,
    addressId: number
  ) {
    const transaction = await this.sequelize.transaction();

    const packagePromises = products.map((product) => {
      return this.shipmentRepository.create({
        userId,
        orderId,
        sku: product.sku,
        amount: product.amount,
      },{ transaction });
    });

    try {
      const items =  await Promise.all(packagePromises);
      await transaction.commit();
      return items;
    } catch (error) {
      await transaction.rollback();
      this.handleError(error);
    }
  }

  private async genereteCredits(
    products: { sku: string; amount: number }[],
    category,
    userId,
    orderId: string
  ) {
    const transaction = await this.sequelize.transaction();
    const total = products.reduce(
      (total, product) => total + product.amount,
      0
    );

    const creditPromises = Array.from({ length: total }, () => {
      return this.creditRepository.create(
        {
          userId,
          orderId,
          category,
        },
        { transaction }
      );
    });

    try {
      await Promise.all(creditPromises);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      this.handleError(error);
    }
  }

  private async getPackageItems(packages: any[]) {
    const items = await this.packageRepository.findAll({
      where: { sku: packages.map((p) => p.sku) },
      attributes: ["sku", "category", "amount"],
    });

    return this.categorizeProducts(items);
  }

  private categorizeProducts(products: ProductsCategory[]) {
    return products.reduce(
      (acc, product) => {
        if (product.category) {
          acc[product.category] = acc[product.category] || [];
          acc[product.category].push({
            sku: product.sku,
            amount: product.amount,
          });
        }
        return acc;
      },
      {} as Record<number, { sku: string; amount: number }[]>
    );
  }

  private handleError(error: any) {
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.webHookLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
