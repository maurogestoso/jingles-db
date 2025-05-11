import { db } from "~/db";
import { asc, eq, sql } from "drizzle-orm";
import {
  artists,
  authors,
  episodes,
  songs,
  songsToTags,
  tags,
} from "~/db/schema";
import type { Route } from "./+types/authors-detail";
import SongCard from "~/components/song-card";

export async function loader({ params }: Route.LoaderArgs) {
  const authorId = Number(params.id);
  const [author] = await db
    .select({
      id: authors.id,
      name: authors.name,
    })
    .from(authors)
    .where(eq(authors.id, authorId));
  if (!author) {
    return new Response("Not Found", { status: 404 });
  }

  const authorSongs = await db
    .select({
      id: songs.id,
      name: songs.name,
      artist: artists.name,
      author: authors.name,
      youtubeUrl: sql<string>`CONCAT(${episodes.youtubeUrl}, '&t=', ${songs.timestamp}, 's')`,
      tags: sql<string>`JSON_GROUP_ARRAY(${tags.name})`
        .mapWith({
          mapFromDriverValue: (value: string) => {
            console.log("🚀 ~ loader ~ value:", value);
            return (JSON.parse(value) as string[]).filter(Boolean);
          },
        })
        .as("tags"),
    })
    .from(songs)
    .where(eq(songs.authorId, authorId))
    .innerJoin(artists, eq(artists.id, songs.artistId))
    .leftJoin(authors, eq(authors.id, songs.authorId))
    .innerJoin(episodes, eq(episodes.id, songs.episodeId))
    .leftJoin(songsToTags, eq(songsToTags.songId, songs.id))
    .leftJoin(tags, eq(songsToTags.tagId, tags.id))
    .groupBy(songs.id, songs.name)
    .orderBy(asc(songs.timestamp));

  return { author, songs: authorSongs };
}

export default function AuthorDetailRoute({
  loaderData,
}: Route.ComponentProps) {
  const { author, songs } = loaderData;
  return (
    <>
      <div className="mb-4">
        ⬅️{" "}
        <a href="/jingleros" className="text-blue-700 hover:underline">
          Volver a Jingleros
        </a>
      </div>
      <h2 className="font-bold text-2xl mb-4">Jingles de {author.name}</h2>
      <section className="flex flex-col gap-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </section>
    </>
  );
}
