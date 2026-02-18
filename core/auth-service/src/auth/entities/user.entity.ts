import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { UserType } from '@onsite360/types';

registerEnumType(UserType, { name: 'UserType' });

@ObjectType()
export class User {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => UserType)
  userType!: UserType;

  @Field()
  isEmailVerified: boolean = false;

  @Field()
  isPhoneVerified: boolean = false;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  credentials?: unknown[];
  sessions?: unknown[];
}
