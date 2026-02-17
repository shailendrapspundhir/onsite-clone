import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { SchemaValidateInterceptor } from '../schema/schema-validate.interceptor';

export const SCHEMA_VALIDATE_KEY = 'schemaValidate';

/**
 * Validate the mutation/query input with the given schema ID (from JSON Schema registry).
 * Use: @SchemaValidate('auth.register') on the resolver method.
 * Expects args.input or first arg to be the payload. On failure throws BadRequestException with errors (message + code).
 */
export const SchemaValidate = (schemaId: string) =>
  applyDecorators(
    SetMetadata(SCHEMA_VALIDATE_KEY, schemaId),
    UseInterceptors(SchemaValidateInterceptor),
  );