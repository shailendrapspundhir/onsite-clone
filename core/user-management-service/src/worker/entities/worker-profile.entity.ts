import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class WorkerProfile {
  @Field()
  id!: string;

  @Field()
  userId!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  private skillsInternal: string[] = [];

  @Field(() => [String])
  get skills(): string[] {
    return [...this.skillsInternal];
  }
  set skills(value: string[]) {
    this.skillsInternal = Array.isArray(value) ? [...value] : [];
  }

  @Field(() => [String])
  get skillsStorage(): string[] {
    return this.skills;
  }
  set skillsStorage(value: string[]) {
    this.skills = value ?? [];
  }

  @Field({ nullable: true })
  experienceYears?: number;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  location?: string;

  private preferredLocationsInternal?: string[];

  @Field(() => [String], { nullable: true })
  get preferredLocations(): string[] | undefined {
    return this.preferredLocationsInternal ? [...this.preferredLocationsInternal] : undefined;
  }
  set preferredLocations(value: string[] | undefined) {
    this.preferredLocationsInternal = value?.length ? [...value] : undefined;
  }

  @Field(() => [String], { nullable: true })
  get preferredLocationsStorage(): string[] | undefined {
    return this.preferredLocations ? [...this.preferredLocations] : undefined;
  }
  set preferredLocationsStorage(value: string[] | undefined) {
    this.preferredLocations = value;
  }

  private certificationsInternal?: string[];

  @Field(() => [String], { nullable: true })
  get certifications(): string[] | undefined {
    return this.certificationsInternal ? [...this.certificationsInternal] : undefined;
  }
  set certifications(value: string[] | undefined) {
    this.certificationsInternal = value?.length ? [...value] : undefined;
  }

  @Field(() => [String], { nullable: true })
  get certificationsStorage(): string[] | undefined {
    return this.certifications ? [...(this.certifications ?? [])] : undefined;
  }
  set certificationsStorage(value: string[] | undefined) {
    this.certifications = value;
  }

  @Field({ nullable: true })
  resumeUrl?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
