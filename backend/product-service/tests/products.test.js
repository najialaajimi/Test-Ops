const request = require('supertest');

const categoryId = '648a1234567890abcdef1234';
const mockProduct = {
  _id: '648a000000000000000000c1',
  name: 'Laptop',
  description: 'A powerful laptop',
  price: 999.99,
  stock: 10,
  categoryId,
};

jest.mock('../src/models/Product', () => {
  const MockProduct = jest.fn().mockImplementation((data) => ({
    ...mockProduct,
    ...data,
    save: jest.fn().mockResolvedValue(undefined),
    toJSON: jest.fn().mockReturnValue({ ...mockProduct, ...data }),
  }));
  MockProduct.find = jest.fn();
  MockProduct.findById = jest.fn();
  MockProduct.findByIdAndUpdate = jest.fn();
  MockProduct.findByIdAndDelete = jest.fn();
  return MockProduct;
});

const app = require('../src/index');
const Product = require('../src/models/Product');

describe('Product Service - Health', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('product-service');
  });
});

describe('Product Service - CRUD', () => {
  const productId = '648a000000000000000000c1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/products creates a product', async () => {
    const instance = new Product({ name: 'Laptop', description: 'A powerful laptop', price: 999.99, stock: 10, categoryId });
    Product.mockImplementationOnce(() => instance);
    const res = await request(app).post('/api/products').send({ name: 'Laptop', description: 'A powerful laptop', price: 999.99, stock: 10, categoryId });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Laptop');
    expect(res.body.price).toBe(999.99);
  });

  it('GET /api/products returns list', async () => {
    Product.find.mockResolvedValue([mockProduct]);
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/products?categoryId filters by category', async () => {
    Product.find.mockResolvedValue([mockProduct]);
    const res = await request(app).get(`/api/products?categoryId=${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/products/:id returns a product', async () => {
    Product.findById.mockResolvedValue(mockProduct);
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(productId);
  });

  it('GET /api/products/:id returns 404 when not found', async () => {
    Product.findById.mockResolvedValue(null);
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(404);
  });

  it('PUT /api/products/:id updates a product', async () => {
    Product.findByIdAndUpdate.mockResolvedValue({ ...mockProduct, name: 'Laptop Pro', price: 1299.99 });
    const res = await request(app).put(`/api/products/${productId}`).send({ name: 'Laptop Pro', price: 1299.99, stock: 5, categoryId });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Laptop Pro');
  });

  it('DELETE /api/products/:id deletes a product', async () => {
    Product.findByIdAndDelete.mockResolvedValue(mockProduct);
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted');
  });

  it('DELETE /api/products/:id returns 404 when not found', async () => {
    Product.findByIdAndDelete.mockResolvedValue(null);
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(404);
  });
});
