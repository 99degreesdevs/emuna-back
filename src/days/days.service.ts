import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'; 
import { UpdateDayDto } from './dto/update-day.dto';
import { Day } from './entities/day.entity';

@Injectable()
export class DaysService {
  private readonly daysLogger = new Logger(
    "Days Service"
  );
  constructor(
    @Inject("DAYS_REPOSITORY")
    private readonly daysRepository: typeof Day
  ) {}

  async findAll() {
    
    try {
      const allDays = await this.daysRepository.findAll({
        order: [['id', 'ASC']], 
        attributes: { exclude: [  'updatedAt', 'updatedBy', 'createdAt'] }, 
      }); 

      return {
        "message": `Se obtuvieron  ${allDays.length} días exitosamente`,
        "total": allDays.length,
        "days": allDays,
      }

    } catch (error) { 
      this.handleError(error);
    }
  } 

  async update(id: number, updateDayDto: UpdateDayDto, userId: string) {
    try {

      const findDay = await this.daysRepository.findByPk(id);

      if (!findDay) {
        throw new NotFoundException(`El día con el id ${id} no existe`);
      }

      const day = await this.daysRepository.update(
        { ...updateDayDto, updatedBy: userId },
        { where: { id }, returning: true, individualHooks: true });

      const {  updatedBy,updatedAt, createdAt,  ...restDay  } = day[1][0].dataValues;

      return {
        message: `El día con el id ${id} fue actualizado exitosamente`,
        day: restDay,
      }

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
      this.daysLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
 
}
