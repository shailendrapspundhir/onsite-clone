import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const gql = GqlExecutionContext.create(ctx);
  const req = gql.getContext().req;
  return req?.userId as string;
});
