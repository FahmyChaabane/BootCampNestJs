import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository; // we don't want to use the application repo cuz this is unit testing (we don't want to touch the bd), we gonna have to mock it.

  beforeEach(async () => {
    // reinitialize service and reinitialize the repo for us to run test cases independently
    const module = await Test.createTestingModule({
      // to create a new module for testing, similar to creating any module in nestjs
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    const mockData = { id: 2, username: 'hmed' };
    it('return user as validation is success', async () => {
      userRepository.findOne.mockResolvedValue(mockData); // mockReturnValue works too
      const result = await jwtStrategy.validate({
        username: mockData.username,
      });
      expect(userRepository.findOne).toBeCalledWith({
        username: mockData.username,
      });
      expect(result).toEqual(mockData);
    });
    it('throws an UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        jwtStrategy.validate({
          username: mockData.username,
        }), // without await works too
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toBeCalledWith({
        username: mockData.username,
      });
    });
  });
});
