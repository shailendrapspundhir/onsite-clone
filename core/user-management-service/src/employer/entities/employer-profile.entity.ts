import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EmployerProfile {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  companyName!: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  contactEmail!: string;

  @Field({ nullable: true })
  contactPhone?: string;

  @Field({ nullable: true })
  logoUrl?: string;

  private desiredRolesInternal: string[] = [];

  @Field(() => [String])
  get desiredRoles(): string[] {
    return [...this.desiredRolesInternal];
  }
  set desiredRoles(value: string[]) {
    this.desiredRolesInternal = Array.isArray(value) ? [...value] : [];
  }

  @Field(() => [String])
  get desiredRolesStorage(): string[] {
    return this.desiredRoles;
  }
  set desiredRolesStorage(value: string[]) {
    this.desiredRoles = value ?? [];
  }

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
