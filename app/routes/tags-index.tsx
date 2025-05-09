import { asc } from "drizzle-orm";
import { db } from "~/db";
import { tags } from "~/db/schema";
import type { Route } from "./+types/tags-index";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { useState } from "react";

export async function loader() {
  const allTags = await db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(tags)
    .orderBy(asc(tags.name));
  return { tags: allTags };
}

export default function TagsIndex({ loaderData }: Route.ComponentProps) {
  const [filter, setFilter] = useState("");
  const tags = filter
    ? loaderData.tags.filter((tag) => tag.name.toLowerCase().includes(filter))
    : loaderData.tags;
  return (
    <>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Tags</h2>
      <Input
        className="mb-4 focus:ring focus:ring-offset-2 focus:ring-offset-blue-500"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
        placeholder="Buscar artista"
        autoFocus
      />
      <ul className="list-disc list-inside">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link to={`/tags/${tag.id}`} className="text-blue-600 underline">
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
