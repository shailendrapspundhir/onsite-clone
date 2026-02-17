import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { OtpChannel } from '@onsite360/types';

@InputType()
export class OtpSendInput {
  @Field(() => String)
  @IsEnum(OtpChannel)
  channel: OtpChannel;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone?: string;
}

@InputType()
export class OtpVerifyInput {
  @Field(() => String)
  @IsEnum(OtpChannel)
  channel: OtpChannel;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone?: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d{6}$/)
  otp: string;
}
