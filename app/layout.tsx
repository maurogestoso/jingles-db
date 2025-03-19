import { useRef, useState } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  const { eees, onMouseEnter, onMouseLeave } = useJingleeesAnimation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-center">
        <h1
          className="text-4xl font-bold mb-6"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          Jingl{eees}s! DB
        </h1>
      </header>
      <main className="max-w-screen-sm mx-auto p-4 flex-grow w-full">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="max-w-screen-sm mx-auto px-4 flex justify-between items-center text-gray-600">
          <span>EJLE ©️ 2025</span>
          <span>Hecho con ♥️ y ☕ por Mauro</span>
          <span>
            <a
              href="https://github.com/maurogestoso/jingles-db"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"<Código />"}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

function useJingleeesAnimation() {
  const interval = useRef<NodeJS.Timeout | null>(null);
  const [eees, setEees] = useState("e");
  return {
    eees,
    onMouseEnter: () => {
      clearInterval(interval.current!);
      interval.current = setInterval(() => {
        setEees((eees) => eees + "e");
      }, 100);
    },
    onMouseLeave: () => {
      clearInterval(interval.current!);
      interval.current = setInterval(() => {
        if (eees.length === 1) {
          clearInterval(interval.current!);
          return;
        }
        setEees((eees) => (eees.length > 1 ? eees.slice(0, -1) : "e"));
      }, 50);
    },
  };
}
