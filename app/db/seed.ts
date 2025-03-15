import { db } from ".";
import { artists, authors, episodes, songs, tags, songsToTags } from "./schema";
import episodeData from "./seed/episode_2024-07-25.json";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert episode
    const [episode] = await db
      .insert(episodes)
      .values({
        youtubeUrl: episodeData.youtube_url,
        date: new Date(episodeData.date).toISOString().split("T")[0],
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
        const [artist] = await db
          .insert(artists)
          .values({ name: songData.artist })
          .returning();
        artistId = artist.id;
        artistMap.set(songData.artist, artistId);
        console.log("🎤 Created artist:", songData.artist);
      }

      // Get or create author (if not null)
      let authorId: number | null = null;
      if (songData.author) {
        const existingAuthorId = authorMap.get(songData.author);
        if (existingAuthorId) {
          authorId = existingAuthorId;
        } else {
          const [author] = await db
            .insert(authors)
            .values({ name: songData.author })
            .returning();
          authorId = author.id;
          authorMap.set(songData.author, authorId);
          console.log("✍️ Created author:", songData.author);
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