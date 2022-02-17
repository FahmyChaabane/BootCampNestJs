import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const authCredentialsDto = {
  username: 'authCredentialUsername',
  password: 'authCredentialPassword',
};
describe('User Repository', () => {
  let userRepository;
  beforeEach(async () => {
    // reinitialize service and reinitialize the repo for us to run test cases independently
    const module = await Test.createTestingModule({
      // to create a new module for testing, similar to creating any module in nestjs
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signup', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({
        save,
      });
    });
    it('successfully signs up the user', async () => {
      save.mockResolvedValue(undefined); // void
      await expect(
        userRepository.singUp(authCredentialsDto),
      ).resolves.not.toThrow();
      expect(userRepository.create).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
    });
    it('throws a conflict exception an username already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(userRepository.singUp(authCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.create).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
    });
    it('throws an internal server error', async () => {
      save.mockRejectedValue({ code: '123456' });
      await expect(userRepository.singUp(authCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userRepository.create).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
    });
  });

  describe('validateUserPassword', () => {
    let validatePassword;
    beforeEach(() => {
      validatePassword = jest.fn();
      userRepository.findOne = jest.fn().mockResolvedValue({
        validatePassword,
      });
    });
    it('return the username passed', async () => {
      validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(
        authCredentialsDto,
      );
      expect(result).toEqual(authCredentialsDto.username);
    });
    it('return null in case user not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);
      const result = await userRepository.validateUserPassword(
        authCredentialsDto,
      );
      expect(result).toEqual(null);
      expect(validatePassword).not.toHaveBeenCalled();
    });
    it('return null in case validation is not success', async () => {
      validatePassword.mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(
        authCredentialsDto,
      );
      expect(result).toEqual(null); // toBeNull()
    });
  });

  describe('hash password', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      Object.defineProperty(bcrypt, 'hash', {
        value: jest.fn().mockResolvedValue('testHash'),
      }); // https://github.com/facebook/jest/issues/2227#:~:text=Object.defineProperty(store%2C%20%27doOneThing%27%2C%20%7Bvalue%3A%20jest.fn()%7D)%3F
      //   bcrypt.hash = jest.fn().mockResolvedValue('testHash'); // didn't work cuz can't mock a read only property like this
      const result = await userRepository.hashPassword('password', 2);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual('testHash');
    });
  });
});
