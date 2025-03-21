import { db } from "~/db";
import { authors, songs } from "~/db/schema";
import type { Route } from "./+types/authors-index";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { sql, eq, desc } from "drizzle-orm";

export async function loader() {
  const allAuthors = await db
    .select({
      id: authors.id,
      name: authors.name,
      songCount: sql<number>`COUNT(${songs.id})`,
    })
    .from(authors)
    .innerJoin(songs, eq(authors.id, songs.authorId))
    .groupBy(authors.id, authors.name)
    .orderBy(desc(sql<number>`COUNT(${songs.id})`));

  return { authors: allAuthors };
}

export default function AuthorsIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  const [filter, setFilter] = useState("");
  const authors = filter
    ? loaderData.authors.filter((author) =>
        author.name.toLowerCase().includes(filter)
      )
    : loaderData.authors;
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Jingleros</h2>
      <Input
        className="mb-4 focus:ring focus:ring-offset-2 focus:ring-offset-blue-500"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
        placeholder="Buscar jinglero"
        autoFocus
      />
      <ul className="list-disc list-inside">
        {authors.map((author) => (
          <li key={author.id}>
            <a
              href={`/jingleros/${author.id}`}
              className="underline text-blue-700"
            >
              {author.name}
            </a>
            <span className="text-sm ml-1">({author.songCount})</span>
          </li>
        ))}
      </ul>
    </>
  );
}
