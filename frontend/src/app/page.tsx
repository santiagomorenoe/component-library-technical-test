'use client';

import { useState } from 'react';
import { ArrowDown, Github, Zap, Shield, BarChart2, Mail, ArrowRight, ChevronRight } from 'lucide-react';
import { Button, Input, Modal, Card, ExportButton } from '@/components';
import { motion } from 'framer-motion';


type ActiveModal = {
  size: 'small' | 'medium' | 'large';
  title: string;
} | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  }

  function handleScrollToShowcase() {
    const showcase = document.getElementById('showcase-section');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #D93927 100%)",
          }}
        />
        <div className="w-full overflow-hidden b">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:16px_16px] opacity-15" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 lg:py-32">

            <div className="mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-6 flex justify-center"
              >
                <div className="bg-black inline-flex items-center rounded-full px-3 py-1 text-sm backdrop-blur-sm">
                  <span className="text-white">
                    Presentando nuestra librería de componentes T1
                  </span>
                  <ChevronRight className="text-white ml-1 h-4 w-4" />
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="from-primary/70 via-black/85 to-primary bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Construye interfaces hermosas con velocidad y precisión con T1
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-black mx-auto mt-6 max-w-2xl text-center text-lg"
              >
                Una librería de componentes UI moderna diseñada para ayudar a los desarrolladores a crear aplicaciones web hermosas con el mínimo esfuerzo. Totalmente personalizable, responsive y accesible.
              </motion.p>

              <div className="flex justify-center gap-8 pt-4">
                <Button variant="primary" trackingName="hero-start" className="bg-primary" icon={<ArrowDown className="w-4 h-4" />} onClick={handleScrollToShowcase}>
                  Explorar componentes
                </Button>
                <Button variant="secondary" trackingName="hero-github" icon={<Github className="w-4 h-4" />} onClick={() => window.open('https://github.com/t1-ui/t1', '_blank')}>
                  GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl relative z-10 mx-auto px-4 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Zap className="w-5 h-5 text-primary" />,
            title: 'Tracking automático',
            desc: 'Eventos mount, click y más registrados por defecto sin configuración.',
          },
          {
            icon: <Shield className="w-5 h-5 text-primary" />,
            title: 'TypeScript first',
            desc: 'Interfaces completas con validación en tiempo de compilación.',
          },
          {
            icon: <BarChart2 className="w-5 h-5 text-primary" />,
            title: 'Analytics listos',
            desc: 'API REST con stats, filtros por fecha/proyecto y exportación CSV.',
          },
        ].map(({ icon, title, desc }) => (
          <Card key={title} borderStyle="default">
            <div className="flex items-start gap-3 font-[var(--font-inter)]">
              <div className="mt-0.5 shrink-0">{icon}</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <main
        id="showcase"
        className="max-w-4xl mx-auto px-4 py-12 space-y-16 font-[var(--font-inter)] mt-20"
      >
        <section id="showcase-section">
          <SectionHeader
            tag="Button"
            title="Button"
            description="Tres variantes, tres tamaños, estados de carga y soporte para iconos opcionales."
          />

          <div className="space-y-4">
            <ShowcaseRow label="Variantes">
              <Button variant="primary" trackingName="sc-btn-primary">Primary</Button>
              <Button variant="secondary" trackingName="sc-btn-secondary">Secondary</Button>
              <Button variant="danger" trackingName="sc-btn-danger">Danger</Button>
            </ShowcaseRow>

            <ShowcaseRow label="Tamaños">
              <Button size="sm" variant="secondary" trackingName="sc-btn-sm">Small</Button>
              <Button size="md" trackingName="sc-btn-md">Medium</Button>
              <Button size="lg" trackingName="sc-btn-lg">Large</Button>
            </ShowcaseRow>

            <ShowcaseRow label="Con iconos">
              <Button
                icon={<Mail className="w-4 h-4" />}
                trackingName="sc-btn-icon-left"
              >
                Enviar email
              </Button>
              <Button
                variant="secondary"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                trackingName="sc-btn-icon-right"
              >
                Continuar
              </Button>
              <Button
                variant="danger"
                icon={<Github className="w-4 h-4" />}
                trackingName="sc-btn-icon-github"
              >
                GitHub
              </Button>
            </ShowcaseRow>

            <ShowcaseRow label="Estados">
              <Button
                loading={saving}
                trackingName="sc-btn-loading"
                onClick={handleSave}
              >
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
              <Button disabled trackingName="sc-btn-disabled">
                Deshabilitado
              </Button>
              <Button variant="danger" disabled trackingName="sc-btn-danger-disabled">
                Eliminar
              </Button>
            </ShowcaseRow>
          </div>
        </section>

        <section>
          <SectionHeader
            tag="Input"
            title="Input"
            description="Tipos text, email y password con estados de validación, labels y mensajes de ayuda."
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@empresa.com"
            />
            <Input
              type="text"
              label="Nombre de usuario"
              placeholder="john_doe"
              validationState="error"
              errorMessage="Este nombre de usuario ya está en uso"
            />
            <Input
              type="text"
              label="Código de invitación"
              placeholder="INV-XXXX"
              validationState="success"
              successMessage="Código válido — bienvenido"
            />
            <Input
              type="password"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
            />
            <Input
              type="email"
              label="Email (deshabilitado)"
              placeholder="admin@empresa.com"
              disabled
            />
          </div>
        </section>

        <section>
          <SectionHeader
            tag="Card"
            title="Card"
            description="Header, body y footer opcionales. Tres estilos de borde y soporte para imágenes."
          />

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <Card
              borderStyle="default"
              header="Default"
              footer={
                <Button size="sm" variant="secondary" trackingName="card-default-cta">
                  Ver más
                </Button>
              }
            >
              Borde estándar con header y footer. Ideal para contenido general.
            </Card>

            <Card
              borderStyle="accent"
              header="Accent"
              footer={
                <Button size="sm" variant="primary" trackingName="card-accent-cta">
                  Explorar
                </Button>
              }
            >
              Borde izquierdo azul para destacar información prioritaria.
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card
              image={{
                src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
                alt: 'Design system preview',
              }}
              header="Design System"
              footer={
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    trackingName="card-img-cancel"
                    onClick={() => { }}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" variant="primary" trackingName="card-img-confirm">
                    Confirmar
                  </Button>
                </div>
              }
            >
              Componentes listos para producción con tracking integrado y cobertura
              de tests &gt;80 %.
            </Card>

            <Card
              borderStyle="accent"
              header={
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  <span>Uso de componentes</span>
                </div>
              }
            >
              <div className="space-y-4">
                {[
                  { label: 'Button', uses: 1204, pct: 88 },
                  { label: 'Input', uses: 876, pct: 64 },
                  { label: 'Modal', uses: 341, pct: 25 },
                  { label: 'Card', uses: 198, pct: 15 },
                ].map(({ label, uses, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">{label}</span>
                      <span>{uses.toLocaleString()} usos</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeader
            tag="Modal"
            title="Modal"
            description="Tres tamaños, cierre vía X, overlay y tecla Escape. Header, body y footer configurables."
          />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              trackingName="sc-modal-small"
              onClick={() => setActiveModal({ size: 'small', title: 'Confirmación rápida' })}
            >
              Abrir Small
            </Button>
            <Button
              variant="primary"
              trackingName="sc-modal-medium"
              onClick={() => setActiveModal({ size: 'medium', title: 'Confirmar acción' })}
            >
              Abrir Medium
            </Button>
            <Button
              variant="danger"
              trackingName="sc-modal-large"
              onClick={() =>
                setActiveModal({ size: 'large', title: 'Formulario de registro' })
              }
            >
              Abrir Large
            </Button>
          </div>
        </section>

        {/* ── ExportButton ──────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            tag="ExportButton"
            title="ExportButton"
            description="Descarga los datos de tracking como CSV (datos crudos) o JSON (con metadatos). Ambos endpoints requieren autenticación."
          />

          <div className="bg-white rounded-lg border border-gray-200 px-5 py-6 space-y-5">
            {/* Without token — shows error state */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Sin token (muestra error de autenticación)
              </p>
              <ExportButton trackingName="sc-export-no-token" />
            </div>

            {/* With token — simulated */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Con token y filtros por componente
              </p>
              <ExportButton
                token="demo-token"
                filters={{ componentName: 'Button' }}
                trackingName="sc-export-with-token"
              />
            </div>
          </div>
        </section>
      </main>

      {activeModal && (
        <Modal
          isOpen
          onClose={() => setActiveModal(null)}
          size={activeModal.size}
          header={activeModal.title}
          footer={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                trackingName="modal-cancel"
                onClick={() => setActiveModal(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                trackingName="modal-confirm"
                onClick={() => setActiveModal(null)}
              >
                Confirmar
              </Button>
            </div>
          }
        >
          <div className="font-[var(--font-inter)]">
            {activeModal.size === 'small' && (
              <p className="text-gray-600 text-sm">
                Este modal pequeño es ideal para confirmaciones rápidas o alertas breves.
              </p>
            )}

            {activeModal.size === 'medium' && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  ¿Estás seguro de que deseas continuar? Esta operación no se puede
                  deshacer.
                </p>
                <Input label="Escribe 'confirmar' para continuar" placeholder="confirmar" />
              </div>
            )}

            {activeModal.size === 'large' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  El modal large permite alojar formularios completos o contenido extenso.
                </p>
                <Input type="text" label="Nombre completo" placeholder="Juan García" />
                <Input type="email" label="Correo electrónico" placeholder="juan@empresa.com" />
                <Input type="password" label="Contraseña" placeholder="Mínimo 8 caracteres" />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function SectionHeader({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <span className="inline-block text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 mb-2">
        {'<'}{tag}{' />'}
      </span>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
