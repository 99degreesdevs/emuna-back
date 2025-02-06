import { IsString, IsUUID } from "class-validator"; 

export class CreateWebhookDto {
    @IsUUID( '4', { message: "El id de usuario no es válido" })
    @IsString({ message: "El id de usuario debe de ser string" })
    userId: string;

    @IsUUID( '4', { message: "El id de la orden no válido" })
    @IsString({ message: "El id de la orden debe de ser string" })
    orderId: string;
}
