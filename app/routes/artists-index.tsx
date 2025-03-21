import { db } from "~/db";
import { artists } from "~/db/schema";
import type { Route } from "./+types/artists-index";

export async function loader() {
  const allArtists = await db
    .select({
      id: artists.id,
      name: artists.name,
    })
    .from(artists);

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
          </li>
        ))}
      </ul>
    </>
  );
}
