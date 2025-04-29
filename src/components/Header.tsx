import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import NavMenu from './NavMenu';

export default function Header() {
  return (
    <header className="p-5 bg-custom-hover text-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-fortnite text-color-logo tracking-wide">
          <Link to={ROUTES.home}>Brawl Arena</Link>
        </h1>

        <NavMenu />
      </div>
    </header>
  );
}
