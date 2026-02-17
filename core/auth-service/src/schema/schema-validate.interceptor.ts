import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, from, switchMap } from 'rxjs';
import { SchemaRegistryService } from './schema-registry.service';
import { SCHEMA_VALIDATE_KEY } from './schema-validate.decorator';

@Injectable()
export class SchemaValidateInterceptor implements NestInterceptor {
  constructor(
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const schemaId = this.reflector.get<string | undefined>(SCHEMA_VALIDATE_KEY, context.getHandler());
    if (!schemaId) return next.handle();

    const gql = GqlExecutionContext.create(context);
    const args = gql.getArgs();
    const input = args?.input ?? args;
    if (input == null) return next.handle();

    return from(this.schemaRegistry.validate(schemaId, input)).pipe(
      switchMap((result) => {
        if (result.valid) return next.handle();
        console.error('Schema validation failed for', schemaId, ':', JSON.stringify(result.errors, null, 2));
        throw new BadRequestException({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: result.errors,
        });
      }),
    );
  }
}
