import { useRef, useState } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="p-2 min-h-screen flex">
      <div className="flex flex-col border-2 border-blue-800 rounded-lg flex-grow">
        <header className="p-4 flex justify-between mb-4">
          <h1 className="text-4xl font-bold text-blue-900">Jingleees! DB</h1>
          <a href="https://gelatina.com.ar/" target="_blank">
            <img src="/gelatina-logo.png" alt="gelatina" className="size-10" />
          </a>
        </header>
        <main className="max-w-screen-sm mx-auto px-4 flex-grow w-full">
          <Outlet />
        </main>
        <footer className="py-2 text-sm border-t border-blue-800 border-dashed">
          <div className="max-w-screen-sm mx-auto px-4 flex justify-between items-center text-gray-600">
            <p className="">EJLE ©️ 2025</p>
            <p>
              Hecho con ♥️ y ☕ por MG{" "}
              <a
                href="https://github.com/maurogestoso/jingles-db"
                target="_blank"
              >
                {"</>"}
              </a>
            </p>
          </div>
        </footer>
      </div>
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
