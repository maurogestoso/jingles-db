import type { Config } from "@react-router/dev/config";
import { artists, authors, episodes } from "./app/db/schema";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle("file:local.db");

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    const episodeIds = await db.select({ id: episodes.id }).from(episodes);
    const episodeRoutes = episodeIds.map(
      (episode) => `/programas/${episode.id}`
    );
    const authorIds = await db.select({ id: authors.id }).from(authors);
    const authorRoutes = authorIds.map((author) => `/jingleros/${author.id}`);

    const artistIds = await db.select({ id: artists.id }).from(artists);
    const artistRoutes = artistIds.map((artist) => `/artistas/${artist.id}`);

    return ["/programas", ...episodeRoutes, ...authorRoutes, ...artistRoutes];
  },
} satisfies Config;
