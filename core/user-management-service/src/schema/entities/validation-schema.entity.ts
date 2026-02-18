export class ValidationSchema {
  id!: string;
  name!: string;
  version = 1;
  schemaJson!: Record<string, unknown>;
  createdAt!: Date;
  updatedAt!: Date;
}