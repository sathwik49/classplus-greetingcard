import { eq, or } from "drizzle-orm";
import db from "../db/db";
import { refreshTokens, users } from "../db/schema";
import {
  UserLoginSchematype,
  UserRegistrationSchematype,
} from "../validations/auth.validation";
import { AuthError, ConflictError } from "../utils/error";
import { compareValues, hashToken, hashValue } from "../utils/hashValue";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { UploadApiResponse } from "cloudinary";
import { generateTokens } from "../utils/jwt";

export const userRegistrationService = async (
  data: UserRegistrationSchematype,
  profileBuffer: Buffer,
) => {
  const [isExistingEmail] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (isExistingEmail) {
    throw new ConflictError("Email already in use", null);
  }

  const hashedPassword = await hashValue(data.password);

  const result: UploadApiResponse = await uploadToCloudinary(
    profileBuffer,
    "avatars",
  );

  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      provider: "email",
      photoUrl: result.secure_url,
    })
    .returning();

  const { accessToken, refreshToken } = generateTokens({
    userId: user.id,
    email: user.email,
  });

  const tokenHash = hashToken(refreshToken);

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};

export const userLoginService = async (data: UserLoginSchematype) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user) {
    throw new AuthError("Invalid Credentials");
  }

  const isPasswordMatching = await compareValues(
    data.password,
    user.passwordHash as string,
  );
  if (!isPasswordMatching) {
    throw new AuthError("Invalid Credentials");
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: user.id,
    email: user.email,
  });

  const tokenHash = hashToken(refreshToken);

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};

export const refreshTokenService = async (
  refreshToken: string,
  userId: string,
) => {
  const refreshTokenHash = hashToken(refreshToken);

  const [session] = await db
    .select({
      session: refreshTokens,
      user: users,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.tokenHash, refreshTokenHash))
    .limit(1);

  if (!session) {
    throw new AuthError();
  }

  if (session.session.expiresAt.getTime() < Date.now()) {
    throw new AuthError("Session expired");
  }

  await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.tokenHash, refreshTokenHash));

  const {
    accessToken: newAccessToken,

    refreshToken: newRefreshToken,
  } = generateTokens({
    userId: session.user.id,
    email: session.user.email,
  });

  await db.insert(refreshTokens).values({
    userId: session.user.id,

    tokenHash: hashToken(newRefreshToken),

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    user: session.user,
    newAccessToken,
    newRefreshToken,
  };
};

export const logOutService = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);

  await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.tokenHash, refreshTokenHash));
};
