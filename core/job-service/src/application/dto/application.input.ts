import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { ApplicationStatus } from '@onsite360/types';

@InputType()
export class CreateApplicationInput {
  @Field()
  @IsUUID()
  jobId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverMessage?: string;
}

@InputType()
export class UpdateApplicationStatusInput {
  @Field(() => String)
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  employerNotes?: string;
}
