import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerProfile } from './entities/worker-profile.entity';
import { RedisService } from '../redis/redis.service';
import { CACHE_TTL_USER_PROFILE } from '@onsite360/types';
import type { CreateWorkerProfileInput, UpdateWorkerProfileInput } from './dto/worker-profile.input';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(WorkerProfile) private repo: Repository<WorkerProfile>,
    private redis: RedisService,
  ) {}

  async create(userId: string, input: CreateWorkerProfileInput): Promise<WorkerProfile> {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) throw new ForbiddenException('Worker profile already exists for this user');

    const profile = this.repo.create({
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      skillsStorage: input.skills.join(','),
      experienceYears: input.experienceYears,
      bio: input.bio,
      location: input.location,
      preferredLocationsStorage: input.preferredLocations?.join(','),
      certificationsStorage: input.certifications?.join(','),
      resumeUrl: input.resumeUrl,
      avatarUrl: input.avatarUrl,
    });
    const saved = await this.repo.save(profile);
    await this.invalidateCache(userId);
    return saved;
  }

  async findByUserId(userId: string): Promise<WorkerProfile | null> {
    const cacheKey = `worker:${userId}`;
    const cached = await this.redis.get<WorkerProfile>(cacheKey);
    if (cached) return cached as WorkerProfile;

    const profile = await this.repo.findOne({ where: { userId } });
    if (profile) await this.redis.set(cacheKey, { ...profile, skills: profile.skills, preferredLocations: profile.preferredLocations, certifications: profile.certifications } as unknown as Record<string, unknown>, CACHE_TTL_USER_PROFILE);
    return profile;
  }

  async findById(id: string): Promise<WorkerProfile> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Worker profile not found');
    return profile;
  }

  async update(userId: string, input: UpdateWorkerProfileInput): Promise<WorkerProfile> {
    const profile = await this.repo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    if (input.firstName !== undefined) profile.firstName = input.firstName;
    if (input.lastName !== undefined) profile.lastName = input.lastName;
    if (input.dateOfBirth !== undefined) profile.dateOfBirth = new Date(input.dateOfBirth);
    if (input.skills !== undefined) profile.skillsStorage = input.skills.join(',');
    if (input.experienceYears !== undefined) profile.experienceYears = input.experienceYears;
    if (input.bio !== undefined) profile.bio = input.bio;
    if (input.location !== undefined) profile.location = input.location;
    if (input.preferredLocations !== undefined) profile.preferredLocations = input.preferredLocations;
    if (input.certifications !== undefined) profile.certifications = input.certifications;
    if (input.resumeUrl !== undefined) profile.resumeUrl = input.resumeUrl;
    if (input.avatarUrl !== undefined) profile.avatarUrl = input.avatarUrl;

    const saved = await this.repo.save(profile);
    await this.invalidateCache(userId);
    return saved;
  }

  async ensureCanAccess(userId: string, profileUserId: string): Promise<void> {
    if (userId !== profileUserId) throw new ForbiddenException('Not authorized to access this profile');
  }

  private async invalidateCache(userId: string): Promise<void> {
    await this.redis.del(`worker:${userId}`);
  }
}
