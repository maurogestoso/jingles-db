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
import type { Route } from "./+types/artists-detail";
import SongCard from "~/components/song-card";

export async function loader({ params }: Route.LoaderArgs) {
  const artistId = Number(params.id);
  const [artist] = await db
    .select({
      id: artists.id,
      name: artists.name,
    })
    .from(artists)
    .where(eq(artists.id, artistId));
  if (!artist) {
    return new Response("Not Found", { status: 404 });
  }

  const artistSongs = await db
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
    .where(eq(songs.artistId, artistId))
    .innerJoin(artists, eq(artists.id, songs.artistId))
    .leftJoin(authors, eq(authors.id, songs.authorId))
    .innerJoin(episodes, eq(episodes.id, songs.episodeId))
    .leftJoin(songsToTags, eq(songsToTags.songId, songs.id))
    .leftJoin(tags, eq(songsToTags.tagId, tags.id))
    .orderBy(asc(songs.timestamp))
    .groupBy(songs.id, songs.name);

  return { artist, songs: artistSongs };
}

export default function ArtistDetailRoute({
  loaderData,
}: Route.ComponentProps) {
  const { artist, songs } = loaderData;
  return (
    <>
      <div className="mb-4">
        ⬅️{" "}
        <a href="/artistas" className="text-blue-700 hover:underline">
          Volver a Artistas
        </a>
      </div>
      <h2 className="font-bold text-2xl mb-4">Jingles de {artist.name}</h2>
      <section className="flex flex-col gap-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </section>
    </>
  );
}
