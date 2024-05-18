import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

const mock = {
  createPaymentIntent: jest.fn().mockResolvedValue({ client_secret: 'secret' }),
};
describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mock,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a payment intent', async () => {
    const mockDto = { amount: 100 };
    expect(await controller.createPaymentIntent(mockDto)).toEqual({
      clientSecret: 'secret',
    });
  });
});
