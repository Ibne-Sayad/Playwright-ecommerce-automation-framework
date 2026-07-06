import { randomUUID } from 'crypto';

export function generateUserData() {
  const uniqueId = randomUUID().slice(0, 8);
  return {
    name: `QA User ${uniqueId}`,
    email: `qa${uniqueId}@mail.com`,
    password: 'Password123!'
  };
}
