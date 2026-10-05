import { cache } from '../src/services/cache.service.js';

describe('Backend Cache Service & Invalidation', () => {
  beforeEach(async () => {
    await cache.invalidate('*');
  });

  it('should set and get values with TTL', async () => {
    await cache.set('products:list:page1', { items: [{ id: 1 }] }, 60);
    const cached = await cache.get('products:list:page1');
    expect(cached).toEqual({ items: [{ id: 1 }] });
  });

  it('should return null for non-existent keys', async () => {
    const cached = await cache.get('products:nonexistent');
    expect(cached).toBeNull();
  });

  it('should delete a specific key with del()', async () => {
    await cache.set('product:prod-1', { id: 'prod-1' }, 60);
    await cache.del('product:prod-1');
    const cached = await cache.get('product:prod-1');
    expect(cached).toBeNull();
  });

  it('should invalidate all keys matching wildcard pattern products:*', async () => {
    await cache.set('products:list:page1', { items: [1] }, 60);
    await cache.set('products:list:page2', { items: [2] }, 60);
    await cache.set('products:rail:trending', { items: [3] }, 60);
    await cache.set('categories:tree', { categories: ['women'] }, 60);

    // Invalidate only products pattern
    await cache.invalidate('products:*');

    expect(await cache.get('products:list:page1')).toBeNull();
    expect(await cache.get('products:list:page2')).toBeNull();
    expect(await cache.get('products:rail:trending')).toBeNull();

    // categories should remain untouched
    const categoriesCached = await cache.get('categories:tree');
    expect(categoriesCached).toEqual({ categories: ['women'] });
  });

  it('should invalidate category keys matching pattern categories:*', async () => {
    await cache.set('categories:tree', { tree: true }, 60);
    await cache.set('categories:slug:women-ethnic', { id: 'cat-1' }, 60);

    await cache.invalidate('categories:*');

    expect(await cache.get('categories:tree')).toBeNull();
    expect(await cache.get('categories:slug:women-ethnic')).toBeNull();
  });
});
