'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components';
import { saveAuth, getStoredToken } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:4000';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(name: string, email: string, password: string, confirmPassword: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!email.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  }

  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (getStoredToken()) router.replace('/dashboard');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors = validate(name, email, password, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const body = await res.json();

      if (!res.ok) {
        setApiError(
          res.status === 409
            ? 'Este correo ya está registrado.'
            : (body.error ?? 'No se pudo crear la cuenta.')
        );
        return;
      }

      saveAuth(body.token as string, body.user as AuthUser);
      router.replace('/dashboard');
    } catch {
      setApiError('No se pudo conectar al servidor. Verifica que el backend esté en ejecución.');
    } finally {
      setLoading(false);
    }
  }

  function clearError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
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
          Dashboard de Métricas
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6 font-[var(--font-inter)]">
          Crear cuenta
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 font-[var(--font-inter)]">
          <Input
            type="text"
            label="Nombre"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError('name'); }}
            validationState={fieldErrors.name ? 'error' : 'default'}
            errorMessage={fieldErrors.name}
            disabled={loading}
            autoComplete="name"
          />

          <Input
            type="email"
            label="Correo electrónico"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            validationState={fieldErrors.email ? 'error' : 'default'}
            errorMessage={fieldErrors.email}
            disabled={loading}
            autoComplete="email"
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
            validationState={fieldErrors.password ? 'error' : 'default'}
            errorMessage={fieldErrors.password}
            disabled={loading}
            autoComplete="new-password"
          />

          <Input
            type="password"
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
            validationState={fieldErrors.confirmPassword ? 'error' : 'default'}
            errorMessage={fieldErrors.confirmPassword}
            disabled={loading}
            autoComplete="new-password"
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
            trackingName="register-submit"
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400 font-[var(--font-inter)]">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
