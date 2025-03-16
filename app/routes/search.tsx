import { db } from "~/db";
import type { Route } from "./+types/search";
import { redirect } from "react-router";
import { sql } from "drizzle-orm";
import JinglesTable, { $Jingle, columns } from "~/components/jingles-table";
import { type } from "arktype";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  if (!search) {
    return redirect("/");
  }
  const likeSearch = `%${search}%`;

  const result = await db.run(sql`
    SELECT * FROM (
        SELECT s.id as id, s.name as name, ar.name as artist, au.name as author, CONCAT(ep.youtube_url, '&t=', s.timestamp, 's') as youtubeUrl
        FROM songs as s
        JOIN artists as ar ON s.artist_id = ar.id
        LEFT JOIN authors as au ON s.author_id = au.id
        JOIN episodes as ep ON s.episode_id = ep.id
    )
    WHERE 
        artist LIKE ${likeSearch} OR 
        author LIKE ${likeSearch} OR 
        name LIKE ${likeSearch}
    `);

  const jingles = $Jingle.array()(result.rows);
  if (jingles instanceof type.errors) {
    console.log("🚀 ~ loader ~ jingles:", jingles.issues);
    return new Response("Invalid data returned from database", { status: 500 });
  }

  return { jingles, searchTerm: search };
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { jingles, searchTerm } = loaderData;
  return (
    <>
      <h2 className="text-xl font-bold mb-4">
        Resultados de busqueda: {searchTerm}
      </h2>
      <JinglesTable columns={columns} data={jingles} />
    </>
  );
}
