import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // creating fake user Service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('cerates a new user with salted and hash password ', async () => {
    const user = await service.signup('sakib@test.email', 'password123');
    expect(user.id).toEqual(1);
    expect(user.email).toEqual('sakib@test.email');
    expect(user.password).not.toEqual('password123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw up error if email exist', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'sakib@test.email', password: 'password123' } as User,
      ]);

    await expect(
      service.signup('sakib@tsdest.email', 'password123'),
    ).rejects.toThrow(BadRequestException);
  });
});
