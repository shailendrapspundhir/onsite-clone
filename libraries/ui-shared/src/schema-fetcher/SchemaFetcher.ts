// SchemaFetcher.ts
// A universal schema fetcher for web and React Native

export interface SchemaFetcherOptions {
  baseUrl: string;
  getToken?: () => Promise<string | undefined>;
}

export class SchemaFetcher {
  private baseUrl: string;
  private getToken?: () => Promise<string | undefined>;

  constructor(options: SchemaFetcherOptions) {
    this.baseUrl = options.baseUrl;
    this.getToken = options.getToken;
  }

  async fetchSchema(schemaName: string): Promise<any> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.getToken) {
      const token = await this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${this.baseUrl}/schemas/${schemaName}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch schema: ${res.statusText}`);
    return res.json();
  }
}
