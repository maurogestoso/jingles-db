import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header className="p-4 flex justify-center">
        <h1 className="text-4xl font-bold mb-6">Jingleeeeeees DB</h1>
      </header>
      <main className="max-w-screen-sm mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
