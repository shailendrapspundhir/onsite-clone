import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import type { ISchemaSource } from '../types';
import type { ValidationSchemaDoc } from '../types';

const DEFAULT_SCHEMAS_DIR = join(__dirname, '..', '..', '..', 'shared_static_assets', 'json_schemas');

/** Map schema ID to filename (without .json) for known schemas */
const SCHEMA_ID_TO_FILE: Record<string, string> = {
  'auth.register': 'auth',
  'auth.login': 'auth-login',
  'auth.otpSend': 'auth-otp',
  'auth.otpVerify': 'auth-otp-verify',
  'user.workerProfile': 'user-worker',
  'user.employerProfile': 'user-employer',
  'job.create': 'job',
  'job.application': 'job-application',
};

/**
 * Load schemas from the file system (default: package schemas/ directory).
 * Schema files must be JSON with $id matching the schemaId.
 */
export class FileSchemaSource implements ISchemaSource {
  name = 'file';
  private dir: string;
  private cache: Map<string, ValidationSchemaDoc> = new Map();

  constructor(dir: string = DEFAULT_SCHEMAS_DIR) {
    this.dir = dir;
  }

  async getSchema(schemaId: string): Promise<ValidationSchemaDoc | null> {
    const cached = this.cache.get(schemaId);
    if (cached) return cached;

    const normalized = schemaId.replace(/\./g, '-');
    const explicitFile = SCHEMA_ID_TO_FILE[schemaId];
    const paths = [
      ...(explicitFile ? [join(this.dir, `${explicitFile}.json`)] : []),
      join(this.dir, `${normalized}.json`),
      join(this.dir, `${schemaId}.json`),
      join(this.dir, schemaId + '.json'),
    ].filter(Boolean);
    for (const filePath of paths) {
      if (existsSync(filePath)) {
        try {
          const raw = readFileSync(filePath, 'utf-8');
          const doc = JSON.parse(raw) as ValidationSchemaDoc;
          doc.$id = doc.$id ?? schemaId;
          this.cache.set(schemaId, doc);
          return doc;
        } catch {
          continue;
        }
      }
    }
    // Try loading from index / single consolidated file
    const allPath = join(this.dir, 'all.json');
    if (existsSync(allPath)) {
      try {
        const raw = readFileSync(allPath, 'utf-8');
        const all = JSON.parse(raw) as Record<string, ValidationSchemaDoc>;
        const doc = all[schemaId] ?? null;
        if (doc) {
          doc.$id = doc.$id ?? schemaId;
          this.cache.set(schemaId, doc);
          return doc;
        }
      } catch {
        // ignore
      }
    }
    return null;
  }

  async listSchemaIds(): Promise<string[]> {
    if (!existsSync(this.dir)) return [];
    const files = readdirSync(this.dir).filter((f: string) => f.endsWith('.json') && f !== 'error-codes.json');
    const ids: string[] = [];
    for (const f of files) {
      const base = f.replace(/\.json$/, '');
      const revMap = Object.fromEntries(Object.entries(SCHEMA_ID_TO_FILE).map(([k, v]) => [v, k]));
      const id = revMap[base] ?? base.replace(/-/g, '.');
      ids.push(id);
    }
    return ids;
  }

  /** Load error-codes.json for full catalog (codes + messages). */
  async loadErrorCodes(): Promise<{ codes?: Record<string, string>; messages?: Record<string, string> }> {
    const path = join(this.dir, 'error-codes.json');
    if (!existsSync(path)) return {};
    try {
      const raw = readFileSync(path, 'utf-8');
      const data = JSON.parse(raw) as { codes?: Record<string, string>; messages?: Record<string, string> };
      return { codes: data.codes, messages: data.messages };
    } catch {
      return {};
    }
  }
}
