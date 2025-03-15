import { db } from "~/db";
import type { Route } from "./+types/home";
import { artists, authors, episodes, songs } from "~/db/schema";
import { eq, sql } from "drizzle-orm";
import JinglesTable, { columns } from "~/components/jingles-table";

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
      <div className="mx-auto max-w-7xl p-4">
        <h1 className="text-4xl font-bold mb-6">Fabrica de Jingles DB</h1>

        <h2 className="text-3xl font-bold mb-4">Jingles mas recientes</h2>
        <JinglesTable columns={columns} data={jingles} />
      </div>
    </>
  );
}
