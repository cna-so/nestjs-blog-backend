import * as bcrypt from 'bcrypt';

export async function GenerateHashPassword(password: string) {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}

export async function ComparePasswordWithHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
