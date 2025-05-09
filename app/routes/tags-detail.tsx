import { db } from "~/db";
import { asc, eq, sql } from "drizzle-orm";
import {
  tags,
  artists,
  authors,
  episodes,
  songs,
  songsToTags,
} from "~/db/schema";
import SongCard from "~/components/song-card";
import type { Route } from "./+types/tags-detail";

export async function loader({ params }: Route.LoaderArgs) {
  const tagId = parseInt(params.id);

  const [tag] = await db
    .select({ name: tags.name })
    .from(tags)
    .where(eq(tags.id, tagId));

  const tagSongs = await db
    .select({
      id: songs.id,
      name: songs.name,
      artist: artists.name,
      author: authors.name,
      youtubeUrl: sql<string>`CONCAT(${episodes.youtubeUrl}, '&t=', ${songs.timestamp}, 's')`,
    })
    .from(songsToTags)
    .innerJoin(songs, eq(songsToTags.songId, songs.id))
    .innerJoin(artists, eq(artists.id, songs.artistId))
    .leftJoin(authors, eq(authors.id, songs.authorId))
    .innerJoin(episodes, eq(episodes.id, songs.episodeId))
    .where(eq(songsToTags.tagId, tagId));

  return { songs: tagSongs, tag };
}

export default function TagsDetail({ loaderData }: Route.ComponentProps) {
  const { songs, tag } = loaderData;
  return (
    <>
      <div className="mb-4">
        ⬅️{" "}
        <a href="/tags" className="text-blue-700 hover:underline">
          Volver a Tags
        </a>
      </div>
      <h2 className="font-bold text-2xl mb-4">Jingles con tag: {tag.name}</h2>
      <section className="flex flex-col gap-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </section>
    </>
  );
}
