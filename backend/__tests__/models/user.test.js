import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a valid user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        phone: '+1234567890',
        dateOfBirth: new Date('1990-01-01')
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.phone).toBe(userData.phone);
      expect(savedUser.role).toBe('customer'); 
      expect(savedUser.isVerified).toBe(false); 
    });

    it('should hash password before saving', async () => {
      const password = 'PlainTextPassword123!';
      const user = new User({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: password,
        phone: '+1234567890',
        dateOfBirth: new Date('1990-01-01')
      });

      await user.save();

      expect(user.password).not.toBe(password);
      expect(user.password.length).toBeGreaterThan(password.length);
      
      // Verify password is properly hashed
      const isMatch = await bcrypt.compare(password, user.password);
      expect(isMatch).toBe(true);
    });

    it('should not hash password if already hashed', async () => {
      const user = new User({
        firstName: 'Bob',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-01-01'),
        email: 'bob.smith@example.com',
        password: 'Password123!',
        phone: '+1234567890'
      });

      await user.save();
      const firstHash = user.password;

      // Update user without changing password
      user.firstName = 'Robert';
      await user.save();

      expect(user.password).toBe(firstHash);
    });

    it('should fail without required fields', async () => {
      const user = new User({
        firstName: 'Test'
        // Missing required fields
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with invalid email format', async () => {
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'Password123!',
        phone: '+1234567890'
      });

      await expect(user.save()).rejects.toThrow();
    });

    it.skip('should fail with duplicate email', async () => {
      // Ensure indexes are created
      await User.createIndexes();
      
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'duplicate@example.com',
        password: 'Password123!',
        phone: '+1234567890',
        dateOfBirth: new Date('1990-01-01')
      };

      await new User(userData).save();
      
      // Try to create another user with same email
      const duplicateUser = new User(userData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    it('should compare password correctly', async () => {
      const password = 'TestPassword123!';
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'password-test@example.com',
        password: password,
        phone: '+1234567890',
        dateOfBirth: new Date('1990-01-01')
      });

      await user.save();

      // Correct password
      const isMatch = await bcrypt.compare(password, user.password);
      expect(isMatch).toBe(true);

      // Incorrect password
      const isWrongMatch = await bcrypt.compare('WrongPassword', user.password);
      expect(isWrongMatch).toBe(false);
    });
  });

  describe('User Roles', () => {
    it('should create user with default role', async () => {
      const user = await global.testUtils.createTestUser(User);
      expect(user.role).toBe('customer');
    });

    it('should create admin user', async () => {
      const admin = await global.testUtils.createTestAdmin(User);
      expect(admin.role).toBe('admin');
    });
  });

  describe('Email Verification', () => {
    it('should have email verification fields', async () => {
      const user = await global.testUtils.createTestUser(User);
      
      expect(user.isVerified).toBeDefined();
      expect(user.emailVerificationToken).toBeNull();
      expect(user.emailVerificationExpires).toBeNull();
    });
  });

  describe('Account Lockout', () => {
    it('should track login attempts', async () => {
      const user = await global.testUtils.createTestUser(User);
      
      expect(user.loginAttempts).toBe(0);
      expect(user.lockUntil).toBeUndefined();
    });

    it('should increment login attempts', async () => {
      const user = await global.testUtils.createTestUser(User);
      
      user.loginAttempts += 1;
      await user.save();
      
      expect(user.loginAttempts).toBe(1);
    });
  });
});
