import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMultimediaDto } from './dto/create-multimedia.dto';
import { UpdateMultimediaDto } from './dto/update-multimedia.dto';
import { Multimedia } from './entities';
import { Users } from 'src/users/entities';

@Injectable()
export class MultimediaService {

  private readonly motivationalQuotelLogger = new Logger(
    "Multimedia Service"
  );
  constructor(
    @Inject("MULTIMEDIA_REPOSITORY")
    private readonly multimediaRepository: typeof Multimedia
  ) {}

  async create(createMultimediaDto: CreateMultimediaDto, userId: string) {
    try {
      const multimedia = await this.multimediaRepository.create({
        ...createMultimediaDto,
        createdBy: userId,
      });
      const { deletedAt, updatedAt, updatedBy, createdBy, ...restMultimedia } =
        multimedia.dataValues;

      return {
        message: `Se creó el medio ${createMultimediaDto.title} exitosamente`,
        medio: restMultimedia,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const multimedia = await this.multimediaRepository.findAll({
        order: [['createdAt', 'DESC']], 
        attributes: { exclude: ['deletedAt', 'updatedAt', 'createdBy', 'updatedBy'] }, 
      }); 

      return {
        "message": `Se obtuvieron ${multimedia.length} medios exitosamente`,
        "total": multimedia.length,
        "multimedia": multimedia,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const _multimedia = await this.multimediaRepository.findByPk(id, {
        order: [["createdAt", "ASC"]],
        attributes: { exclude: ["deletedAt", "createdBy"] },
        include: [
          {
            model: Users,
            as: "multimediaCreatedBy",
            foreignKey: "createdBy",
            attributes: ["userId", "name"],
          },
          {
            model: Users,
            as: "multimediaUpdatedBy",
            foreignKey: "updatedBy",
            attributes: ["userId", "name"],
          },
        ],
      });

      if( !_multimedia ) {
        throw new NotFoundException(`El medio con el id ${id} no existe`);
      }

      const medioJson = _multimedia.toJSON();
      const { multimediaCreatedBy,multimediaUpdatedBy, ...rest } = medioJson; 
      const multimedia = {
        ...rest, 
        createdBy: {
          userId: multimediaCreatedBy.userId,
          name: multimediaCreatedBy.name,
        }, 
        updatedBy: multimediaUpdatedBy ? {
          userId: multimediaUpdatedBy.userId,
          name: multimediaUpdatedBy.name,
        } : null,
      }

      return {
        "message": `Se obtuvo el medio con el id ${id} exitosamente`, 
        "multimedia": multimedia,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, updateMultimediaDto: UpdateMultimediaDto, userId: string) {
    try {

      const _multimedia = await this.multimediaRepository.findByPk(id);

      if (!_multimedia) {
        throw new NotFoundException(`El id ${id} para el medio no existe`);
      }

      const multimedia = await this.multimediaRepository.update(
        { ...updateMultimediaDto, updatedBy: userId },
        { where: { id }, returning: true, individualHooks: true });

      const { deletedAt, createdBy, updatedBy,  ...restMultimedia } = multimedia[1][0].dataValues;

      return {
        message: `Se actualizó el medio con el id ${id} exitosamente.`,
        multimedia: restMultimedia,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

 async remove(id: number) {
    try {
      const movitationalQuote =
        await this.multimediaRepository.findByPk(id);

      if (!movitationalQuote) {
        throw new NotFoundException(
          `El medio con el id ${id} no existe`
        );
      }

      await this.multimediaRepository.destroy({
        where: { id },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó correctamente el medio con el id ${id}`,
      };
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
      this.motivationalQuotelLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
