import { BadRequestException, Inject, Injectable, 
  InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegimenFiscalDto } from './dto/create-regimen-fiscal.dto';
import { UpdateRegimenFiscalDto } from './dto/update-regimen-fiscal.dto';
import { RegimenFiscal } from './entities';

@Injectable()
export class RegimenFiscalService {
  private readonly regimenFiscalLogger = new Logger('Users Service');
  constructor(
    @Inject('REGIMEN_FISCAL_REPOSITORY')
    private readonly regimenFiscalRepository: typeof RegimenFiscal,
  ) {

  }
  async create(createRegimenFiscalDto: CreateRegimenFiscalDto) {
    try {

      const { cRF } = createRegimenFiscalDto;

      const regimenFiscalExist = await this.regimenFiscalRepository.findOne({
        where: { cRF },
      });

      if (regimenFiscalExist) {
        throw new BadRequestException('El regimen fiscal ya existe, intente con otro');
      }

      const regimenFiscal = await this.regimenFiscalRepository.create(createRegimenFiscalDto);
      const { deletedAt, updatedAt, ...restRegimenFiscal } = regimenFiscal.dataValues;
      return {
        message: 'Regimen fiscal creado exitosamente',
        regimenFiscal: restRegimenFiscal,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const regimenFiscales = await this.regimenFiscalRepository.findAll(
        {
          order: [['cRF', 'ASC']],
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },

      );

      return {
        message: `Se obtuvieron ${regimenFiscales.length} regimenes fiscales exitosamente.`,
        total: regimenFiscales.length,
        regimenFiscales,
      };

    } catch (error) {
      this.handleError(error);

    }
  }

  async findOne(cRF: number) {
    try {
      const regimenFiscal = await this.regimenFiscalRepository.findByPk(cRF, {
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });


      if (!regimenFiscal) {
        throw new NotFoundException(`El regimen fiscal ${cRF} no existe`);
      }

      return {
        message: `Se obtuvo el regimen fiscal con el ${cRF} exitosamente.`,
        regimenFiscal,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async update(cRF: number, updateRegimenFiscalDto: UpdateRegimenFiscalDto) {
    try {

      const regimenFiscalExist = await this.regimenFiscalRepository.findByPk(cRF);

      if (!regimenFiscalExist) {
        throw new NotFoundException(`El regimen fiscal ${cRF} no existe`);
      }

      const regimenFiscal = await this.regimenFiscalRepository.update(
        { ...updateRegimenFiscalDto },
        { where: { cRF }, returning: true, individualHooks: true });

      const { deletedAt, ...restRegimenFiscal } = regimenFiscal[1][0].dataValues;

      return {
        message: `Se actualizó el regimen fiscal con el ${cRF} exitosamente.`,
        regimenFiscal: restRegimenFiscal,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(cRF: number) {
    try {
      const regimenFiscalExist = await this.regimenFiscalRepository.findByPk(cRF);

      if (!regimenFiscalExist) {
        throw new NotFoundException(`El regimen fiscal ${cRF} no existe`);
      }

      await this.regimenFiscalRepository.destroy({
        where: { cRF },
        individualHooks: true,
        cascade: true
      });

      return {
        message: `Se eliminó correctamente el Regimen Fiscal con el id ${cRF}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error?.parent?.code === '23503') {
      throw new BadRequestException('Error en los datos proporcionados', error?.parent?.detail);
    } else if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.regimenFiscalLogger.error('Error:', error.message, error.stack);
      throw new InternalServerErrorException('Consulte al administrador');
    }
  }
}
