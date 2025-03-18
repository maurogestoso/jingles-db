import { useRef, useState } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  const { eees, onMouseEnter, onMouseLeave } = useJingleeesAnimation();
  return (
    <>
      <header className="p-4 flex justify-center">
        <h1
          className="text-4xl font-bold mb-6"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          Jingl{eees}s! DB
        </h1>
      </header>
      <main className="max-w-screen-sm mx-auto p-4">
        <Outlet />
      </main>
    </>
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
