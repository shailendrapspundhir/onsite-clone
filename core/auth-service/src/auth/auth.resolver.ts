import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RegisterEmailInput } from './dto/register-email.input';
import { LoginEmailInput } from './dto/login.input';
import { OtpSendInput, OtpVerifyInput } from './dto/otp.input';
import { RefreshTokenInput } from './dto/refresh.input';
import { ListUsersInput } from './dto/list-users.input';
import { PaginatedUsers } from './dto/paginated-users.dto';
import { UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { SchemaValidate } from '../schema/schema-validate.decorator';
import { AdminSecretGuard } from './guards/admin-secret.guard';

@Resolver()
export class AuthResolver {
  constructor(private auth: AuthService) {}

  @Query(() => PaginatedUsers, {
    name: 'users',
    description: 'List users (admin only; requires X-Admin-Secret header).',
  })
  @UseGuards(AdminSecretGuard)
  async users(@Args('input') input: ListUsersInput) {
    return this.auth.listUsers(input);
  }

  @Mutation(() => AuthPayload, { name: 'registerWithEmail' })
  @SchemaValidate('auth.register')
  async registerWithEmail(@Args('input') input: RegisterEmailInput): Promise<AuthPayload> {
    const result = await this.auth.registerWithEmail(input);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
  }

  @Mutation(() => AuthPayload, { name: 'loginWithEmail' })
  @SchemaValidate('auth.login')
  async loginWithEmail(
    @Args('input') input: LoginEmailInput,
    @Context() context: { req: Request },
  ): Promise<AuthPayload> {
    const result = await this.auth.loginWithEmail(input, context.req.headers['user-agent'], context.req.socket.remoteAddress);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
  }

  @Mutation(() => OtpResponse)
  async sendOtp(@Args('input') input: OtpSendInput) {
    return this.auth.sendOtp(input);
  }

  @Mutation(() => AuthPayload, { nullable: true })
  async verifyOtpAndLogin(
    @Args('input') input: OtpVerifyInput,
    @Context() context: { req: Request },
  ): Promise<AuthPayload | null> {
    const result = await this.auth.verifyOtpAndLogin(input, context.req.headers['user-agent'], context.req.socket.remoteAddress);
    if (!result) return null;
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
  }

  @Mutation(() => AuthRefreshPayload)
  async refreshTokens(@Args('input') input: RefreshTokenInput) {
    return this.auth.refreshTokens(input.refreshToken);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Args('input') input: RefreshTokenInput) {
    return this.auth.logout(input.refreshToken);
  }
}

// GraphQL ObjectTypes (must be declared before use in decorators in same file)
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiresIn: number;
}

@ObjectType()
class AuthRefreshPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  expiresIn: number;
}

@ObjectType()
class OtpResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
class LogoutResponse {
  @Field()
  success: boolean;
}
