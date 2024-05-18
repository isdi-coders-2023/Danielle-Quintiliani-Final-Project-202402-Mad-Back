import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51PHCenDHHHMG1QR5tXGCrHBrkFNNaODoiQ37aHaa3vvlhZ0AtPf3VBFP75ksoxiE0ARQPmGuLnT5yu0XlO0s6V9g00pBMrZiH1',
      {
        apiVersion: '2024-04-10',
      },
    );
  }

  async createPaymentIntent(
    amount: number,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
    });
  }
}
