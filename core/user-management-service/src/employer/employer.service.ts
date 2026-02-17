import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployerProfile } from './entities/employer-profile.entity';
import { RedisService } from '../redis/redis.service';
import { CACHE_TTL_USER_PROFILE } from '@onsite360/types';
import type { CreateEmployerProfileInput, UpdateEmployerProfileInput } from './dto/employer-profile.input';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(EmployerProfile) private repo: Repository<EmployerProfile>,
    private redis: RedisService,
  ) {}

  async create(userId: string, input: CreateEmployerProfileInput): Promise<EmployerProfile> {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) throw new ForbiddenException('Employer profile already exists for this user');

    const profile = this.repo.create({
      userId,
      companyName: input.companyName,
      industry: input.industry,
      description: input.description,
      website: input.website,
      location: input.location,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      logoUrl: input.logoUrl,
      desiredRolesStorage: input.desiredRoles.join(','),
    });
    const saved = await this.repo.save(profile);
    await this.invalidateCache(userId);
    return saved;
  }

  async findByUserId(userId: string): Promise<EmployerProfile | null> {
    const cacheKey = `employer:${userId}`;
    const cached = await this.redis.get<EmployerProfile>(cacheKey);
    if (cached) return cached as EmployerProfile;

    const profile = await this.repo.findOne({ where: { userId } });
    if (profile) await this.redis.set(cacheKey, { ...profile, desiredRoles: profile.desiredRoles } as unknown as Record<string, unknown>, CACHE_TTL_USER_PROFILE);
    return profile;
  }

  async findById(id: string): Promise<EmployerProfile> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Employer profile not found');
    return profile;
  }

  async update(userId: string, input: UpdateEmployerProfileInput): Promise<EmployerProfile> {
    const profile = await this.repo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Employer profile not found');

    if (input.companyName !== undefined) profile.companyName = input.companyName;
    if (input.industry !== undefined) profile.industry = input.industry;
    if (input.description !== undefined) profile.description = input.description;
    if (input.website !== undefined) profile.website = input.website;
    if (input.location !== undefined) profile.location = input.location;
    if (input.contactEmail !== undefined) profile.contactEmail = input.contactEmail;
    if (input.contactPhone !== undefined) profile.contactPhone = input.contactPhone;
    if (input.logoUrl !== undefined) profile.logoUrl = input.logoUrl;
    if (input.desiredRoles !== undefined) profile.desiredRolesStorage = input.desiredRoles.join(',');

    const saved = await this.repo.save(profile);
    await this.invalidateCache(userId);
    return saved;
  }

  private async invalidateCache(userId: string): Promise<void> {
    await this.redis.del(`employer:${userId}`);
  }
}
