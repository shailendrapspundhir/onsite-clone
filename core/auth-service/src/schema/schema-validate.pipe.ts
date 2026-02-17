import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { SchemaRegistryService } from './schema-registry.service';

/**
 * Pipe that validates input against a JSON Schema (from registry).
 * Use with @SchemaValidate('auth.register') to validate with schema + error messages/codes.
 */
@Injectable()
export class SchemaValidatePipe implements PipeTransform {
  constructor(
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly schemaId: string,
  ) {}

  async transform(value: unknown, _metadata: ArgumentMetadata): Promise<unknown> {
    const result = await this.schemaRegistry.validate(this.schemaId, value);
    if (result.valid) return value;
    throw new BadRequestException({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: result.errors,
    });
  }
}
