import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateSeedDto } from "./dto/create-seed.dto";
import { RegimenFiscal } from "src/regimen-fiscal/entities";
import { readFile } from "fs/promises";
import { Users } from "src/users/entities";
import { UsoCfdi } from "src/uso-cfdi/entities";
import { Day } from "src/days/entities/day.entity";
import { ClassScheduleCat } from "src/class-schedule-cat/entities";
import { ProductsCat } from "src/products-cat/entities";
@Injectable()
export class SeedService {
  private readonly seedLogger = new Logger("Seed Service");

  constructor(
    @Inject("REGIMEN_FISCAL_REPOSITORY")
    private readonly regimenFiscalRepository: typeof RegimenFiscal,
    @Inject("USERS_REPOSITORY")
    private readonly usersRepository: typeof Users,
    @Inject("USO_CFDI_REPOSITORY")
    private readonly usoCfdiRepository: typeof UsoCfdi,
    @Inject("DAYS_REPOSITORY")
    private readonly daysRepository: typeof Day,
    @Inject("CLASS_SCHEDULE_CAT_REPOSITORY")
    private readonly classScheduleCategoryRepository: typeof ClassScheduleCat,
    @Inject("PRODUCTS_CAT_REPOSITORY")
    private readonly productsCatRepository: typeof ProductsCat
  ) {}

  async create(createSeedDto: CreateSeedDto) {
    
    const catRegimenFiscal = await readFile(
      `./src/seed/data/catalogo_regimen_fiscal.sql`,
      "utf-8"
    );

    await this.regimenFiscalRepository.sequelize.query(catRegimenFiscal);
    this.seedLogger.log("Catálogo de Regimen Fiscal creado con éxito");

    const users = await readFile(`./src/seed/data/users.sql`, "utf-8");

    try {
      await this.usersRepository.sequelize.query(users);
      this.seedLogger.log("Usuarios creados con éxito");
    } catch (error) {
      console.log(error);
    }

    const usoCfdi = await readFile(`./src/seed/data/uso_CFDI.sql`, "utf-8");

    try {
      await this.usoCfdiRepository.sequelize.query(usoCfdi);
      this.seedLogger.log("Catálogo de usoCFDI creado con éxito");
    } catch (error) {
      console.log(error);
    }

    const days = await readFile(`./src/seed/data/days.sql`, "utf-8");

    try {
      await this.daysRepository.sequelize.query(days);
      this.seedLogger.log("Catálogo de dias creado con éxito");
    } catch (error) {
      console.log(error);
    }

    const classScheduleCat = await readFile(
      `./src/seed/data/class_category.sql`,
      "utf-8"
    );

    try {
      await this.classScheduleCategoryRepository.sequelize.query(
        classScheduleCat
      );
      this.seedLogger.log("Catálogo de tipo de clases creado con éxito");
    } catch (error) {
      console.log(error);
    }

    const productsCat = await readFile(
      `./src/seed/data/product_category.sql`,
      "utf-8"
    );

    try {
      await this.productsCatRepository.sequelize.query(productsCat);
      this.seedLogger.log("Catálogo de productos creado con éxito");
    } catch (error) {
      console.log(error);
    }
  }
}
