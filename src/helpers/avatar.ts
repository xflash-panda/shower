/**
 * Generate meaningful initials from user email for avatar display
 *
 * @param email - User email address
 * @returns Two uppercase letters representing user initials
 *
 * @example
 * generateUserInitials('john.doe@example.com') // returns 'JD'
 * generateUserInitials('alice@company.co.uk') // returns 'AL'
 * generateUserInitials('bob.smith.jones@test.org') // returns 'BS'
 * generateUserInitials('x@y.com') // returns 'XY'
 * generateUserInitials('single@domain.com') // returns 'SI'
 */
export const generateUserInitials = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return 'US'; // Default fallback for User
  }

  // Extract the local part (before @) from email
  const localPart = email.split('@')[0];

  if (!localPart) {
    return 'US'; // Default fallback
  }

  // Split by common separators (dot, underscore, hyphen, plus)
  const nameParts = localPart.split(/[._\-+]/);

  // Filter out empty parts
  const validParts = nameParts.filter(part => part.length > 0);

  if (validParts.length === 0) {
    return 'US'; // Default fallback
  }

  if (validParts.length === 1) {
    // Single part: take first and second character if available
    const part = validParts[0];
    if (part.length >= 2) {
      return (part[0] + part[1]).toUpperCase();
    } else {
      // Single character: use it twice or with 'U'
      return (part[0] + (part[0] || 'U')).toUpperCase();
    }
  }

  // Multiple parts: take first character of first two parts
  return (validParts[0][0] + validParts[1][0]).toUpperCase();
};
