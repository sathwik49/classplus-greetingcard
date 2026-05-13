import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashValue = async (value: string, saltNumber: number = 10) => {
  const hashedValue = await bcrypt.hash(value, saltNumber);
  return hashedValue;
};

export const compareValues = async (value: string, hashedValue: string) => {
  const isMatching = await bcrypt.compare(value, hashedValue);
  return isMatching;
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
