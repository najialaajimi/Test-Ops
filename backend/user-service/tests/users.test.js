const request = require('supertest');

process.env.JWT_SECRET = 'test-secret';

const mockUser = {
  _id: '648a000000000000000000a1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  comparePassword: jest.fn(),
  save: jest.fn(),
  toJSON: jest.fn(),
};

jest.mock('../src/models/User', () => {
  const MockUser = jest.fn().mockImplementation((data) => ({
    ...mockUser,
    ...data,
    save: jest.fn().mockResolvedValue(undefined),
    toJSON: jest.fn().mockReturnValue({ _id: mockUser._id, name: data.name || mockUser.name, email: data.email || mockUser.email, role: 'user' }),
    comparePassword: jest.fn(),
  }));
  MockUser.findOne = jest.fn();
  MockUser.find = jest.fn();
  MockUser.findById = jest.fn();
  MockUser.findByIdAndUpdate = jest.fn();
  MockUser.findByIdAndDelete = jest.fn();
  return MockUser;
});

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn(),
}));

const app = require('../src/index');
const User = require('../src/models/User');

describe('User Service - Health', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('user-service');
  });
});

describe('User Service - Register & Login', () => {
  const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/users/register creates a new user', async () => {
    User.findOne.mockResolvedValue(null);
    const savedUser = { _id: mockUser._id, name: userData.name, email: userData.email, role: 'user' };
    const userInstance = new User(userData);
    userInstance.save.mockResolvedValue(undefined);
    userInstance.toJSON.mockReturnValue(savedUser);
    User.mockImplementationOnce(() => userInstance);

    const res = await request(app).post('/api/users/register').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBe('mock-jwt-token');
  });

  it('POST /api/users/register fails with duplicate email', async () => {
    User.findOne.mockResolvedValue({ email: userData.email });
    const res = await request(app).post('/api/users/register').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });

  it('POST /api/users/login succeeds with valid credentials', async () => {
    const userWithCompare = { ...mockUser, comparePassword: jest.fn().mockResolvedValue(true) };
    User.findOne.mockResolvedValue(userWithCompare);
    const res = await request(app).post('/api/users/login').send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('mock-jwt-token');
  });

  it('POST /api/users/login fails with wrong password', async () => {
    const userWithCompare = { ...mockUser, comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne.mockResolvedValue(userWithCompare);
    const res = await request(app).post('/api/users/login').send({ email: userData.email, password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/users/login fails with unknown email', async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post('/api/users/login').send({ email: 'unknown@example.com', password: 'password' });
    expect(res.statusCode).toBe(401);
  });
});

describe('User Service - CRUD', () => {
  const userId = '648a000000000000000000a1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/users returns list of users', async () => {
    User.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: userId, name: 'John', email: 'john@example.com' }]) });
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/users/:id returns a user', async () => {
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: userId, name: 'John', email: 'john@example.com' }) });
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  it('GET /api/users/:id returns 404 when not found', async () => {
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });

  it('PUT /api/users/:id updates a user', async () => {
    User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: userId, name: 'Jane Updated', email: 'jane@example.com' }) });
    const res = await request(app).put(`/api/users/${userId}`).send({ name: 'Jane Updated', email: 'jane@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Jane Updated');
  });

  it('DELETE /api/users/:id removes a user', async () => {
    User.findByIdAndDelete.mockResolvedValue({ _id: userId });
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });

  it('DELETE /api/users/:id returns 404 when not found', async () => {
    User.findByIdAndDelete.mockResolvedValue(null);
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});
