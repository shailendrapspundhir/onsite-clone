import { SchemaFetcher } from './SchemaFetcher';

describe('SchemaFetcher', () => {
  const baseUrl = 'http://localhost:3000';
  let fetcher: SchemaFetcher;

  beforeEach(() => {
    fetcher = new SchemaFetcher({ baseUrl });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'test', type: 'object' }),
    }) as any;
  });

  it('fetches schema by name', async () => {
    const schema = await fetcher.fetchSchema('test');
    expect(schema).toEqual({ id: 'test', type: 'object' });
    expect(global.fetch).toHaveBeenCalledWith(
      `${baseUrl}/schemas/test`,
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('throws on error', async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false, statusText: 'Not Found' });
    await expect(fetcher.fetchSchema('bad')).rejects.toThrow('Failed to fetch schema: Not Found');
  });
});
