import { db } from "~/db";
import type { Route } from "./+types/home";
import { artists, authors, episodes, songs } from "~/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import JinglesTable, { columns } from "~/components/jingles-table";
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

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
    .innerJoin(artists, eq(songs.artistId, artists.id))
    .innerJoin(episodes, eq(songs.episodeId, episodes.id))
    .leftJoin(authors, eq(songs.authorId, authors.id))
    .orderBy(desc(songs.createdAt))
    .limit(10);

  return { jingles };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { jingles } = loaderData;
  return (
    <>
      <Form method="get" action="/search" className="mb-4">
        <div className="flex justify-center items-center space-x-2">
          <Input
            type="search"
            name="search"
            className="border-blue-300 max-w-lg"
            placeholder={`por ejemplo: "Let It Go", "Los Piojos" o "Marquitos"`}
          />
          <Button type="submit">Buscar</Button>
        </div>
      </Form>
    </>
  );
}
