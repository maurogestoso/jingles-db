import type { Route } from "./+types/home";
import { Form, useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

type Criteria = "artistas" | "canciones" | "jingleros";
const placeholderByCriteria = new Map<Criteria, string>([
  ["artistas", "por ejemplo: 'Los Piojos'"],
  ["canciones", "por ejemplo: 'Barro tal vez'"],
  ["jingleros", "por ejemplo: 'Negro Andante'"],
]);

export default function Home({}: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCriteria = searchParams.get("criterio") as Criteria;

  const handleCriteriaClick = (criteria: Criteria) => () => {
    const params = new URLSearchParams();
    params.set("criterio", criteria);
    setSearchParams(params);
  };

  if (!selectedCriteria) {
    return (
      <>
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">
          Buscar por:
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <CriteriaButton
            borderColor="border-red-600"
            onClick={handleCriteriaClick("artistas")}
          >
            Artistas
          </CriteriaButton>
          <CriteriaButton
            borderColor="border-green-600"
            onClick={handleCriteriaClick("canciones")}
          >
            Canciones
          </CriteriaButton>
          <CriteriaButton
            borderColor="border-blue-600"
            onClick={handleCriteriaClick("jingleros")}
          >
            Jingleros
          </CriteriaButton>
        </div>
      </>
    );
  } else {
    return (
      <Form method="get" action={`/busqueda`} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-blue-900 self-start">
          Busqueda por {selectedCriteria}:
        </h2>
        <div className="flex flex-col gap-2">
          <input type="hidden" name="criterio" value={selectedCriteria} />
          <Input
            type="text"
            name="busqueda"
            className="h-16 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
            placeholder={placeholderByCriteria.get(selectedCriteria)}
            autoFocus
          />
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 cursor-pointer text-xl h-16 rounded-xl"
          >
            <SearchIcon /> Buscar
          </Button>
        </div>
      </Form>
    );
  }
}

function CriteriaButton({
  borderColor,
  children,
  onClick,
}: {
  borderColor: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`border-2 ${borderColor} cursor-pointer w-[200px] py-6 rounded-xl text-xl`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
