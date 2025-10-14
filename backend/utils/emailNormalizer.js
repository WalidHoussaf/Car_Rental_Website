export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return email;
  }

  // Trim and convert to lowercase
  email = email.trim().toLowerCase();

  // Split email into local part and domain
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    return email; // Invalid email format, return as-is
  }

  // Gmail domains that ignore dots
  const gmailDomains = ['gmail.com', 'googlemail.com'];

  if (gmailDomains.includes(domain)) {
    // Remove all dots from Gmail local part
    const normalizedLocal = localPart.replace(/\./g, '');
    return `${normalizedLocal}@${domain}`;
  }

  // For non-Gmail addresses, just return lowercase trimmed version
  return email;
};

export default normalizeEmail;
