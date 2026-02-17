import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  items: User[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  pageSize: number;

  @Field()
  totalPages: number;

  @Field()
  hasNext: boolean;

  @Field()
  hasPrevious: boolean;
}
