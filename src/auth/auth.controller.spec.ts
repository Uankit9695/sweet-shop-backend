import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn().mockResolvedValue({
      id: 'mock-id',
      name: 'Ankit',
      email: 'ankit@test.com',
      role: 'ADMIN',
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'mock-jwt-token',
    }),
  };

  beforeEach(() => {
    controller = new AuthController(authServiceMock as any);
  });

  it('should register a new user', async () => {
    const result = await controller.register({
      name: 'Ankit',
      email: 'ankit@test.com',
      password: '123456',
    });

    expect(result.role).toBe('ADMIN');
    expect(authServiceMock.register).toHaveBeenCalled();
  });

  it('should login user and return token', async () => {
    const result = await controller.login({
      email: 'ankit@test.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('mock-jwt-token');
    expect(authServiceMock.login).toHaveBeenCalled();
  });
});
