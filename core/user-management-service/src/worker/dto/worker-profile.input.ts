import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray, IsEnum, IsNumber, Min, Max, IsUrl, IsDateString, MaxLength, MinLength } from 'class-validator';
import { JobRole } from '@onsite360/types';

@InputType()
class EmploymentPreferenceInput {
  @Field(() => String)
  @IsEnum(JobRole)
  role: JobRole;

  @Field()
  @IsString()
  employmentType: string;

  @Field({ nullable: true })
  @IsOptional()
  preferred?: boolean;
}

@InputType()
export class CreateWorkerProfileInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @Field(() => [String])
  @IsArray()
  @IsEnum(JobRole, { each: true })
  skills: JobRole[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(70)
  experienceYears?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];

  @Field(() => [EmploymentPreferenceInput])
  @IsArray()
  availability: EmploymentPreferenceInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

@InputType()
export class UpdateWorkerProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(JobRole, { each: true })
  skills?: JobRole[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(70)
  experienceYears?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
