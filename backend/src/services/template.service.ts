import { eq, and } from "drizzle-orm";
import db from "../db/db";
import { templates } from "../db/schema";

export const getAllTemplatesService = async (templateCategory?: string) => {
  if (!templateCategory || templateCategory === "all") {
    return await db
      .select({
        id: templates.id,

        title: templates.title,

        category: templates.category,

        imageUrl: templates.imageUrl,

        thumbnailUrl: templates.thumbnailUrl,

        isPremium: templates.isPremium,

        profileSize: templates.profileSize,
      })
      .from(templates)
      .where(eq(templates.isActive, true));
  }

  return await db
    .select({
      id: templates.id,

      title: templates.title,

      category: templates.category,

      imageUrl: templates.imageUrl,

      thumbnailUrl: templates.thumbnailUrl,

      isPremium: templates.isPremium,

      profileSize: templates.profileSize,
    })
    .from(templates)
    .where(
      and(
        eq(templates.isActive, true),

        eq(templates.category, templateCategory as any),
      ),
    );
};

export const getTemplateByIdService = async (id: string) => {
  const [template] = await db
    .select({
      id: templates.id,

      title: templates.title,

      category: templates.category,

      imageUrl: templates.imageUrl,

      thumbnailUrl: templates.thumbnailUrl,

      isPremium: templates.isPremium,

      profileSize: templates.profileSize,
    })
    .from(templates)
    .where(eq(templates.id, id));

  return template;
};
