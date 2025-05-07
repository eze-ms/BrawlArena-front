import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import playButton from '../assets/play.webp';
import backgroundImage from '../assets/cover.webp';
import { ROUTES } from '../constants/routes';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (user) navigate(ROUTES.dashboard);
    else navigate(ROUTES.login);
  };

  return (
    <section
      className="flex flex-col items-center justify-center text-white text-center bg-cover bg-center min-h-screen w-full md:w-4/5 px-4 sm:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >

    
      <div className="absolute bottom-32">
        <img
          src={playButton}
          alt="Botón Jugar"
          className="w-32 sm:w-40 cursor-pointer hover:scale-105 transition-transform"
          onClick={handlePlayClick}
        />
      </div>
    </section>
  );
}
