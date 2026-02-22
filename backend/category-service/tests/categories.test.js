const request = require('supertest');

const mockCategory = {
  _id: '648a000000000000000000b1',
  name: 'Electronics',
  description: 'Electronic items',
  slug: 'electronics',
};

jest.mock('../src/models/Category', () => {
  const MockCategory = jest.fn().mockImplementation((data) => ({
    ...mockCategory,
    ...data,
    slug: (data.name || '').toLowerCase().replace(/\s+/g, '-'),
    save: jest.fn().mockResolvedValue(undefined),
    toJSON: jest.fn().mockReturnValue({ ...mockCategory, ...data }),
  }));
  MockCategory.find = jest.fn();
  MockCategory.findById = jest.fn();
  MockCategory.findByIdAndUpdate = jest.fn();
  MockCategory.findByIdAndDelete = jest.fn();
  return MockCategory;
});

const app = require('../src/index');
const Category = require('../src/models/Category');

describe('Category Service - Health', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('category-service');
  });
});

describe('Category Service - CRUD', () => {
  const categoryId = '648a000000000000000000b1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/categories creates a category', async () => {
    const instance = new Category({ name: 'Electronics', description: 'Electronic items' });
    Category.mockImplementationOnce(() => instance);
    const res = await request(app).post('/api/categories').send({ name: 'Electronics', description: 'Electronic items' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Electronics');
    expect(res.body.slug).toBe('electronics');
  });

  it('GET /api/categories returns list', async () => {
    Category.find.mockResolvedValue([mockCategory]);
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/categories/:id returns a category', async () => {
    Category.findById.mockResolvedValue(mockCategory);
    const res = await request(app).get(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(categoryId);
  });

  it('GET /api/categories/:id returns 404 when not found', async () => {
    Category.findById.mockResolvedValue(null);
    const res = await request(app).get(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(404);
  });

  it('PUT /api/categories/:id updates a category', async () => {
    Category.findByIdAndUpdate.mockResolvedValue({ ...mockCategory, name: 'Electronics Updated' });
    const res = await request(app).put(`/api/categories/${categoryId}`).send({ name: 'Electronics Updated', description: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Electronics Updated');
  });

  it('DELETE /api/categories/:id deletes a category', async () => {
    Category.findByIdAndDelete.mockResolvedValue(mockCategory);
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Category deleted');
  });

  it('DELETE /api/categories/:id returns 404 when not found', async () => {
    Category.findByIdAndDelete.mockResolvedValue(null);
    const res = await request(app).delete(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(404);
  });
});
