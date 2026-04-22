import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain password with a hashed password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a secure random password (for auto-generated passwords)
 */
export const generateRandomPassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each required character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Fill remaining with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if password has been compromised (placeholder)
 */
export const checkPasswordCompromised = async (_password: string): Promise<boolean> => {
  return false;
};

/**
 * Calculate password entropy
 */
export const calculatePasswordEntropy = (password: string): number => {
  let poolSize = 0;
  
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
  
  return Math.log2(Math.pow(poolSize, password.length));
};

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const ATTEMPT_WINDOW = 60 * 60 * 1000;

export const checkLoginRateLimit = (identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes?: number;
} => {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);
  
  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }
  
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const remainingMinutes = Math.ceil((entry.lockedUntil - now) / 60000);
    return { allowed: false, remainingAttempts: 0, lockoutMinutes: remainingMinutes };
  }
  
  if (now - entry.firstAttempt > ATTEMPT_WINDOW) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }
  
  const remainingAttempts = MAX_ATTEMPTS - entry.attempts;
  
  if (remainingAttempts <= 0) {
    entry.lockedUntil = now + LOCKOUT_DURATION;
    const remainingMinutes = Math.ceil(LOCKOUT_DURATION / 60000);
    return { allowed: false, remainingAttempts: 0, lockoutMinutes: remainingMinutes };
  }
  
  return { allowed: true, remainingAttempts: remainingAttempts - 1 };
};

export const recordLoginAttempt = (identifier: string): void => {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);
  
  if (!entry) {
    loginAttempts.set(identifier, { attempts: 1, firstAttempt: now });
  } else {
    entry.attempts += 1;
  }
};

export const resetLoginAttempts = (identifier: string): void => {
  loginAttempts.delete(identifier);
};
