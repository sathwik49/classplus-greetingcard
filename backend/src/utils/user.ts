import { eq } from "drizzle-orm";
import db from "../db/db";
import { users } from "../db/schema";

export const getUserById = async (userId: string) => {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      photoUrl: users.photoUrl,
      plan: users.plan,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user;
};
