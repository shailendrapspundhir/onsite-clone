import { Test, TestingModule } from '@nestjs/testing';
import { SchemaController } from './schema.controller';

describe('SchemaController', () => {
  let controller: SchemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchemaController],
    }).compile();
    controller = module.get<SchemaController>(SchemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns 404 for missing schema', async () => {
    await expect(controller.getSchema('notfound')).rejects.toThrow();
  });
});
