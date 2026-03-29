import { DrizzleD1Database } from "drizzle-orm/d1";
import { InsertInquiry, inquiries } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createInquiry(
  db: DrizzleD1Database,
  data: InsertInquiry,
): Promise<boolean> {
  try {
    await db.insert(inquiries).values(data);
    return true;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return false;
  }
}

export async function getAllInquiries(db: DrizzleD1Database) {
  return db.select().from(inquiries).orderBy(inquiries.createdAt);
}

export async function deleteInquiry(
  db: DrizzleD1Database,
  inquiryId: string,
): Promise<boolean> {
  try {
    const result = await db
      .delete(inquiries)
      .where(eq(inquiries.id, inquiryId));
    return !!result;
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return false;
  }
}
