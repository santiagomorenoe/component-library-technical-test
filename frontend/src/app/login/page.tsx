'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components';
import { saveAuth, getStoredToken } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:4000';

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};

  if (!email.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // If already authenticated, skip to dashboard
  useEffect(() => {
    if (getStoredToken()) router.replace('/dashboard');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors = validate(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const body = await res.json();

      if (!res.ok) {
        setApiError(body.error ?? 'Credenciales incorrectas');
        return;
      }

      saveAuth(body.token as string, body.user as AuthUser);
      router.replace('/dashboard');
    } catch {
      setApiError(
        'No se pudo conectar al servidor. Verifica que el backend esté en ejecución.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            T1
          </span>
          <span className="text-xl font-bold text-gray-900 font-[var(--font-inter)]">
            T1 Library
          </span>
        </div>
        <p className="text-sm text-gray-500 font-[var(--font-inter)]">
          Dashboard de métricas
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6 font-[var(--font-inter)]">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 font-[var(--font-inter)]">
          <Input
            type="email"
            label="Correo electrónico"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
            validationState={fieldErrors.email ? 'error' : 'default'}
            errorMessage={fieldErrors.email}
            disabled={loading}
            autoComplete="email"
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
            }}
            validationState={fieldErrors.password ? 'error' : 'default'}
            errorMessage={fieldErrors.password}
            disabled={loading}
            autoComplete="current-password"
          />

          {apiError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700" role="alert">
                {apiError}
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full justify-center mt-2"
            trackingName="login-submit"
          >
            {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Credenciales de prueba
          </p>
          <button
            type="button"
            className="text-left w-full group"
            onClick={() => {
              setEmail('morenoestradasantiago@gmail.com');
              setPassword('password123');
              setFieldErrors({});
              setApiError(null);
            }}
          >
            <p className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors cursor-pointer">
              morenoestradasantiago@gmail.com
            </p>
            <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">
              password123
            </p>
          </button>
        </div>
      </div>

      <footer className="my-4">
        <Link href="/" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex flex-row gap-2 items-center">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            Regresar a la página principal
          </span>
        </Link>
      </footer>
    </div>
  );
}
