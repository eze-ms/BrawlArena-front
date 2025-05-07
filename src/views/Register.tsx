// src/views/Register.tsx

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ROUTES } from '../constants/routes';
import { API } from '../constants/api';

type RegisterForm = {
  nickname: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${API.auth.register}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al registrar usuario');
      }

      navigate(ROUTES.login);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-28 text-white">
      <div className="bg-gradient-to-br from-[#1e1e2f] via-[#2e1e355e] to-[#1e1e2f] p-6 pt-12 pb-12 pl-12 pr-12 rounded-2xl font-exo">
        <h2 className="text-2xl font-exo font-medium text-center mb-6">Registrarse</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-sm items-center">
          <input
            type="text"
            placeholder="Nickname"
            {...register('nickname', {
              required: 'El nickname es obligatorio',
              minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
              maxLength: { value: 20, message: 'No puede superar los 20 caracteres' },
            })}
            className="p-3 rounded-3xl bg-slate-950 text-white placeholder-gray-400 outline-none opacity-90"
          />
          {errors.nickname && <p className="text-red-400 text-sm -mt-3">{errors.nickname.message}</p>}

          <input
            type="password"
            placeholder="Contraseña"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
              maxLength: { value: 20, message: 'No puede superar los 20 caracteres' },
            })}
            className="p-3 rounded-3xl bg-slate-950 text-white placeholder-gray-400 outline-none opacity-90"
          />
          {errors.password && <p className="text-red-400 text-sm -mt-3">{errors.password.message}</p>}

          {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-purple-600 hover:bg-purple-500 text-white py-2 w-3/4 rounded-3xl font-exo shadow-md transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>

    </section>
  );
}
