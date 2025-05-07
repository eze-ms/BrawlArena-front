// src/views/Login.tsx

import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES } from '../constants/routes';
import { API } from '../constants/api';
import { fetchWithAuth } from '../utils/fetchWithAuth';

type LoginForm = {
  nickname: string;
  password: string;
};

export default function Login() {
  const { refreshUser } = useAuth(); 
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");


  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${API.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Credenciales inválidas');

      const token = await res.text();
      localStorage.setItem('token', token);

      await refreshUser();

      const validateRes = await fetchWithAuth(API.auth.validate);
      const result = await validateRes.json();

      navigate(result.role === 'ADMIN' ? ROUTES.adminGallery : ROUTES.dashboard);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("Error inesperado al iniciar sesión");
      }
    }
  };

  return (
    <section className="max-w-md mx-auto mt-28 px-4 text-white">
      <div className="bg-gradient-to-br from-[#1e1e2f] via-[#2e1e355e] to-[#1e1e2f] p-6 pt-12 pb-12 rounded-2xl font-exo pl-12 pr-12">
        <h2 className="text-2xl font-exo font-medium text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-sm items-center">
          <input
            type="text"
            placeholder="Nickname"
            {...register('nickname', { required: true })}
            className="p-3 rounded-3xl bg-slate-950 text-white placeholder-gray-400 outline-none opacity-90"
          />
          {errors.nickname && <p className="text-red-400 text-sm -mt-3">El nickname es obligatorio</p>}
    
          <input
            type="password"
            placeholder="Contraseña"
            {...register('password', { required: true })}
            className="p-3 rounded-3xl bg-slate-950 text-white placeholder-gray-400 outline-none opacity-90"
          />
          {errors.password && <p className="text-red-400 text-sm -mt-3">La contraseña es obligatoria</p>}
    
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white py-2 font-exo shadow-md transition w-3/5 rounded-3xl"
          >
            Entrar
          </button>

          {errorMessage && (
            <p className="text-red-400 text-sm text-center mt-4">{errorMessage}</p>
          )}

        </form>
        
        <p className="mt-6 text-sm text-center text-white flex flex-col">
          ¿No tienes cuenta?{' '}
          <span
            className="text-purple-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(ROUTES.register)}
          >
            Regístrate
          </span>
        </p>
      </div>
    </section>
  
  );
}
