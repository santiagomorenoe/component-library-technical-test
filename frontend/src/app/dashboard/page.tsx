'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, LogOut, BarChart2, Activity, Layers, Clock } from 'lucide-react';
import { Button, Card, ExportButton } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useStats } from '@/hooks/useStats';
import type { ComponentStat } from '@/hooks/useStats';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Ahora mismo';
  if (mins === 1) return 'Hace 1 min';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return 'Hace 1 hora';
  if (hours < 24) return `Hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Hace 1 día' : `Hace ${days} días`;
}

function pct(value: number, max: number): number {
  return max === 0 ? 0 : Math.round((value / max) * 100);
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card borderStyle="default">
      <div className="flex items-start gap-3 font-[var(--font-inter)]">
        <div className="p-2 bg-blue-50 rounded-lg shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

function BreakdownCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const maxVal = entries[0]?.[1] ?? 1;

  return (
    <Card borderStyle="default" header={title}>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Sin datos</p>
      ) : (
        <div className="space-y-3 font-[var(--font-inter)]">
          {entries.map(([key, count]) => (
            <div key={key}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="font-medium capitalize">{key}</span>
                <span>{count.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${pct(count, maxVal)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TopComponentsCard({
  components,
  loading,
  onRefresh,
}: {
  components: ComponentStat[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const maxTotal = components[0]?.total ?? 1;

  return (
    <Card
      borderStyle="default"
      header={
        <div className="flex items-center justify-between w-full">
          <span>Top Componentes</span>
          <Button
            size="sm"
            variant="secondary"
            loading={loading}
            icon={<RefreshCw className="w-3 h-3" />}
            trackingName="dashboard-refresh"
            onClick={onRefresh}
          >
            Actualizar
          </Button>
        </div>
      }
    >
      {components.length === 0 ? (
        <div className="text-center py-8 font-[var(--font-inter)]">
          <BarChart2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            Sin eventos registrados aún.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Integra el tracker en tus componentes para ver métricas aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4 font-[var(--font-inter)]">
          {components.map((comp) => (
            <div key={comp.componentName}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{comp.componentName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">
                    {timeAgo(comp.lastUsed)}
                  </span>
                </div>
                <span className="text-gray-500 text-xs font-medium">
                  {comp.total.toLocaleString()} eventos
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${pct(comp.total, maxTotal)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 animate-pulse">
      <div className="flex gap-3">
        <div className="w-9 h-9 bg-gray-100 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-24" />
          <div className="h-7 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, initialized, logout } = useAuth();
  const { data, loading, error, refetch } = useStats();

  // Auth guard — wait for localStorage to hydrate before redirecting
  useEffect(() => {
    if (!initialized) return;
    if (!token) router.replace('/login');
  }, [initialized, token, router]);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  // Don't flash dashboard to unauthenticated users
  if (!initialized || !token) return null;

  const topComponent = data?.topComponents[0] ?? null;

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-inter)]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              T1
            </span>
            <span className="font-bold text-gray-900">T1 Library</span>
            <span className="hidden sm:block text-gray-300 mx-1">·</span>
            <span className="hidden sm:block text-sm text-gray-500">Dashboard de métricas</span>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-sm text-gray-600 truncate max-w-[180px]">
                {user.name}
              </span>
            )}
            <Button
              size="sm"
              variant="secondary"
              icon={<LogOut className="w-3.5 h-3.5" />}
              trackingName="dashboard-logout"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de métricas</h1>
            {data?.generatedAt && (
              <p className="text-xs text-gray-400 mt-0.5">
                Actualizado: {new Date(data.generatedAt).toLocaleTimeString('es-MX')}
              </p>
            )}
          </div>
        </div>

        {error && (
          <Card borderStyle="accent">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700">
                {error}. Verifica que el backend esté corriendo.
              </p>
              <Button
                size="sm"
                variant="secondary"
                trackingName="dashboard-retry"
                onClick={refetch}
              >
                Reintentar
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                icon={<Activity className="w-5 h-5 text-blue-600" />}
                label="Total de eventos"
                value={(data?.totalEvents ?? 0).toLocaleString()}
                sub="Eventos de tracking"
              />
              <StatCard
                icon={<Layers className="w-5 h-5 text-blue-600" />}
                label="Componentes"
                value={data?.topComponents.length ?? 0}
                sub="Componentes registrados"
              />
              <StatCard
                icon={<BarChart2 className="w-5 h-5 text-blue-600" />}
                label="Más usado"
                value={topComponent?.componentName ?? '—'}
                sub={
                  topComponent
                    ? `${topComponent.total.toLocaleString()} eventos`
                    : undefined
                }
              />
              <StatCard
                icon={<Clock className="w-5 h-5 text-blue-600" />}
                label="Última actividad"
                value={topComponent ? timeAgo(topComponent.lastUsed) : '—'}
                sub="Evento más reciente"
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TopComponentsCard
              components={data?.topComponents ?? []}
              loading={loading}
              onRefresh={refetch}
            />
          </div>

          <div>
            <Card
              borderStyle="default"
              header="Exportar datos"
              footer={
                <p className="text-xs text-gray-400">
                  CSV exporta eventos crudos; JSON incluye metadatos.
                </p>
              }
            >
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Descarga todos los eventos de tracking con los filtros activos.
                </p>
                <ExportButton
                  token={token ?? ''}
                  trackingName="dashboard-export"
                />
              </div>
            </Card>
          </div>
        </div>

        {topComponent && (
          <>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-700">
                Detalle: {topComponent.componentName}
              </h2>
              <span className="text-xs text-gray-400">
                ({topComponent.total.toLocaleString()} eventos totales)
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <BreakdownCard
                title="Por variante"
                data={topComponent.variantBreakdown}
              />
              <BreakdownCard
                title="Por acción"
                data={topComponent.actionBreakdown}
              />
            </div>
          </>
        )}

        {(data?.topComponents.length ?? 0) > 1 && (
          <Card borderStyle="default" header="Todos los componentes">
            <div className="overflow-x-auto font-[var(--font-inter)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">
                      Componente
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 pb-2 pr-4">
                      Eventos
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4 hidden sm:table-cell">
                      Variantes
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-2 hidden sm:table-cell">
                      Última actividad
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data!.topComponents.map((comp) => (
                    <tr key={comp.componentName} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4 font-medium text-gray-800">
                        {comp.componentName}
                      </td>
                      <td className="py-2.5 pr-4 text-right text-gray-600">
                        {comp.total.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(comp.variantBreakdown).map((v) => (
                            <span
                              key={v}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 text-gray-400 text-xs hidden sm:table-cell">
                        {timeAgo(comp.lastUsed)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
