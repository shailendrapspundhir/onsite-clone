import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SchemaRegistry } from '@onsite360/schemas';

@Controller('schemas')
export class SchemaController {
  private registry = new SchemaRegistry();

  @Get(':schemaId')
  async getSchema(@Param('schemaId') schemaId: string) {
    const schema = await this.registry.getSchemaForApi(schemaId);
    if (!schema) throw new NotFoundException('Schema not found');
    return schema;
  }
}
