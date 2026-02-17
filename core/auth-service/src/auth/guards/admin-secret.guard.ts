import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

@Injectable()
export class AdminSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      throw new UnauthorizedException('Admin API is not configured');
    }
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<{ req: Request }>().req;
    const header = req.headers['x-admin-secret'];
    const value = typeof header === 'string' ? header : Array.isArray(header) ? header[0] : undefined;
    if (value !== secret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
    return true;
  }
}
