import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateShipmentDto } from './dto/update-shipment.dto'; 
import { Shipment } from './entities';
import { SearchShipmentDto } from './dto/search-shipint.dto';
import { PageMetaDto } from 'src/common/pagination';
import { Order } from 'src/orders/entities';
import { Users } from 'src/users/entities';

@Injectable()
export class ShipmentsService {
 
  private readonly shipmentsLogger = new Logger("Products Service");


  constructor(
    @Inject("SHIPMENT_REPOSITORY")
    private readonly shipmentsRepository: typeof Shipment, 
  ) {}

  async findAll(pageOptionsDto: SearchShipmentDto, orderId: string) {
    const whereConditions: any = {};

    whereConditions.orderId = orderId;

    if (pageOptionsDto.status && pageOptionsDto.status !== "") {
      whereConditions.status = pageOptionsDto.status;
    }

    const itemCount = await this.shipmentsRepository.count({
      where: whereConditions,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return await this.shipmentsRepository
      .findAll({
        offset: (pageOptionsDto.page - 1) * pageOptionsDto.take,
        limit: pageOptionsDto.take,
        order: [["createdAt", pageOptionsDto.order]],
        where: whereConditions,
        attributes: { exclude: ["deletedAt"] },
        include: [
          {
            model: Order,
            attributes: { exclude: ["deletedAt"] }
          }
        ]
      })
      .then((shipments) => {
        if (shipments.length === 0)
          throw new NotFoundException(
            "Actualmente no hay envios regitrados. Por favor, intente nuevamente más tarde."
          );

        return {
          message: "ok",
          shipments: shipments,
          meta: pageMetaDto,
        };
      })
      .catch((err) => this.handleError(err));
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return `This action updates a #${id} shipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }

  private handleError(error: any) {
    console.log("Error:", error.message, error.stack);
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.shipmentsLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
