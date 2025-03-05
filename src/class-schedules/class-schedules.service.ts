import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateClassScheduleDto } from "./dto/create-class-schedule.dto";
import { UpdateClassScheduleDto } from "./dto/update-class-schedule.dto";
import { ClassSchedule } from "./entities";
import { Users } from "src/users/entities";
import { Day } from "src/days/entities";
import { ClassScheduleCat } from "src/class-schedule-cat/entities";
import { PageMetaDto } from "src/common/pagination";
import { SearchClassScheduleDto } from "./dto";
import { Op } from "sequelize";

import * as moment from "moment";
import { Credit } from "src/credits/entities";
import { ClassScheduleTransaction } from "src/class-schedule-transaction/entities";
import { Sequelize } from "sequelize-typescript";
import { ClassTransactionStatus } from "src/class-schedule-transaction/interfaces/statusClassTransaction.enum";

@Injectable()
export class ClassSchedulesService {
  private readonly classSchedulesQuotelLogger = new Logger(
    "Class Schedule Service"
  );
  constructor(
    @Inject("CLASS_SCHEDULE_REPOSITORY")
    private readonly classScheduleRepository: typeof ClassSchedule,

    @Inject("CLASS_SCHEDULE_CAT_REPOSITORY")
    private readonly classScheduleCatRepository: typeof ClassScheduleCat,

    @Inject("CREDIT_REPOSITORY")
    private readonly userCreditsCatRepository: typeof Credit,

    @Inject("CLASS_SCHEDULE_TRANSACTION_REPOSITORY")
    private readonly classScheduleTransactionRepository: typeof ClassScheduleTransaction,

    private readonly sequelize: Sequelize
  ) {}
  async create(createClassScheduleDto: CreateClassScheduleDto, userId: string) {
    try {
      const classStart = moment(createClassScheduleDto.classDateStart);

      const category = createClassScheduleDto.category;

      const categoryExist = await this.classScheduleCatRepository.findByPk(
        createClassScheduleDto.category
      );

      if (!categoryExist) {
        throw new BadRequestException(
          `La categoría con el id ${category} no existe`
        );
      }

      const newClassSchedule = await this.classScheduleRepository.create({
        ...createClassScheduleDto,
        createdBy: userId,
      });
      const {
        deletedAt,
        updatedAt,
        updatedBy,
        createdBy,
        ...restNewClassSchedule
      } = newClassSchedule.dataValues;
      return {
        message: "Se creó la clase correctamente",
        classSchedule: restNewClassSchedule,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const allClasseSchedules = await this.classScheduleRepository.findAll({
        order: [["classId", "ASC"]],
        attributes: {
          exclude: [
            "deletedAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "isNotificated",
          ],
        },
      });

      const _classSchedule = allClasseSchedules.map((classSchedule) => {
        return {
          classId: classSchedule.classId,
          createAt: this.handleDate(classSchedule.createdAt),
          classDateStart: this.handleDate(classSchedule.classDateStart),
          classDateEnd: this.handleDate(classSchedule.classDateEnd), 
          day: classSchedule.day,
          dayName: classSchedule.dayName,
          scheduleStart: classSchedule.scheduleStart,
          scheduleEnd: classSchedule.scheduleEnd,
          duration: classSchedule.duration,
          category: classSchedule.category,
          class: classSchedule.class,
          description: classSchedule.description,
          link: classSchedule.link,
          teacher: classSchedule.teacher,
          places: classSchedule.places,
          availablePlaces: classSchedule.availablePlaces,
          isActive: classSchedule.isActive,
        };
      });

      return {
        message: `Se obtuvieron  ${allClasseSchedules.length} clases exitosamente`,
        total: allClasseSchedules.length,
        classSchedules: _classSchedule,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllPage(pageOptionsDto: SearchClassScheduleDto) {
    const whereConditions: any = {};

    if (pageOptionsDto.category && pageOptionsDto.category > 0) {
      whereConditions.category = pageOptionsDto.category;
    }

    if (pageOptionsDto.day && pageOptionsDto.day > 0) {
      whereConditions.day = pageOptionsDto.day;
    }

    if (pageOptionsDto.isActive) {
      whereConditions.isActive = pageOptionsDto.isActive;
    }

    if (pageOptionsDto.classDate) {
      const targetDate = moment(pageOptionsDto.classDate).startOf("day");
      whereConditions.classDateStart = {
        [Op.gte]: targetDate.toDate(),
        [Op.lt]: targetDate.clone().endOf("day").toDate(),
      };
    }

    const itemCount = await this.classScheduleRepository.count({
      where: whereConditions,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return await this.classScheduleRepository
      .findAll({
        offset: (pageOptionsDto.page - 1) * pageOptionsDto.take,
        limit: pageOptionsDto.take,
        order: [["createdAt", pageOptionsDto.order]],
        where: whereConditions,
        attributes: { exclude: ["updatedAt", "deletedAt", "updatedBy"] },
      })
      .then((classSchedule) => {
        if (classSchedule.length === 0)
          throw new NotFoundException(
            "Actualmente no hay registros de clases disponibles. Por favor, intente nuevamente más tarde."
          );

        const _classSchedule = classSchedule.map((classSchedule) => {
          return {
            classId: classSchedule.classId,
            createAt: this.handleDate(classSchedule.createdAt),
            classDateStart: this.handleDate(classSchedule.classDateStart),
            classDateEnd: this.handleDate(classSchedule.classDateEnd), 
            day: classSchedule.day,
            dayName: classSchedule.dayName,
            scheduleStart: classSchedule.scheduleStart,
            scheduleEnd: classSchedule.scheduleEnd,
            duration: classSchedule.duration,
            category: classSchedule.category,
            class: classSchedule.class,
            description: classSchedule.description,
            link: classSchedule.link,
            teacher: classSchedule.teacher,
            places: classSchedule.places,
            availablePlaces: classSchedule.availablePlaces,
            isActive: classSchedule.isActive,
          };
        });

        return {
          message: "ok",
          classSchedule: _classSchedule,
          meta: pageMetaDto,
        };
      })
      .catch((err) => this.handleError(err));
  }

  private handleDate(date: any) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }

  async findOne(id: number) {
    try {
      const classScheduleExist = await this.classScheduleRepository.findByPk(
        id,
        {
          order: [["createdAt", "ASC"]],
          attributes: { exclude: ["deletedAt", "createdBy", "day"] },
          include: [
            {
              model: Day,
              as: "classScheduleDay",
              foreignKey: "day",
              attributes: ["day"],
            },
            {
              model: Users,
              as: "createdClassBy",
              foreignKey: "createdBy",
              attributes: ["userId", "name"],
            },
            {
              model: Users,
              as: "updatedClassBy",
              foreignKey: "updatedBy",
              attributes: ["userId", "name"],
            },
          ],
        }
      );

      if (!classScheduleExist) {
        throw new NotFoundException(`La clase con el id ${id} no existe`);
      }

      const classJson = classScheduleExist.toJSON();
      const { createdClassBy, updatedClassBy, classScheduleDay, ...rest } =
        classJson;
      const classSchedule = {
        ...rest,
        day: classScheduleDay.day,
        createdBy: {
          userId: createdClassBy.userId,
          name: createdClassBy.name,
        },
        updatedBy: updatedClassBy
          ? {
              userId: updatedClassBy.userId,
              name: updatedClassBy.name,
            }
          : null,
      };

      return {
        message: `Se obtuvo la clase con el id ${id} exitosamente`,
        classSchedule: classSchedule,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: number,
    updateClassScheduleDto: UpdateClassScheduleDto,
    userId: string
  ) {
    try {
      const classScheduleExist =
        await this.classScheduleRepository.findByPk(id);

      if (!classScheduleExist) {
        throw new NotFoundException(`El id ${id} para la clase no existe`);
      }

      const classSchedule = await this.classScheduleRepository.update(
        { ...updateClassScheduleDto, updatedBy: userId },
        { where: { classId: id }, returning: true, individualHooks: true }
      );

      const { deletedAt, createdBy, updatedBy, ...restclassScheduleExist } =
        classSchedule[1][0].dataValues;

      return {
        message: `Se actualizó la clase con el ${id} exitosamente.`,
        classSchedule: restclassScheduleExist,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const movitationalQuote = await this.classScheduleRepository.findByPk(id);

      if (!movitationalQuote) {
        throw new NotFoundException(`La clase con el id ${id} no existe`);
      }

      await this.classScheduleRepository.destroy({
        where: { classId: id },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó correctamente la clase con el id ${id}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateExpiredClassSchedules() {
    await this.classScheduleRepository.update(
      { isActive: false },
      {
        where: {
          classDateStart: {
            [Op.lt]: new Date(),
          },
        },
      }
    );
    this.classSchedulesQuotelLogger.log(
      "Se actualizaron las clases expiradas correctamente"
    );
  }

  async reserveClass(classId: number, userId: string) {
    const transaction = await this.sequelize.transaction();

    try {
      const classScheduleExist =
        await this.classScheduleRepository.findByPk(classId);

      if (!classScheduleExist) {
        throw new NotFoundException(`La clase con el id ${classId} no existe`);
      }

      if (classScheduleExist.availablePlaces === 0) {
        throw new BadRequestException(
          `No hay lugares disponibles para la clase: ${classScheduleExist.class}`
        );
      }

      const userCredits = await this.userCreditsCatRepository.findOne({
        where: { userId: userId, category: 2, isActive: true },
      });

      const classTransaction =
        await this.classScheduleTransactionRepository.findOne({
          where: {
            userId,
            classId,
            status: ClassTransactionStatus.RESERVED,
            isActive: true,
          },
        });

      if (classTransaction) {
        throw new BadRequestException(
          `Ya tienes una reservación para la clase: ${classScheduleExist.class}`
        );
      }

      if (!userCredits) {
        throw new BadRequestException(
          `No tienes creditos disponibles para reservar la clase: ${classScheduleExist.class}`
        );
      }

      // 1. Create Class Schedule Transaction
      await this.classScheduleTransactionRepository.create(
        {
          creditId: userCredits.credit,
          userId,
          classId,
        },
        { transaction }
      );

      // 2. Decrement available places
      await this.classScheduleRepository.decrement(
        { availablePlaces: 1 },
        { where: { classId }, transaction }
      );

      // 3. Update user credits
      await this.userCreditsCatRepository.update(
        { isActive: false },
        { where: { credit: userCredits.credit }, transaction }
      );

      // Commit transaction
      await transaction.commit();

      return {
        message: `Se reservó correctamente la clase: ${classScheduleExist.class}`,
      };
    } catch (error) {
      await transaction.rollback();
      this.handleError(error);
    }
  }

  async cancelClassReservation(classId: number, userId: string) {
    const transaction = await this.sequelize.transaction();

    try {
      const classScheduleExist =
        await this.classScheduleRepository.findByPk(classId);

      if (!classScheduleExist) {
        throw new NotFoundException(`La clase con el id ${classId} no existe`);
      }

      const classTransaction =
        await this.classScheduleTransactionRepository.findOne({
          where: {
            userId,
            classId,
            status: ClassTransactionStatus.RESERVED,
            isActive: true,
          },
          include: [
            {
              model: ClassSchedule,
              foreignKey: "classId",
              as: "classTransactionClass",
              attributes: ["classDateStart"],
            },
          ],
        });

      if (!classTransaction) {
        throw new BadRequestException(
          `No tienes una reservación para la clase: ${classScheduleExist.class}`
        );
      }

      if (
        !this.handleValideHours(
          classTransaction.classTransactionClass.classDateStart
        )
      ) {
        throw new BadRequestException(
          `No puedes cancelar la clase: ${classScheduleExist.class}. Solo puedes cancelar con 4 horas de anticipación`
        );
      }
      // 1. Update Class Schedule Transaction
      await this.classScheduleTransactionRepository.update(
        { isActive: false, status: ClassTransactionStatus.CANCELED },
        {
          where: { transactionId: classTransaction.transactionId },
          transaction,
        }
      );

      // 2. Increment available places
      await this.classScheduleRepository.increment(
        { availablePlaces: 1 },
        { where: { classId }, transaction }
      );

      // 3. Update user credits
      await this.userCreditsCatRepository.update(
        { isActive: true },
        { where: { credit: classTransaction.creditId }, transaction }
      );

      // Commit transaction
      await transaction.commit();

      return {
        message: `Se canceló correctamente la reservación de la clase: ${classScheduleExist.class}`,
      };
    } catch (error) {
      await transaction.rollback();
      this.handleError(error);
    }
  }

  private handleValideHours(dateString: Date): boolean {
    const targetDate = moment(dateString);
    const currentDate = moment();
    const datePlusFourHours = currentDate.add(4, "hours");
    return targetDate.isAfter(datePlusFourHours);
  }

  private handleError(error: any) {
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.classSchedulesQuotelLogger.error(
        "Error:",
        error.message,
        error.stack
      );
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
