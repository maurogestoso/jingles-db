import type { Route } from "./+types/home";
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fabrica de Jingles DB" },
    {
      name: "description",
      content: "Base de datos de la Fabrica de Jingles de Gelatina",
    },
  ];
}

export default function Home({}: Route.ComponentProps) {
  return (
    <>
      <Form method="get" action="/search" className="mb-4">
        <div className="flex justify-center items-center space-x-2">
          <Input
            type="search"
            name="search"
            className="border-blue-300 max-w-lg"
            placeholder={`por ejemplo: "Let It Go", "Los Piojos" o "Marquitos"`}
          />
          <Button type="submit">Buscar</Button>
        </div>
      </Form>
    </>
  );
}
