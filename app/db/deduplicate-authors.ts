import { db } from ".";
import { authors, songs } from "./schema";
import { eq } from "drizzle-orm";

// Get the author IDs from command line arguments
const originalId = parseInt(process.argv[2]);
const duplicateId = parseInt(process.argv[3]);

if (!originalId || !duplicateId || isNaN(originalId) || isNaN(duplicateId)) {
  console.error("❌ Please provide both original and duplicate author IDs");
  console.error(
    "Usage: npm run deduplicate-authors <originalId> <duplicateId>"
  );
  process.exit(1);
}

async function deduplicateAuthors() {
  try {
    console.log("🔄 Starting author deduplication...");

    // Verify both authors exist
    const [originalAuthor, duplicateAuthor] = await Promise.all([
      db.query.authors.findFirst({ where: eq(authors.id, originalId) }),
      db.query.authors.findFirst({ where: eq(authors.id, duplicateId) }),
    ]);

    if (!originalAuthor) {
      throw new Error(`Original author with ID ${originalId} not found`);
    }
    if (!duplicateAuthor) {
      throw new Error(`Duplicate author with ID ${duplicateId} not found`);
    }

    console.log(
      `📝 Original author: ${originalAuthor.name} (ID: ${originalId})`
    );
    console.log(
      `🔄 Duplicate author: ${duplicateAuthor.name} (ID: ${duplicateId})`
    );

    // Begin transaction
    console.log("🔄 Updating song references...");

    // Update all songs that reference the duplicate author
    const { rowsAffected } = await db
      .update(songs)
      .set({ authorId: originalId })
      .where(eq(songs.authorId, duplicateId));

    console.log(`✅ Updated ${rowsAffected} song references`);

    // Delete the duplicate author
    await db.delete(authors).where(eq(authors.id, duplicateId));
    console.log(`🗑️ Deleted duplicate author: ${duplicateAuthor.name}`);

    console.log("✅ Deduplication completed successfully!");
  } catch (error) {
    console.error("❌ Deduplication failed:", error);
    throw error;
  }
}

deduplicateAuthors().catch((error) => {
  console.error("Failed to deduplicate authors:", error);
  process.exit(1);
});
