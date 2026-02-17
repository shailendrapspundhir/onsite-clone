import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { UserType } from '@onsite360/types';

@InputType()
export class ListUsersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @Field({ nullable: true, description: 'Only users created on or after this ISO date' })
  @IsOptional()
  @IsDateString()
  since?: string;
}
