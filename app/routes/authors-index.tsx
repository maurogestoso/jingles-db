import { db } from "~/db";
import { authors } from "~/db/schema";
import type { Route } from "./+types/authors-index";

export async function loader() {
  const allAuthors = await db
    .select({
      id: authors.id,
      name: authors.name,
    })
    .from(authors);

  return { authors: allAuthors };
}

export default function AuthorsIndexRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Jingleros</h2>
      <ul className="list-disc list-inside">
        {loaderData.authors.map((author) => (
          <li key={author.id}>
            <a
              href={`/jingleros/${author.id}`}
              className="underline text-blue-700"
            >
              {author.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
