/**
 * Account Utilities
 * Common account-related operations
 */

export class AccountUtils {
  static createAccountNumber(): string {
    return 'ACC' + Date.now().toString();
  }

  static validateAccountNumber(accountNumber: string): boolean {
    return /^ACC\d+$/.test(accountNumber);
  }

  static generateAccountId(): string {
    return 'ID' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  static formatAccountBalance(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  static calculateAccountAge(createdDate: Date): number {
    const now = new Date();
    const ageInMs = now.getTime() - createdDate.getTime();
    return Math.floor(ageInMs / (1000 * 60 * 60 * 24)); // days
  }
}
