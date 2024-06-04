export const hideEmail = (email: string) => {
  const [localPart, domain] = email.split('@');

  if (!localPart || !domain) {
    throw new Error('Invalid email address');
  }

  const hideLength = Math.ceil(localPart.length / 1.2);
  const visibleLength = localPart.length - hideLength;

  const hiddenPart = '*'.repeat(hideLength);
  const visiblePart = localPart.slice(0, visibleLength);

  return `${visiblePart}${hiddenPart}@${domain}`;
};
