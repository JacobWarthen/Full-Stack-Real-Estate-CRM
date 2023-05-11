const request = require('supertest');
const app = require('./app');
const pool = require('./db');

beforeAll(async () => {
  await pool.connect();
});

afterAll(async () => {
  await pool.end();
});

describe('GET /todos/:userEmail', () => {
  it('responds with JSON containing all todos for a specific user', async () => {
    const userEmail = 'test@test.com';
    const response = await request(app).get(`/todos/${userEmail}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('POST /todos', () => {
  it('responds with JSON containing the new todo when supplied with valid data', async () => {
    const todo = {
      user_email: 'test@test.com',
      title: 'Test Todo',
      progress: 0,
      date: '2023-05-08T14:27:12.367Z',
      status: 'New',
    };
    const response = await request(app)
      .post('/todos')
      .send(todo);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(todo);
  });

  it('responds with an error when supplied with invalid data', async () => {
    const todo = {
      user_email: 'test@test.com',
      progress: 0,
      date: '2023-05-08T14:27:12.367Z',
      status: 'New',
    };
    const response = await request(app)
      .post('/todos')
      .send(todo);
    expect(response.statusCode).toBe(500);
  });
});

describe('PUT /todos/:id', () => {
  it('responds with JSON containing the updated todo when supplied with valid data', async () => {
    const id = 'bf76a071-c988-4245-ab83-1b1af6b6f973';
    const todo = {
      user_email: 'test@test.com',
      title: 'Updated Test Todo',
      progress: 50,
      date: '2023-05-08T14:27:12.367Z',
      status: 'In Progress',
    };
    const response = await request(app)
      .put(`/todos/${id}`)
      .send(todo);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(todo);
  });

  it('responds with an error when supplied with invalid data', async () => {
    const id = 'bf76a071-c988-4245-ab83-1b1af6b6f973';
    const todo = {
      user_email: 'test@test.com',
      title: 'Updated Test Todo',
      progress: 50,
      date: '2023-05-08T14:27:12.367Z',
    };
    const response = await request(app)
      .put(`/todos/${id}`)
      .send(todo);
    expect(response.statusCode).toBe(500);
  });
});

describe('DELETE /todos/:id', () => {
  it('responds with JSON containing the deleted todo ID', async () => {
    const id = 'bf76a071-c988-4245-ab83-1b1af6b6f973';
    const response = await request(app).delete(`/todos/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ id });
  });
});

describe('POST /signup', () => {
    it('responds with JSON containing the user email and token when supplied with valid data', async () => {
      const user = {
        email: 'test@test.com',
        password: 'password123',
      };
      const response = await request(app)
        .post('/signup')
        .send(user);
      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe(user.email);
      expect(response.body.token).toBeDefined();
    });
  
    it('responds with an error when supplied with invalid data', async () => {
      const user = {
        email: 'test@test.com',
      };
      const response = await request(app)
        .post('/signup')
        .send(user);
      expect(response.statusCode).toBe(500);
    });
  });
  
  describe('POST /login', () => {
    it('responds with JSON containing the user email and token when supplied with valid data', async () => {
      const user = {
        email: 'test@test.com',
        password: 'password123',
      };
      await request(app)
        .post('/signup')
        .send(user);
      const response = await request(app)
        .post('/login')
        .send(user);
      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe(user.email);
      expect(response.body.token).toBeDefined();
    });
  
    it('responds with an error when supplied with invalid data', async () => {
      const user = {
        email: 'test@test.com',
        password: 'password123',
      };
      const response = await request(app)
        .post('/login')
        .send(user);
      expect(response.statusCode).toBe(500);
    });
  });