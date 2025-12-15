import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockImplementation(({ data }) => ({
        id: 'mock-id',
        ...data,
      })),
      findUnique: jest.fn(),
    },
  };

  const jwtMock = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register first user as ADMIN', async () => {
    const user = await service.register({
      name: 'Ankit',
      email: 'ankit@test.com',
      password: '123456',
    });

    expect(user.role).toBe('ADMIN');
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  it('should hash password before saving user', async () => {
    await service.register({
      name: 'Ankit',
      email: 'ankit@test.com',
      password: 'plain123',
    });

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          password: expect.not.stringMatching('plain123'),
        }),
      }),
    );
  });

  it('should login user and return jwt token', async () => {
    const bcrypt = require('bcrypt');

    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'ankit@test.com',
      password: await bcrypt.hash('123456', 10),
      role: 'USER',
    });

    const result = await service.login({
      email: 'ankit@test.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('mock-jwt-token');
  });
});
