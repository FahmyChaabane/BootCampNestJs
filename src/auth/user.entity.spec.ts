import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockUser: User = new User();

describe('User Entity', () => {
  describe('Validate password', () => {
    it('returns true as password is valid', async () => {
      Object.defineProperty(bcrypt, 'compare', {
        value: jest.fn().mockResolvedValue(true),
      });
      const result = await mockUser.validatePassword('password123');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toEqual(true);
    });
    it('returns false as password is invalid', async () => {
      Object.defineProperty(bcrypt, 'compare', {
        value: jest.fn().mockResolvedValue(false),
      });
      const result = await mockUser.validatePassword('password123');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toEqual(false);
    });
  });
});
