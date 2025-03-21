import { db } from "~/db";
import { artists, songs } from "~/db/schema";
import type { Route } from "./+types/artists-index";
import { sql, eq, desc } from "drizzle-orm";

export async function loader() {
  const allArtists = await db
    .select({
      id: artists.id,
      name: artists.name,
      songCount: sql<number>`COUNT(${songs.id})`,
    })
    .from(artists)
    .innerJoin(songs, eq(artists.id, songs.artistId))
    .groupBy(artists.id, artists.name)
    .orderBy(desc(sql<number>`COUNT(${songs.id})`));

  return { artists: allArtists };
}

export default function ArtistsIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Artistas</h2>
      <ul className="list-disc list-inside">
        {loaderData.artists.map((artist) => (
          <li key={artist.id}>
            <a
              href={`/artistas/${artist.id}`}
              className="underline text-blue-700"
            >
              {artist.name}
            </a>
            <span className="text-sm ml-1">({artist.songCount})</span>
          </li>
        ))}
      </ul>
    </>
  );
}
