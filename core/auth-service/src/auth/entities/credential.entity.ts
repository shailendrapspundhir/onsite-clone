import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { AuthProvider } from '@onsite360/types';
import { User } from './user.entity';

registerEnumType(AuthProvider, { name: 'AuthProvider' });

@ObjectType()
export class Credential {
  @Field()
  id!: string;

  userId!: string;

  user?: User;

  @Field(() => AuthProvider)
  authProvider!: AuthProvider;

  passwordHash?: string;

  externalId?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
