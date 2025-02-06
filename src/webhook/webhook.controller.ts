import {
  Controller, 
  Post,
  Body, 
  Res,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { PaylodWebhookDto } from "./dto/payload-webhook.dto";
import { Response } from "express";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("ipn")
  async ipn(@Res() res: Response, @Body() paylodWebhookDto: PaylodWebhookDto) {
    const response: any =
      await this.webhookService.updateStatusOrder(paylodWebhookDto);
    if (response.status === 200) {
      return res.status(200).json(response.message);
    }

    return response;
  }
}
