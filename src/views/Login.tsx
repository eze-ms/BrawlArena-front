import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

type LoginForm = {
  nickname: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log('[Login] Enviando credenciales:', data);
    
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    
      if (!res.ok) {
        console.error('[Login] Error: credenciales inválidas');
        throw new Error('Credenciales inválidas');
      }
    
      const token = await res.text();
      console.log('[Login] Token recibido:', token);
      localStorage.setItem('token', token);
    
      const validate = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      const result = await validate.json();
      console.log('[Login] Usuario autenticado:', result);
    
      navigate(result.role === 'ADMIN' ? ROUTES.adminDashboard : ROUTES.dashboard);
    } catch (e) {
      console.error('[Login] Error inesperado:', e);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 text-white">
      <h2 className="text-2xl font-exo mb-6 text-center">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nickname"
          {...register('nickname', { required: true })}
          className="p-2 rounded bg-gray-800 text-white"
        />
        {errors.nickname && <p className="text-red-400 text-sm">El nickname es obligatorio</p>}

        <input
          type="password"
          placeholder="Contraseña"
          {...register('password', { required: true })}
          className="p-2 rounded bg-gray-800 text-white"
        />
        {errors.password && <p className="text-red-400 text-sm">La contraseña es obligatoria</p>}

        <button
          type="submit"
          className="bg-primary-orange py-2 px-4 rounded font-exo uppercase tracking-wide hover:bg-opacity-80 transition"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-white">
        ¿No tienes cuenta?{' '}
        <span
          className="text-primary-orange font-semibold cursor-pointer hover:underline"
          onClick={() => navigate(ROUTES.register)}
        >
          Regístrate
        </span>
      </p>
    </section>
  );
}
