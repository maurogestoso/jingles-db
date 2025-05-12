import { db } from ".";
import { artists, authors, episodes, songs } from "./schema";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";
import path from "path";

// Get the JSON file path from command line arguments
const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("❌ Please provide the path to the episode JSON file");
  console.error("Usage: npm run seed path/to/episode.json");
  process.exit(1);
}

// Load and validate the episode data
let episodeData: {
  youtube_url: string;
  date: string;
  songs: Array<{
    timestamp: number;
    song: string;
    artist: string;
    author: string | null;
  }>;
};

try {
  const fullPath = path.resolve(process.cwd(), jsonPath);
  const fileContent = readFileSync(fullPath, "utf-8");
  episodeData = JSON.parse(fileContent);

  // Basic validation
  if (
    !episodeData.youtube_url ||
    !episodeData.date ||
    !Array.isArray(episodeData.songs)
  ) {
    throw new Error("Invalid episode data format");
  }
} catch (error) {
  console.error(
    "❌ Failed to load episode data:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
}

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    console.log(`📄 Using episode data from: ${jsonPath}`);

    const episodeDate = new Date(episodeData.date);
    episodeDate.setUTCDate(parseInt(episodeData.date.split(" ")[0]));

    // Insert episode
    const [episode] = await db
      .insert(episodes)
      .values({
        youtubeUrl: episodeData.youtube_url,
        date: episodeDate.toISOString().split("T")[0],
      })
      .returning();

    console.log("📺 Created episode:", episode.id);

    // Create a map to store artist and author IDs to avoid duplicates
    const artistMap = new Map<string, number>();
    const authorMap = new Map<string, number>();

    // Process each song
    for (const songData of episodeData.songs) {
      // Get or create artist
      let artistId: number;
      const existingArtistId = artistMap.get(songData.artist);
      if (existingArtistId) {
        artistId = existingArtistId;
      } else {
        // Check if artist exists in database
        const existingArtist = await db.query.artists.findFirst({
          where: eq(artists.name, songData.artist),
        });

        if (existingArtist) {
          artistId = existingArtist.id;
          artistMap.set(songData.artist, artistId);
          console.log("🎤 Found existing artist:", songData.artist);
        } else {
          const [artist] = await db
            .insert(artists)
            .values({ name: songData.artist })
            .returning();
          artistId = artist.id;
          artistMap.set(songData.artist, artistId);
          console.log("🎤 Created new artist:", songData.artist);
        }
      }

      // Get or create author (if not null)
      let authorId: number | null = null;
      if (songData.author) {
        const existingAuthorId = authorMap.get(songData.author);
        if (existingAuthorId) {
          authorId = existingAuthorId;
        } else {
          // Check if author exists in database
          const existingAuthor = await db.query.authors.findFirst({
            where: eq(authors.name, songData.author),
          });

          if (existingAuthor) {
            authorId = existingAuthor.id;
            authorMap.set(songData.author, authorId);
            console.log("✍️ Found existing author:", songData.author);
          } else {
            const [author] = await db
              .insert(authors)
              .values({ name: songData.author })
              .returning();
            authorId = author.id;
            authorMap.set(songData.author, authorId);
            console.log("✍️ Created new author:", songData.author);
          }
        }
      }

      // Create song
      const [song] = await db
        .insert(songs)
        .values({
          name: songData.song,
          artistId,
          authorId,
          episodeId: episode.id,
          timestamp: songData.timestamp,
        })
        .returning();

      console.log("🎵 Created song:", songData.song);
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
