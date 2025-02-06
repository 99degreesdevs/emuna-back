import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMotivationalQuoteDto } from './dto/create-motivational-quote.dto';
import { UpdateMotivationalQuoteDto } from './dto/update-motivational-quote.dto'; 
import { MotivationalQuote } from './entities'; 
import { Users } from 'src/users/entities';
import { Op } from 'sequelize';
import * as moment from 'moment';

@Injectable()
export class MotivationalQuotesService {
  private readonly motivationalQuotelLogger = new Logger(
    "Motivational Quote Service"
  );
  constructor(
    @Inject("MOTIVATIONAL_QUOTE_REPOSITORY")
    private readonly motivationalQuoteRepository: typeof MotivationalQuote
  ) {}

  async create(
    createMotivationalQuoteDto: CreateMotivationalQuoteDto,
    userId: string
  ) {
    try { 

      const motivationalQuote = await this.motivationalQuoteRepository.create({
        ...createMotivationalQuoteDto,
        createdBy: userId,
      });
      const { deletedAt, updatedAt, updatedBy,  ...restMotivationalQuote } = motivationalQuote.dataValues;

      //TODO: Implementar notificación ONE SIGNAL si es necesario.
      return {
        message: 'Se creó la frase motivacional exitosamente',
        motivationalQuote: restMotivationalQuote,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const allQuotes = await this.motivationalQuoteRepository.findAll({
        order: [['createdAt', 'DESC']], 
        attributes: { exclude: ['deletedAt', 'updatedAt', 'createdBy', 'updatedBy', 'isNotificated'] }, 
      }); 

      return {
        "message": `Se obtuvieron  ${allQuotes.length} frases motivacionales exitosamente`,
        "total": allQuotes.length,
        "motivationalQuotes": allQuotes,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async findQuoteDay(){
    try {

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const quoteDay = await this.motivationalQuoteRepository.findOne({
        where: { 
          publicationDate: {
            [Op.gte]: startOfToday,
            [Op.lt]: endOfToday,
          },
      
        },
        order: [['createdAt', 'DESC']], 
        attributes: { exclude: ['deletedAt', 'updatedAt', 'createdBy', 'updatedBy', 'isNotificated', 'createdAt'] }, 
      });  

      if( !quoteDay ) {
        throw new NotFoundException(`No se encontró una frase motivacional para el día de hoy`);
      }
      

      const { publicationDate,  ...restMotivationalQuote } = quoteDay.dataValues;
      return {
        "message": `Se obtuvo la frase motivacional del día exitosamente`,
        "quoteDay": { publicationDate:moment(publicationDate).format('YYYY-MM-DD HH:mm:ss'),  ...restMotivationalQuote} 
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const _quote = await this.motivationalQuoteRepository.findByPk(id, {
        order: [["createdAt", "ASC"]],
        attributes: { exclude: ["deletedAt", "createdBy"] },
        include: [
          {
            model: Users,
            as: "quoteCreatedBy",
            foreignKey: "createdBy",
            attributes: ["userId", "name"],
          },
          {
            model: Users,
            as: "quoteUpdatedBy",
            foreignKey: "updatedBy",
            attributes: ["userId", "name"],
          },
        ],
      });

      if( !_quote ) {
        throw new NotFoundException(`La frase motivacional con el id ${id} no existe`);
      }

      const quoteJson = _quote.toJSON();
      const { quoteCreatedBy,quoteUpdatedBy, ...rest } = quoteJson; 
      const motivationalQuote = {
        ...rest, 
        createdBy: {
          userId: quoteCreatedBy.userId,
          name: quoteCreatedBy.name,
        }, 
        updatedBy: quoteUpdatedBy ? {
          userId: quoteUpdatedBy.userId,
          name: quoteUpdatedBy.name,
        } : null,
      }

      return {
        "message": `Se obtuvo la frase motivacional con el id ${id} exitosamente`, 
        "motivationalQuote": motivationalQuote,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, updateMotivationalQuoteDto: UpdateMotivationalQuoteDto, userId: string) {
    try {

      const _quote = await this.motivationalQuoteRepository.findByPk(id);

      if (!_quote) {
        throw new NotFoundException(`El id ${id} para la frase motivacional no existe`);
      }

      const motivationalQuote = await this.motivationalQuoteRepository.update(
        { ...updateMotivationalQuoteDto, updatedBy: userId },
        { where: { id }, returning: true, individualHooks: true });

      const { deletedAt, createdBy, updatedBy, isNotificated, ...restMotivationalQuote } = motivationalQuote[1][0].dataValues;

      return {
        message: `Se actualizó la frase motivacional con el ${id} exitosamente.`,
        motivationalQuote: restMotivationalQuote,
      }

    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      const movitationalQuote =
        await this.motivationalQuoteRepository.findByPk(id);

      if (!movitationalQuote) {
        throw new NotFoundException(
          `La frase motivacional con el id ${id} no existe`
        );
      }

      await this.motivationalQuoteRepository.destroy({
        where: { id },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó correctamente la frase motivacional con el id ${id}`,
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
