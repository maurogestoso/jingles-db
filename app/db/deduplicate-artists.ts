import { db } from ".";
import { artists, songs } from "./schema";
import { eq } from "drizzle-orm";

// Get the artist IDs from command line arguments
const originalId = parseInt(process.argv[2]);
const duplicateId = parseInt(process.argv[3]);

if (!originalId || !duplicateId || isNaN(originalId) || isNaN(duplicateId)) {
  console.error("❌ Please provide both original and duplicate artist IDs");
  console.error(
    "Usage: npm run deduplicate-artists <originalId> <duplicateId>"
  );
  process.exit(1);
}

async function deduplicateArtists() {
  try {
    console.log("🔄 Starting artist deduplication...");

    // Verify both artists exist
    const [originalArtist, duplicateArtist] = await Promise.all([
      db.query.artists.findFirst({ where: eq(artists.id, originalId) }),
      db.query.artists.findFirst({ where: eq(artists.id, duplicateId) }),
    ]);

    if (!originalArtist) {
      throw new Error(`Original artist with ID ${originalId} not found`);
    }
    if (!duplicateArtist) {
      throw new Error(`Duplicate artist with ID ${duplicateId} not found`);
    }

    console.log(
      `🎤 Original artist: ${originalArtist.name} (ID: ${originalId})`
    );
    console.log(
      `🔄 Duplicate artist: ${duplicateArtist.name} (ID: ${duplicateId})`
    );

    // Begin transaction
    console.log("🔄 Updating song references...");

    // Update all songs that reference the duplicate artist
    const { rowsAffected } = await db
      .update(songs)
      .set({ artistId: originalId })
      .where(eq(songs.artistId, duplicateId));

    console.log(`✅ Updated ${rowsAffected} song references`);

    // Delete the duplicate artist
    await db.delete(artists).where(eq(artists.id, duplicateId));
    console.log(`🗑️ Deleted duplicate artist: ${duplicateArtist.name}`);

    console.log("✅ Deduplication completed successfully!");
  } catch (error) {
    console.error("❌ Deduplication failed:", error);
    throw error;
  }
}

deduplicateArtists().catch((error) => {
  console.error("Failed to deduplicate artists:", error);
  process.exit(1);
});
