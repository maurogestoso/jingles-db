import { db } from "~/db";
import type { Route } from "./+types/home";
import { artists, authors, episodes, songs } from "~/db/schema";
import { eq, sql } from "drizzle-orm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fabrica de Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

export async function loader() {
  const jingles = await db
    .select({
      id: songs.id,
      name: songs.name,
      artist: artists.name,
      author: authors.name,
      youtubeUrl: sql<string>`CONCAT(${episodes.youtubeUrl}, '&t=', ${songs.timestamp}, 's')`,
    })
    .from(songs)
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .leftJoin(episodes, eq(songs.episodeId, episodes.id))
    .leftJoin(authors, eq(songs.authorId, authors.id))
    .limit(10);

  return { jingles };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { jingles } = loaderData;
  return (
    <>
      <h1 className="text-4xl font-bold">Fabrica de Jingles DB</h1>

      <h2 className="text-3xl font-bold">Jingles mas recientes</h2>
      <ul className="list-disc list-inside">
        {jingles.map((jingle) => (
          <li key={jingle.id}>
            <a
              className="text-blue-500 hover:text-blue-600"
              href={jingle.youtubeUrl}
            >{`${jingle.name} - ${jingle.artist}`}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
