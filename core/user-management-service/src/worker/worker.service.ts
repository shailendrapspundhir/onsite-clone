import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { WorkerProfile } from './entities/worker-profile.entity';
import { RedisService } from '../redis/redis.service';
import { CACHE_TTL_USER_PROFILE } from '@onsite360/types';
import type { CreateWorkerProfileInput, UpdateWorkerProfileInput } from './dto/worker-profile.input';
import { InMemoryDatabaseService } from '../in-memory-database/in-memory-database.service';
import { Logger as LoggerDecorator } from '@onsite360/common'; // @LoggerDecorator for input/output debug logs (pretty JSON on DEBUG)

// Logs added across services for DEBUG/INFO/etc (via env LOG_LEVEL)
// Helps pinpoint profile errors, mutations etc.

@Injectable()
export class WorkerService {
  constructor(
    private db: InMemoryDatabaseService,
    private redis: RedisService,
  ) {}

  get repo() { return this.db.getWorkerProfileRepository(); }

  @LoggerDecorator()
  async create(userId: string, input: CreateWorkerProfileInput): Promise<WorkerProfile> {
    Logger.debug(`Creating worker profile for user ${userId}`, { input: { ...input, skills: input.skills?.length } }, 'WorkerService');

    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) {
      Logger.warn(`Profile already exists for user ${userId}`, 'WorkerService');
      throw new ForbiddenException('Worker profile already exists for this user');
    }

    const profile = this.repo.create({
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      skills: input.skills,
      experienceYears: input.experienceYears,
      bio: input.bio,
      location: input.location,
      preferredLocations: input.preferredLocations,
      certifications: input.certifications,
      resumeUrl: input.resumeUrl,
      avatarUrl: input.avatarUrl,
    });
    const saved = await this.repo.save(profile);
    await this.invalidateCache(userId);
    Logger.log(`Worker profile created for ${userId}: ${saved.id}`, 'WorkerService');
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
    if (input.skills !== undefined) profile.skills = input.skills;
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
