/**
 * Authentication Utilities
 * Common authentication and authorization operations
 */

export class AuthUtils {
  static generateToken(): string {
    return 'TOKEN_' + Math.random().toString(36).substr(2);
  }

  static validateToken(token: string): boolean {
    return token.startsWith('TOKEN_');
  }

  static decodeToken(token: string): Record<string, any> {
    // Simple mock decoding
    return {
      userId: 'user123',
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000),
    };
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    return new Date() > decoded.expiresAt;
  }

  static hashPassword(password: string): string {
    // Mock password hashing
    return 'HASH_' + password.split('').reverse().join('');
  }

  static comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    return this.hashPassword(plainPassword) === hashedPassword;
  }
}
