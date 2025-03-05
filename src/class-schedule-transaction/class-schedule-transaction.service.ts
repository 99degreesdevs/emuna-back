import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common"; 
import { ClassScheduleTransaction } from "./entities";
import { SearchClassScheduleTransactionDto } from "./dto/search-transaction.dto";
import {
  PageMetaDto,
  PageOptionsDto, 
} from "src/common/pagination";
import { ClassSchedule } from "src/class-schedules/entities";
import { Users } from "src/users/entities";

import * as moment from "moment";

@Injectable()
export class ClassScheduleTransactionService {
  private readonly classScheduleTransactionLogger = new Logger(
    "Class Schedule Transaction Service"
  );

  constructor(
    @Inject("CLASS_SCHEDULE_TRANSACTION_REPOSITORY")
    private readonly classScheduleTransactionRepository: typeof ClassScheduleTransaction
  ) {}

  async findAll(pageOptionsDto: SearchClassScheduleTransactionDto) {
    const whereConditions: any = {};

    if (pageOptionsDto.creditId && pageOptionsDto.creditId !== "") {
      whereConditions.creditId = pageOptionsDto.creditId;
    }

    if (pageOptionsDto.classId && pageOptionsDto.classId > 0) {
      whereConditions.classId = pageOptionsDto.classId;
    }

    if (pageOptionsDto.isActive) {
      whereConditions.isActive = pageOptionsDto.isActive;
    }

    if (pageOptionsDto.status) {
      whereConditions.status = pageOptionsDto.status;
    }

    if (pageOptionsDto.userId && pageOptionsDto.userId !== "") {
      whereConditions.userId = pageOptionsDto.userId;
    }

    const itemCount = await this.classScheduleTransactionRepository.count({
      where: whereConditions,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return await this.classScheduleTransactionRepository
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
            "Actualmente no hay registros de transacciones disponibles. Por favor, intente nuevamente más tarde."
          );

        return {
          message: "ok",
          classSchedule: classSchedule,
          meta: pageMetaDto,
        };
      })
      .catch((err) => this.handleError(err));
  }

  async findOne(transactionId: number) {
    try {
      const transaction = await this.classScheduleTransactionRepository
        .findOne({
          where: { transactionId },
          attributes: { exclude: ["deletedAt"] },
          include: [
            {
              model: ClassSchedule,
              attributes: [
                "classId",
                "class",
                "classDateStart",
                "classDateStart",
                "classDateEnd",
              ],
            },
            {
              model: Users,
              attributes: ["userId", "email"],
            },
          ],
        })
        .then((classSchedule) => {
          if (!classSchedule)
            throw new NotFoundException(
              "No se encontró la transacción de horario de clase solicitada."
            );

          return classSchedule;
        });

      if (!transaction) {
        throw new NotFoundException(
          "No se encontró la transacción solicitada."
        );
      }

      const dataTransaction = {
        transactionId: transaction.transactionId,
        creditId: transaction.creditId,
        status: transaction.status,
        isActive: transaction.isActive,
        createdAt: moment(transaction.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment(transaction.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        class: {
          classId: transaction.classTransactionClass.classId,
          class: transaction.classTransactionClass.class,
          classDateStart: moment(
            transaction.classTransactionClass.classDateStart
          ).format("YYYY-MM-DD HH:mm:ss"),
          classDateEnd: moment(
            transaction.classTransactionClass.classDateEnd
          ).format("YYYY-MM-DD HH:mm:ss"),
        },
        user: {
          userId: transaction.classScheduleTransactionUser.userId,
          email: transaction.classScheduleTransactionUser.email,
        },
      };

      return dataTransaction;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMyClasess(userId: string, pageOptionsDto: PageOptionsDto) {
    try {
      const itemCount = await this.classScheduleTransactionRepository.count({
        where: { userId },
      });
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      const _transaction =
        await this.classScheduleTransactionRepository.findAll({
          where: {
            userId,
            isActive: true
          },
          offset: (pageOptionsDto.page - 1) * pageOptionsDto.take,
          limit: pageOptionsDto.take,
          order: [["createdAt", pageOptionsDto.order]],
          attributes: { exclude: ["updatedAt", "deletedAt", "updatedBy"] },
          include: [
            {
              model: ClassSchedule,
              attributes: [
                "classId",
                "class",
                "classDateStart",
                "classDateStart",
                "classDateEnd",
              ],
            },
          ],
        });

      if (!_transaction) {
        throw new NotFoundException(
          "Actualmente no cuentas con registros de clase disponibles. Por favor, intente nuevamente más tarde."
        );
      }

      const transaction = _transaction.map((transaction) => {
        return {
          transactionId: transaction.transactionId,
          creditId: transaction.creditId,
          status: transaction.status,
          isActive: transaction.isActive,
          createdAt: moment(transaction.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          updatedAt: moment(transaction.updatedAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          class: {
            classId: transaction.classTransactionClass.classId,
            class: transaction.classTransactionClass.class,
            teacher: transaction.classTransactionClass.teacher,
            classDateStart: moment(
              transaction.classTransactionClass.classDateStart
            ).format("YYYY-MM-DD HH:mm:ss"),
            classDateEnd: moment(
              transaction.classTransactionClass.classDateEnd
            ).format("YYYY-MM-DD HH:mm:ss"),
          },
        };
      });
      return {
        message: "ok",
        transaction: transaction,
        meta: pageMetaDto,
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
      this.classScheduleTransactionLogger.error(
        "Error:",
        error.message,
        error.stack
      );
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
