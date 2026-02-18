import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { OtpChannel } from '@onsite360/types';
import { User } from './user.entity';

registerEnumType(OtpChannel, { name: 'OtpChannel' });

@ObjectType()
export class OtpSecret {
  @Field()
  id!: string;

  userId!: string;

  user?: User;

  @Field(() => OtpChannel)
  channel!: OtpChannel;

  secret!: string;

  @Field()
  createdAt!: Date;
}
