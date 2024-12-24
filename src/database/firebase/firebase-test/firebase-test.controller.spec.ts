import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseTestController } from './firebase-test.controller';

describe('FirebaseTestController', () => {
  let controller: FirebaseTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseTestController],
    }).compile();

    controller = module.get<FirebaseTestController>(FirebaseTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
