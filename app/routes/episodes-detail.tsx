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
import type { Route } from "./+types/episodes-detail";
import SongCard from "~/components/song-card";

export async function loader({ params }: Route.LoaderArgs) {
  const [episode] = await db
    .select({
      id: episodes.id,
      date: episodes.date,
      youtubeUrl: episodes.youtubeUrl,
    })
    .from(episodes)
    .where(eq(episodes.id, Number(params.id)));
  if (!episode) {
    return new Response("Not Found", { status: 404 });
  }
  const episodeSongs = await db
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
    .where(eq(songs.episodeId, Number(params.id)))
    .innerJoin(artists, eq(artists.id, songs.artistId))
    .leftJoin(authors, eq(authors.id, songs.authorId))
    .innerJoin(episodes, eq(episodes.id, songs.episodeId))
    .leftJoin(songsToTags, eq(songsToTags.songId, songs.id))
    .leftJoin(tags, eq(songsToTags.tagId, tags.id))
    .groupBy(songs.id, songs.name)
    .orderBy(asc(songs.timestamp));

  return { episode, songs: episodeSongs };
}

export default function Episode({ loaderData }: Route.ComponentProps) {
  const { episode, songs } = loaderData;
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Programa del {episode?.date}</h2>
      <section className="flex flex-col gap-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </section>
    </>
  );
}
