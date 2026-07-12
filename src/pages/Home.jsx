import { Link } from 'react-router-dom';
import { createElement } from 'react';
import { ArrowRight, BarChart3, Calculator, Check, Package } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Quick calculations',
    description: 'Enter your item quantities and get the total value in Gralats right away.',
  },
  {
    icon: Package,
    title: 'Sellable items',
    description: 'Keep common shells, minerals, flowers, and other items in one clear view.',
  },
  {
    icon: BarChart3,
    title: 'Simple tracking',
    description: 'Track your progress without clutter, unnecessary effects, or complicated controls.',
  },
];

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E6F2DD] text-[#29453E]">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#659287]">
            GraalOnline Era utility
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Calculate and track your sellables.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4F7168]">
            A straightforward tool for checking item values and keeping track of your earnings in one place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#659287] px-5 py-3 text-sm font-semibold text-white hover:bg-[#527A70]"
            >
              Open calculator <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              to="/tracker"
              className="inline-flex items-center justify-center rounded-lg border border-[#88BDA4] bg-white px-5 py-3 text-sm font-semibold text-[#46675F] hover:bg-[#D7E9D7]"
            >
              View tracker
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <article key={title} className="rounded-xl border border-[#B1D3B9] bg-white p-6">
              <span className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#E6F2DD] text-[#659287]">
                {createElement(icon, { size: 20, 'aria-hidden': true })}
              </span>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5B766F]">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#B1D3B9] pt-8 text-sm text-[#527A70]">
          {['21+ sellable items', 'Instant totals', 'Free to use'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <Check size={16} className="text-[#659287]" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
