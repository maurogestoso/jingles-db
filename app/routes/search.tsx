import { db } from "~/db";
import type { Route } from "./+types/search";
import { Link, redirect } from "react-router";
import { sql, eq, like } from "drizzle-orm";
import { artists, authors, episodes, songs } from "~/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play as IconPlay } from "lucide-react";

const columnByCriteria = new Map<
  string,
  typeof artists.name | typeof authors.name | typeof songs.name
>([
  ["artistas", artists.name],
  ["jingleros", authors.name],
  ["canciones", songs.name],
]);

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("busqueda");
  if (!searchTerm) {
    return redirect("/");
  }
  const criteria = url.searchParams.get("criterio");
  if (!criteria) {
    return redirect("/");
  }

  const criteriaColumn = columnByCriteria.get(criteria);
  if (!criteriaColumn) {
    return redirect("/");
  }

  const likeSearch = `%${searchTerm}%`;

  const jingles = await db
    .select({
      name: songs.name,
      artistName: artists.name,
      authorName: authors.name,
      youtubeUrl: sql<string>`CONCAT(${episodes.youtubeUrl}, '&t=', ${songs.timestamp}, 's')`,
    })
    .from(songs)
    .innerJoin(artists, eq(songs.artistId, artists.id))
    .leftJoin(authors, eq(songs.authorId, authors.id))
    .innerJoin(episodes, eq(songs.episodeId, episodes.id))
    .where(like(criteriaColumn, likeSearch));

  return { jingles, searchTerm, criteria };
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { jingles, searchTerm, criteria } = loaderData;
  return (
    <>
      <div className="mb-4">
        ⬅️{" "}
        <Link
          to="/"
          className="text-blue-500 hover:underline hover:text-blue-600"
        >
          Volver a buscar
        </Link>
      </div>
      <h2 className="text-xl font-bold mb-4">
        Búsqueda por {criteria}: {`"${searchTerm}"`}
      </h2>
      <div className="flex flex-col gap-2">
        {jingles.length === 0 && (
          <p className="text-gray-500">No se encontraron resultados :(</p>
        )}
        {jingles.map((jingle, i) => (
          <article key={i}>
            <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardHeader className="flex-1">
                <CardTitle className="flex flex-wrap">
                  <span>"{jingle.name}"</span>
                  <span> de {jingle.artistName}</span>
                </CardTitle>
                <CardDescription>
                  por {jingle.authorName || "Anónimo"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={jingle.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-red-600 hover:bg-red-700 cursor-pointer">
                    <IconPlay /> Ver en YouTube
                  </Button>
                </a>
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </>
  );
}
