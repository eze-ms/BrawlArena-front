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
    <section className="max-w-md mx-auto mt-10 text-white">
      <h2 className="text-2xl font-exo mb-6 text-center">Registrarse</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nickname"
          {...register('nickname', {
            required: 'El nickname es obligatorio',
            minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
            maxLength: { value: 20, message: 'No puede superar los 20 caracteres' },
          })}
          className="p-2 rounded bg-gray-800 text-white"
        />
        {errors.nickname && <p className="text-red-400 text-sm">{errors.nickname.message}</p>}

        <input
          type="password"
          placeholder="Contraseña"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
            maxLength: { value: 20, message: 'No puede superar los 20 caracteres' },
          })}
          className="p-2 rounded bg-gray-800 text-white"
        />
        {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

        {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-primary-orange py-2 px-4 rounded font-exo uppercase tracking-wide transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
          }`}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </section>
  );
}
