import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 max-w-screen-2xl mx-auto  p-5">
        <Outlet />
      </section>

      <footer>
        <p className="text-center bg-custom-footer text-white text-xs py-4">
          Todos los derechos reservados. {new Date().getFullYear()}
        </p>
      </footer>
    </main>  
  );
}
