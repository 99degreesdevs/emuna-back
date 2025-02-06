import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateCreditDto } from "./dto/create-credit.dto";
import { UpdateCreditDto } from "./dto/update-credit.dto";
import { Credit } from "./entities";

@Injectable()
export class CreditsService {
  private readonly creditsLogger = new Logger("Credits Service");

  constructor(
    @Inject("CREDIT_REPOSITORY")
    private readonly creditRepository: typeof Credit
  ) {}

  async myCredits(userId: string) {
    try {
      const credits = await this.creditRepository.findAll({
        where: {
          userId,
          isActive: true,
        },
      });
   
      const categoryCount = credits.reduce((acc, credit) => {
        if (credit.category === 2) {
          acc.clases = (acc.clases || 0) + 1;
        } else if (credit.category === 3) {
          acc.ceremonias = (acc.ceremonias || 0) + 1;
        } else if( credit.category === 5){
          acc.servicios = (acc.servicios || 0) + 1;
        }
        return acc;
      }, { clases: 0, ceremonias: 0, servicios: 0 });
  
      return categoryCount;
  
    } catch(error){
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.log(error);
    if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      this.creditsLogger.error("Error:", error.message, error.stack);
      throw new InternalServerErrorException("Consulte al administrador");
    }
  }
}
