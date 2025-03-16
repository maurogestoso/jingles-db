import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header className="p-4">
        <h1 className="text-4xl font-bold mb-6">Fabrica de Jingles DB</h1>
      </header>
      <main className="max-w-screen-lg mx-auto">
        <Outlet />
      </main>
    </>
  );
}
