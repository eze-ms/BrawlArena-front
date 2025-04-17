import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ← cambia el import
import playButton from '../assets/play.webp';
import { ROUTES } from '../constants/routes';

export default function Home() {
  const { user } = useAuth(); // ← usa el nuevo hook
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (user) navigate(ROUTES.dashboard);
    else navigate(ROUTES.login);
  };

  return (
    <section className="flex flex-col items-center justify-center text-white text-center">
      <div className="my-8">
        <h2 className="text-4xl font-exo font-bold tracking-wider">Bienvenido a Brawl Arena</h2>
        <p className="mt-2 text-lg">Ensambla personajes, desbloquea poderes, ¡y comparte tus logros!</p>
      </div>

      <div className="mt-6">
        <img
          src={playButton}
          alt="Botón Jugar"
          className="w-40 cursor-pointer hover:scale-105 transition-transform"
          onClick={handlePlayClick}
        />
      </div>
    </section>
  );
}
