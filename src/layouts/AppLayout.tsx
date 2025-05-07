import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <main className="min-h-screen flex flex-col items-center">
      <header className="fixed top-0 left-0 w-full z-50">
        
        <Header />
      </header>

      {isHome ? (
        // Home sin layout restrictivo
        <Outlet />
      ) : (
        // Resto de páginas con padding y centrado
        <section className="flex-1 max-w-screen-2xl mx-auto p-5">
          <Outlet />
        </section>
      )}

      {/* Footer fijo */}
      <footer className="fixed bottom-0 left-0 w-full z-40">
        <p className="text-center bg-custom-footer text-white text-xs py-4">
          Todos los derechos reservados. {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
