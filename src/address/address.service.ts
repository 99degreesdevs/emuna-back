import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Users } from "src/users/entities";
import { Address } from "./entities";

@Injectable()
export class AddressService {
  private readonly addressLogger = new Logger("Address Service");
  constructor(
    @Inject("ADDRESS_REPOSITORY")
    private readonly addressRepository: typeof Address,
    @Inject("USERS_REPOSITORY")
    private readonly userRepository: typeof Users
  ) {}
  async create(createAddressDto: CreateAddressDto, user: Users) {
    try {
      let userId;

      if (createAddressDto.userId) {
        const user = await this.userRepository.findByPk(
          createAddressDto.userId
        );

        if (!user) {
          throw new BadRequestException(
            `El usuario con el id ${createAddressDto.userId} no existe`
          );
        }

        userId = createAddressDto.userId;
      } else {
        userId = user.userId;
      }

      const totalAddress = await this.addressRepository.count({
        where: { userId },
      });

      if (totalAddress >= 3) {
        console.log(totalAddress);
        throw new BadRequestException(
          `El usuario con el id ${userId} ya tiene ${totalAddress} direcciones registradas, 
          el máximo permitido es 3. Elimine una dirección para poder agregar otra.`
        );
      }

      if (createAddressDto.isDefault === true) {
        await this.addressRepository.update(
          { isDefault: false },
          { where: { userId } }
        );
      }

      return this.addressRepository.create({
        ...createAddressDto,
        createdBy: user.userId,
        userId: createAddressDto.userId ? createAddressDto.userId : user.userId,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(userId: string) {
    try {
      return await this.addressRepository.findAll({
        where: { userId },
        attributes: { exclude: ["createdBy", "updatedBy", "deletedAt"] },
        order: [["isDefault", "DESC"]],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const addressFind = await this.addressRepository.findByPk(id, {
        attributes: {
          exclude: ["userId", "deletedAt", "createdBy", "updatedBy"],
        },
        include: [
          {
            model: Users,
            as: "userIdAddress",
            foreignKey: "userId",

            attributes: ["userId", "name", "email", "phone"],
          },
          {
            model: Users,
            as: "createdUserAddressBy",
            foreignKey: "createdBy",
            attributes: ["userId", "name", "email"],
          },
          {
            model: Users,
            as: "updatedUserAddressBy",
            foreignKey: "updatedBy",
            attributes: ["userId", "name", "email"],
          },
        ],
      });

      if (!addressFind) {
        throw new NotFoundException(`La dirección con el id ${id} no existe`);
      }

      const addressJson = addressFind.toJSON();
      const {
        createdUserAddressBy,
        updatedUserAddressBy,
        userIdAddress,
        ...rest
      } = addressJson;
      const address = {
        ...rest,
        userInfo: {
          userId: userIdAddress.userId,
          name: userIdAddress.name,
          email: userIdAddress.email,
          phone: userIdAddress.phone,
        },
        createdBy: {
          userId: createdUserAddressBy.userId,
          name: createdUserAddressBy.name,
        },
        updatedBy: updatedUserAddressBy
          ? {
              userId: updatedUserAddressBy.userId,
              name: updatedUserAddressBy.name,
            }
          : null,
      };

      return {
        message: `Se obtuvo la dirección con el id ${id} exitosamente`,
        address,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, user: Users) {
    try {
      await this.findOne(id);

      let userId;

      if (updateAddressDto.userId) {
        const user = await this.userRepository.findByPk(
          updateAddressDto.userId
        );

        if (!user) {
          throw new BadRequestException(
            `El usuario con el id ${updateAddressDto.userId} no existe`
          );
        }

        userId = updateAddressDto.userId;
      } else {
        userId = user.userId;
      }

      if (updateAddressDto.isDefault === true) {
        await this.addressRepository.update(
          { isDefault: false },
          { where: { userId } }
        );
      }

      //TODO: VERIFICAR ESTA LINEA

      const address = await this.addressRepository.update(
        { ...updateAddressDto, updatedBy: userId },
        { where: { id, userId }, returning: true, individualHooks: true }
      );

      const { deletedAt, createdBy, updatedBy, ...restAddress } =
        address[1][0].dataValues;

      return {
        message: `Se actualizó la dirección con el ${id} exitosamente.`,
        address: restAddress,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const address = await this.addressRepository.findByPk(id);

      if (!address) {
        throw new NotFoundException(`La dirección con el id ${id} no existe`);
      }

      await this.addressRepository.destroy({
        where: { id },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó correctamente la dirección con el id ${id}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeUser(id: number, userId: string) {
    try {
      const address = await this.addressRepository.findOne({
        where: { id, userId },
      });

      if (!address) {
        throw new NotFoundException(`La dirección con el id ${id} no existe`);
      }

      await this.addressRepository.destroy({
        where: { id, userId },
        individualHooks: true,
        cascade: true,
      });

      return {
        message: `Se eliminó correctamente la dirección con el id ${id}`,
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
      this.addressLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
