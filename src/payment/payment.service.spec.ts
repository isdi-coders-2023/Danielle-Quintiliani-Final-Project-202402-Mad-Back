import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
const mock = {
  createPaymentIntent: jest.fn().mockResolvedValue({ client_secret: 'secret' }),
  create: jest.fn().mockResolvedValue({ id: 1 }),
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
});
