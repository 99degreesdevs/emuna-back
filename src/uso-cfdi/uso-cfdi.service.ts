import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsoCfdiDto } from './dto/create-uso-cfdi.dto';
import { UpdateUsoCfdiDto } from './dto/update-uso-cfdi.dto';
import { UsoCfdi } from './entities';

@Injectable()
export class UsoCfdiService {

  private readonly usoCFDILogger = new Logger('Users Service');
  constructor(
    @Inject('USO_CFDI_REPOSITORY')
    private readonly usoCFDIRepository: typeof UsoCfdi,
  ) { }


  async create(createUsoCfdiDto: CreateUsoCfdiDto) {
    try {

      const { cUsoCFDI } = createUsoCfdiDto;

      const usoCFDIExist = await this.usoCFDIRepository.findByPk(cUsoCFDI, { paranoid: false }); 

      if (usoCFDIExist) {
        throw new BadRequestException(`El uso de CFDI: ${cUsoCFDI} ya existe. Si no aparece en la lista disponible, es posible que esté inhabilitado. Contacte al administrador para habilitarlo.`);
      }

      const usoCFDI = await this.usoCFDIRepository.create(createUsoCfdiDto);
      const { deletedAt, updatedAt, ...restusoCFEDI } = usoCFDI.dataValues;
      return {
        message: 'Uso CFDI creado exitosamente',
        usoCFDI: restusoCFEDI,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const usoCFDI = await this.usoCFDIRepository.findAll(
        {
          order: [['cUsoCFDI', 'ASC']],
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },

      );

      return {
        message: `Se obtuvieron ${usoCFDI.length} uso de CFDI exitosamente.`,
        total: usoCFDI.length,
        usoCFDI,
      };

    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(cUsoCFDI: string) {
    try {

      const usoCFDI = await this.usoCFDIRepository.findByPk(cUsoCFDI, {
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      });

      if (!usoCFDI) {
        throw new NotFoundException('El uso de CFDI no existe');
      }

      return {
        message: `Uso de CFDI encontrado exitosamente`,
        usoCFDI,
      };

    } catch (error) {
      this.handleError(error);
    }
  }

  async update(cUsoCFDI: string, updateUsoCfdiDto: UpdateUsoCfdiDto) {

    await this.checkIfUsoCFDIExists(cUsoCFDI);

    try {

      await this.checkIfUsoCFDIExists(cUsoCFDI);

      const usoCFDI = await this.usoCFDIRepository.update(
        { ...updateUsoCfdiDto },
        { where: { cUsoCFDI }, returning: true, individualHooks: true }
      );

      const { deletedAt, ...restusoCFDI } = usoCFDI[1][0].dataValues;

      return {
        message: `Uso de CFDI con el id ${cUsoCFDI} actualizado exitosamente`,
        usoCFDI: restusoCFDI,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(cUsoCFDI: string) { 

    await this.checkIfUsoCFDIExists(cUsoCFDI);

    try {
      await this.usoCFDIRepository.destroy({
        where: { cUsoCFDI },
        individualHooks: true, 
      });

      return {
        message: `Se eliminó correctamente el Uso de CFDI con el id ${cUsoCFDI}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private async checkIfUsoCFDIExists(cUsoCFDI: string) {
    const existingcUsoCFDI = await this.usoCFDIRepository.findByPk(cUsoCFDI); 
    if (!existingcUsoCFDI) {
      throw new NotFoundException(`El el uso de CFDI ${cUsoCFDI} no existe`);
    }
  }
  
  private handleError(error: any) {
    if (error?.parent?.code === '23503') {
      throw new NotFoundException('Error en los datos proporcionados', error?.parent?.detail);
    } else if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      console.log(error)
      this.usoCFDILogger.error('Error:', error.message, error.stack);
      throw new InternalServerErrorException('Consulte al administrador');
    }
  }
}
