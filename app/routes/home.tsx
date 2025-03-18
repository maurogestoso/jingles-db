import type { Route } from "./+types/home";
import { Form, useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

const placeholderByCriteria = new Map([
  ["artistas", "por ejemplo: 'Los Piojos'"],
  ["canciones", "por ejemplo: 'Barro tal vez'"],
  ["jingleros", "por ejemplo: 'Negro Andante'"],
]);

export default function Home({}: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const criterio = searchParams.get("criterio");

  const handleCriterioClick = (criterio: string) => () => {
    const params = new URLSearchParams();
    params.set("criterio", criterio);
    setSearchParams(params);
  };

  if (!criterio) {
    return (
      <>
        <h2 className="text-2xl font-bold text-center mb-4">Buscar por:</h2>
        <div className="flex justify-center items-center space-x-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
            onClick={handleCriterioClick("artistas")}
          >
            Artistas
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 cursor-pointer"
            onClick={handleCriterioClick("canciones")}
          >
            Canciones
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 cursor-pointer"
            onClick={handleCriterioClick("jingleros")}
          >
            Jingleros
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <Form method="get" action={`/busqueda`} className="mb-4">
        <div className="flex justify-center items-center space-x-2">
          <input type="hidden" name="criterio" value={criterio} />
          <Input
            type="text"
            name="busqueda"
            className="border-blue-300 max-w-lg"
            placeholder={placeholderByCriteria.get(criterio!)}
            autoFocus
          />
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 cursor-pointer"
          >
            Buscar
          </Button>
        </div>
      </Form>
    );
  }
}
