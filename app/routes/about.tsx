import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "¿Qué es ésto? - Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

export default function About({}: Route.ComponentProps) {
  return (
    <>
      <h2 className="font-bold text-2xl text-blue-900 mb-4">¿Qué es ésto?</h2>
      <p>
        Un directorio de la Fábrica de Jingles de Gelatina. Una forma fácil de
        encontrar el jingle que necesitas escuchar ya. Un servicio a la
        comunidad.
      </p>
      <br />
      <p>
        Esta página no sería posible sin las aportaciones de la comunidad en los
        comentarios de los videos de YouTube. Ustedes saben quiénes son.
      </p>
      <br />
      <h3 className="font-bold text-xl text-blue-900">
        🚧🚧🚧🚧 Página en construcción 🚧🚧🚧🚧
      </h3>
      <br />
      <p>
        Añadir programas y curar los datos es un proceso artesanal, así que lo
        voy haciendo en mis ratos libres. Si querés ayudar,{" "}
        <a
          href="https://github.com/maurogestoso/jingles-db/issues"
          className="text-blue-600 underline"
        >
          abrite un issue en el repositorio de GitHub
        </a>{" "}
        y lo charlamos.
      </p>
      <br />
      <p>Funcionalidades que estoy cocinando:</p>
      <ul className="list-disc list-inside">
        <li>
          Taggear jingles para poder buscar por temáticas (por ejemplo:
          Guillermo Moreno o La Selección)
        </li>
        <li>Links a los jingles en Spotify</li>
        <li>
          Herramientas para que más gente pueda contribuir a curar los datos
        </li>
      </ul>
    </>
  );
}
