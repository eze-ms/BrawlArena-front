import { useEffect, useState } from 'react';

export interface AuthUser {
    nickname: string;
    role: 'USER' | 'ADMIN';
}

interface ValidateTokenResponse {
    valid: boolean;
    nickname: string;
    role: 'USER' | 'ADMIN';
}

const API_URL = import.meta.env.VITE_API_URL;

export function useAuthUser(): {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
} {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
  
        fetch(`${API_URL}/auth/validate`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res): Promise<ValidateTokenResponse> =>
            res.ok ? res.json() : Promise.reject('Token inválido')
            )
            .then((data) => {
            if (data.valid) {
                setUser({ nickname: data.nickname, role: data.role });
            } else {
                localStorage.removeItem('token');
            }
            })
            .catch(err => {
                console.error('Error al validar el token:', err);
                setError(typeof err === 'string' ? err : 'Error al validar el token');
                localStorage.removeItem('token');
            })
            .finally(() => setLoading(false));
    }, []);
  
    return { user, loading, error };
  }