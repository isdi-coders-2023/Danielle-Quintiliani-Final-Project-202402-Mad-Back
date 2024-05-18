import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: { amount: number },
  ) {
    const paymentIntent = await this.paymentService.createPaymentIntent(
      createPaymentIntentDto.amount,
    );
    return { clientSecret: paymentIntent.client_secret };
  }
}
