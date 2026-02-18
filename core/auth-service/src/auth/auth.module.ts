import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { RedisModule } from '../redis/redis.module';
import { InMemoryDatabaseModule } from '../in-memory-database/in-memory-database.module';

@Module({
  imports: [
    InMemoryDatabaseModule,
    JwtModule,
    RedisModule,
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
