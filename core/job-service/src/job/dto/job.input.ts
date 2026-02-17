import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsBoolean, IsDateString, Min, MaxLength, MinLength } from 'class-validator';
import { JobRole, EmploymentType, JobStatus } from '@onsite360/types';

@InputType()
export class CreateJobInput {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @Field()
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  description: string;

  @Field(() => String)
  @IsEnum(JobRole)
  role: JobRole;

  @Field(() => String)
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  location: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  salaryDisplay?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  closesAt?: string;
}

@InputType()
export class UpdateJobInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(JobRole)
  role?: JobRole;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  salaryDisplay?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  closesAt?: string;
}

export enum JobSearchSortBy {
  PUBLISHED_AT = 'PUBLISHED_AT',
  CREATED_AT = 'CREATED_AT',
  TITLE = 'TITLE',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(JobSearchSortBy, { name: 'JobSearchSortBy' });
registerEnumType(SortOrder, { name: 'SortOrder' });

@InputType()
export class JobSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  query?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(JobRole)
  role?: JobRole;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @Field({ nullable: true })
  @IsOptional()
  page?: number;

  @Field({ nullable: true })
  @IsOptional()
  pageSize?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(JobSearchSortBy)
  sortBy?: JobSearchSortBy;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
