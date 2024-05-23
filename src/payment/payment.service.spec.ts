import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
const mock = {
  createPaymentIntent: jest.fn().mockResolvedValue({ client_secret: 'secret' }),
  create: jest.fn().mockResolvedValue({ id: 1 }),
};

export const mockPayment = {
  amount: 100,
  amount_capturable: 0,
  amount_details: {
    tip: {},
  },
  amount_received: 0,
  application: null,
  application_fee_amount: null,
  automatic_payment_methods: {
    allow_redirects: 'always',
    enabled: true,
  },
  canceled_at: null,
  cancellation_reason: null,
  capture_method: 'automatic_async',
  client_secret: 'pi_3PJaeqDHHHMG1QR51Q4h8LI5_secret_h9GztPxSxEOC7OrBwj83oZLrG',
  confirmation_method: 'automatic',
  created: 1716466929,
  currency: 'eur',
  customer: null,
  description: null,
  id: 'pi_3PJaeqDHHHMG1QR51Q4h8LI5',
  invoice: null,
  last_payment_error: null,
  latest_charge: null,
  livemode: false,
  metadata: {},
  next_action: null,
  object: 'payment_intent',
  on_behalf_of: null,
  payment_method: null,
  payment_method_configuration_details: null,
  payment_method_options: {
    card: {
      installments: null,
      mandate_options: null,
      network: null,
      request_three_d_secure: 'automatic',
    },
  },
  payment_method_types: ['card'],
  processing: null,
  receipt_email: null,
  review: null,
  setup_future_usage: null,
  shipping: null,
  source: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  status: 'requires_payment_method',
  transfer_data: null,
  transfer_group: null,
};
describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PaymentService, useValue: mock }],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a payment intent', async () => {
    const mockDto = { amount: 100 };
    const result = await service.createPaymentIntent(mockDto.amount);
    expect(result).toEqual({ client_secret: 'secret' });
  });
  it('when paymentIntention is called', async () => {
    const mockDto = 100;
    const result = await service.createPaymentIntent(mockDto);
    expect(result).toEqual({ client_secret: 'secret' });
  });
});
