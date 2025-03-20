import type { Config } from "@react-router/dev/config";
import { episodes } from "./app/db/schema";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle("file:local.db");

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    const allEpisodes = await db.select({ id: episodes.id }).from(episodes);
    const allEpisodesUrls = allEpisodes.map(
      (episode) => `/programas/${episode.id}`
    );
    return ["/programas", ...allEpisodesUrls];
  },
} satisfies Config;
