import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  IsNumber,
  IsUUID,
  IsUrl,
  Matches,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { UserType, OtpChannel, JobRole, EmploymentType, ApplicationStatus } from '@onsite360/types';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@onsite360/types';

/**
 * Reusable validation DTOs (can be used in NestJS pipes and frontend)
 */

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize?: number = DEFAULT_PAGE_SIZE;
}

export class EmailDto {
  @IsEmail()
  email!: string;
}

export class PasswordDto {
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;
}

export class PhoneDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid E.164 phone number' })
  phone!: string;
}

export class RegisterEmailDto extends EmailDto {
  @IsEnum(UserType)
  userType!: UserType;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;
}

export class LoginEmailDto extends EmailDto {
  @IsString()
  @MinLength(1)
  password!: string;
}

export class OtpSendDto {
  @IsEnum(OtpChannel)
  channel!: OtpChannel;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone?: string;
}

export class OtpVerifyDto {
  @IsEnum(OtpChannel)
  channel!: OtpChannel;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phone?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d{6}$/)
  otp!: string;
}

export class WorkerProfileCreateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsArray()
  @IsEnum(JobRole, { each: true })
  skills!: JobRole[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(70)
  experienceYears?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];

  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class EmployerProfileCreateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  companyName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsEmail()
  contactEmail!: string;

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  contactPhone?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsArray()
  @IsEnum(JobRole, { each: true })
  desiredRoles!: JobRole[];
}

export class JobCreateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  description!: string;

  @IsEnum(JobRole)
  role!: JobRole;

  @IsEnum(EmploymentType)
  employmentType!: EmploymentType;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  location!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  salaryCurrency?: string;

  @IsOptional()
  salaryDisplay?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsDateString()
  closesAt?: string;
}

export class JobSearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  query?: string;

  @IsOptional()
  @IsEnum(JobRole)
  role?: JobRole;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(JobRole, { each: true })
  skills?: JobRole[];
}

export class ApplicationCreateDto {
  @IsUUID()
  jobId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverMessage?: string;
}

export class ApplicationStatusUpdateDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  employerNotes?: string;
}

export class IdParamDto {
  @IsUUID()
  id!: string;
}
