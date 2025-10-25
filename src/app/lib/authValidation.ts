// Comprehensive authentication validation and edge case handling
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class AuthValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly DISPOSABLE_EMAIL_DOMAINS = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ];

  static validateEmail(email: string): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

    if (!email || !email.trim()) {
      result.errors.push('Email is required');
      result.isValid = false;
      return result;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Basic format validation
    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      result.errors.push('Invalid email format');
      result.isValid = false;
    }

    // Length validation
    if (trimmedEmail.length > 254) {
      result.errors.push('Email is too long (max 254 characters)');
      result.isValid = false;
    }

    // Check for disposable email domains
    const domain = trimmedEmail.split('@')[1];
    if (this.DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      result.warnings.push('Disposable email addresses may cause delivery issues');
    }

    // Check for common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const suggestions = this.suggestEmailCorrection(trimmedEmail, commonDomains);
    if (suggestions.length > 0) {
      result.warnings.push(`Did you mean: ${suggestions.join(', ')}?`);
    }

    return result;
  }

  static validatePassword(password: string): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

    if (!password) {
      result.errors.push('Password is required');
      result.isValid = false;
      return result;
    }

    // Length validation
    if (password.length < 6) {
      result.errors.push('Password must be at least 6 characters long');
      result.isValid = false;
    }

    if (password.length > 128) {
      result.errors.push('Password is too long (max 128 characters)');
      result.isValid = false;
    }

    // Strength validation
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let strength = 0;
    if (hasLower) strength++;
    if (hasUpper) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;

    if (strength < 2) {
      result.errors.push('Password must contain at least one number or special character');
      result.isValid = false;
    }

    // Common password checks
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'letmein',
      'welcome', 'monkey', '1234567890', 'qwerty', 'abc123'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      result.errors.push('Password is too common. Please choose a stronger password');
      result.isValid = false;
    }

    // Sequential characters check
    if (this.hasSequentialChars(password)) {
      result.warnings.push('Avoid sequential characters for better security');
    }

    // Repeated characters check
    if (this.hasRepeatedChars(password)) {
      result.warnings.push('Avoid repeated characters for better security');
    }

    return result;
  }

  static validateRegistrationData(email: string, password: string, confirmPassword?: string): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

    // Validate email
    const emailResult = this.validateEmail(email);
    result.errors.push(...emailResult.errors);
    result.warnings.push(...emailResult.warnings);

    // Validate password
    const passwordResult = this.validatePassword(password);
    result.errors.push(...passwordResult.errors);
    result.warnings.push(...passwordResult.warnings);

    // Validate password confirmation if provided
    if (confirmPassword !== undefined && password !== confirmPassword) {
      result.errors.push('Passwords do not match');
    }

    // Check if email and password are too similar
    if (email && password && this.areStringSimilar(email.toLowerCase(), password.toLowerCase())) {
      result.warnings.push('Password should not be similar to your email');
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  private static suggestEmailCorrection(email: string, domains: string[]): string[] {
    const [localPart, domain] = email.split('@');
    if (!domain) return [];

    const suggestions: string[] = [];

    for (const correctDomain of domains) {
      const distance = this.levenshteinDistance(domain, correctDomain);
      if (distance === 1 || distance === 2) {
        suggestions.push(`${localPart}@${correctDomain}`);
      }
    }

    return suggestions;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private static hasSequentialChars(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      const char1 = password.charCodeAt(i);
      const char2 = password.charCodeAt(i + 1);
      const char3 = password.charCodeAt(i + 2);

      if (char2 === char1 + 1 && char3 === char2 + 1) {
        return true;
      }
    }
    return false;
  }

  private static hasRepeatedChars(password: string): boolean {
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
        return true;
      }
    }
    return false;
  }

  private static areStringSimilar(str1: string, str2: string): boolean {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - distance / maxLength;
    return similarity > 0.6; // 60% similarity threshold
  }
}

// Edge case scenarios for testing
export const authEdgeCases = {
  emails: {
    valid: [
      'user@example.com',
      'test.email@domain.co.uk',
      'user+tag@example.org',
      'user123@sub.domain.com'
    ],
    invalid: [
      '',
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user..double.dot@domain.com',
      'user@domain..com'
    ],
    edge: [
      'a@b.co', // very short
      'user@'.padEnd(250, 'x') + '.com', // very long
      'user@domain-with-many-hyphens.com',
      'user@[192.168.1.1]' // IP address domain
    ]
  },
  passwords: {
    valid: [
      'Password123!',
      'MyStr0ng@Pass',
      'C0mplex#P@ssw0rd',
      'Secure123$'
    ],
    invalid: [
      '',
      'short',
      'password',
      '123456',
      'onlylowercase',
      'ONLYUPPERCASE',
      '1234567890'
    ],
    edge: [
      'a'.repeat(129), // too long
      'aA1!', // minimum complexity
      'P@ssw0rd123', // common pattern
      'abcdefg123' // sequential
    ]
  }
};
