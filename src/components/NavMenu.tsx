import { Fragment, useCallback } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/20/solid';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { ROUTES } from '../constants/routes';

export default function NavMenu() {
  const { user } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate(ROUTES.login);
  }, [navigate]);

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-blue-500">
        <Bars3Icon className="w-8 h-8 text-white" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-custom-footer p-4 text-sm font-exo font-semibold leading-6 text-white shadow-lg ring-1 ring-gray-900/5">
            {!user ? (
              <>
                <Link to={ROUTES.login} className="block p-2 hover:text-purple-950">
                  Login
                </Link>
                <Link to={ROUTES.gallery} className="block p-2 hover:text-purple-950">
                  Galería
                </Link>
              </>
            ) : (
              <>
                <p className="text-center">Hola: {user.nickname}</p>

                {user.role === 'USER' && (
                  <>
                    <Link to={ROUTES.dashboard} className="block p-2 hover:text-purple-950">
                      Mi Perfil
                    </Link>
                    <Link to={ROUTES.gallery} className="block p-2 hover:text-purple-950">
                      Galería
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <Link to={ROUTES.adminDashboard} className="block p-2 hover:text-purple-950">
                    Panel Admin
                  </Link>
                )}

                <button
                  className="block p-2 hover:text-purple-950 text-left w-full"
                  type="button"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
