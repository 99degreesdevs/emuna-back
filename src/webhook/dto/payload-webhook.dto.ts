import { IsString, IsUUID, IsIn } from "class-validator";
import { Status } from "../interfaces/status-pay.enum";

export class PaylodWebhookDto {
  @IsUUID("4", { message: "El id de usuario no es válido" })
  @IsString({ message: "El id de usuario debe de ser string" })
  userId: string;

  @IsUUID("4", { message: "El id de la orden no válido" })
  @IsString({ message: "El id de la orden debe de ser string" })
  orderId: string;

  @IsString({ message: "El estado de pago debe de ser string" })
  @IsIn([Status.approved, Status.pending, Status.rejected], {
    message: "El estado de pago no cumple con el formato.",
  })
  status: Status;
}
