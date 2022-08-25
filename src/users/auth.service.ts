import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email exist');
    }
    // hash the users password
    // generate Salt
    const salt = randomBytes(8).toString('hex');
    // hash salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed result and salt together
    const result = `${salt}.${hash.toString('hex')}`;
    // create nnew user and save

    // return user
    const user = await this.userService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new ForbiddenException('invalid details');
    }
    return user;
  }
}
