import { db } from "~/db";
import { episodes } from "~/db/schema";
import type { Route } from "./+types/episodes-index";
import { desc } from "drizzle-orm";

export async function loader() {
  const allEpisodes = await db
    .select({
      id: episodes.id,
      date: episodes.date,
      youtubeUrl: episodes.youtubeUrl,
    })
    .from(episodes)
    .orderBy(desc(episodes.date));
  return { episodes: allEpisodes };
}

export default function EpisodesRoute({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Programas</h2>
      <ul className="list-disc list-inside">
        {loaderData.episodes.map((episode) => (
          <li key={episode.id}>
            <a
              href={`/programas/${episode.id}`}
              className="underline text-blue-700"
            >
              {episode.date}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
