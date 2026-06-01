/**
 * Normalize any phone input to the canonical Kyrgyzstan format `+996` + up to 9
 * subscriber digits. Strips the country code (996) or trunk prefix (0) once, so
 * browser autofill values like `+996555123456`, `996555123456`, `0555123456` or
 * `+996 555 123 456` all resolve correctly without duplicating the code or
 * truncating the number.
 */
export const normalizeKgPhone = (input: string): string => {
  let digits = (input || '').replace(/\D/g, '');
  if (digits.startsWith('996')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return '+996' + digits.slice(0, 9);
};
