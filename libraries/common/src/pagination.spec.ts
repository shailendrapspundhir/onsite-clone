import { normalizePagination, buildPaginatedResult } from './pagination';

describe('pagination', () => {
  describe('normalizePagination', () => {
    it('uses defaults when input is empty', () => {
      const r = normalizePagination(undefined);
      expect(r.page).toBe(1);
      expect(r.pageSize).toBe(20);
      expect(r.offset).toBe(0);
      expect(r.limit).toBe(20);
    });
    it('respects page and pageSize', () => {
      const r = normalizePagination({ page: 3, pageSize: 10 });
      expect(r.page).toBe(3);
      expect(r.pageSize).toBe(10);
      expect(r.offset).toBe(20);
      expect(r.limit).toBe(10);
    });
    it('caps pageSize at MAX_PAGE_SIZE', () => {
      const r = normalizePagination({ page: 1, pageSize: 500 });
      expect(r.pageSize).toBe(100);
    });
  });

  describe('buildPaginatedResult', () => {
    it('builds result with hasNext/hasPrevious', () => {
      const items = [{ id: '1' }, { id: '2' }];
      const r = buildPaginatedResult(items, 25, 1, 10);
      expect(r.items).toEqual(items);
      expect(r.total).toBe(25);
      expect(r.page).toBe(1);
      expect(r.pageSize).toBe(10);
      expect(r.totalPages).toBe(3);
      expect(r.hasNext).toBe(true);
      expect(r.hasPrevious).toBe(false);
    });
  });
});
