import type { Route } from "./+types/home";
import { Link } from "react-router";
import { db } from "~/db";
import { episodes } from "~/db/schema";
import { sql, desc } from "drizzle-orm";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

export async function loader() {
  const latestEpisodes = await db
    .select({
      id: episodes.id,
      date: episodes.date,
    })
    .from(episodes)
    .orderBy(desc(episodes.updatedAt))
    .limit(5);

  return { episodes: latestEpisodes };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">
        Listar jingles por:
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8">
        <Link
          className="text-2xl border-2 py-4 px-8 rounded-xl w-[200px] text-center text-red-600 border-red-600"
          to="/artistas"
        >
          Artistas
        </Link>
        <Link
          className="text-2xl border-2 py-4 px-8 rounded-xl w-[200px] text-center text-green-600 border-green-600"
          to="/jingleros"
        >
          Jingleros
        </Link>
        <Link
          className="text-2xl border-2 py-4 px-8 rounded-xl w-[200px] text-center text-blue-600 border-blue-600"
          to="/programas"
        >
          Programas
        </Link>
      </div>
      <div>
        <h2 className="font-bold text-2xl text-blue-900 mb-4">
          Últimos programas actualizados:
        </h2>
        <ul className="list-disc list-inside">
          {loaderData.episodes.map((episode) => (
            <li key={episode.id}>
              <Link
                to={`/programas/${episode.id}`}
                className="text-blue-600 underline"
              >
                {episode.date}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
