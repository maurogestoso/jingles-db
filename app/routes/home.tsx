import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

export default function Home({}: Route.ComponentProps) {
  <>
    <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">
      Listar jingles por:
    </h2>
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
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
  </>;
}
