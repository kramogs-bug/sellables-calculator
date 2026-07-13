import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code2, Github, Mail, MessageCircle, ShieldCheck, Wrench } from 'lucide-react';
import profileImage from '../assets/profile.png';

const skills = ['React', 'JavaScript', 'Tailwind CSS', 'Android & Capacitor', 'Local-first tools', 'UI/UX'];

const projects = [
  {
    name: 'Graal Sellables Calculator',
    description: 'A focused utility for calculating item values and tracking sellables in GraalOnline Era.',
    tags: ['React', 'Tailwind CSS', 'Local storage'],
    href: '/',
    internal: true,
  },
  {
    name: 'Cruze IT Solutions',
    description: 'A responsive company website built with a modern React and Next.js stack.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    href: 'https://cruze-it.vercel.app/',
  },
];

const contacts = [
  { label: 'Discord', value: 'itzmekramogs#2528', href: 'https://discord.com/users/itzmekramogs', icon: MessageCircle },
  { label: 'Email', value: 'vjohnmark673@gmail.com', href: 'mailto:vjohnmark673@gmail.com', icon: Mail },
  { label: 'GitHub', value: 'kramogs-bug', href: 'https://github.com/kramogs-bug', icon: Github },
];

export default function About() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E6F2DD] text-[#29453E]">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 border-b border-[#B1D3B9] pb-14 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#659287]">About the developer</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hi, I’m Kramogss.</h1>
            <p className="mt-6 text-lg leading-8 text-[#4F7168]">
              I build practical web tools and automation solutions. This calculator was made to give GraalOnline Era players a faster, clearer way to manage sellables and earnings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:vjohnmark673@gmail.com"
                className="inline-flex items-center gap-2 rounded-lg bg-[#659287] px-5 py-3 text-sm font-semibold text-white hover:bg-[#527A70]"
              >
                Get in touch <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/kramogs-bug"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#88BDA4] bg-white px-5 py-3 text-sm font-semibold text-[#46675F] hover:bg-[#D7E9D7]"
              >
                <Github size={17} aria-hidden="true" /> GitHub
              </a>
            </div>
          </div>

          <img
            src={profileImage}
            alt="Kramogss profile"
            decoding="async"
            className="size-36 rounded-2xl border-4 border-white object-cover shadow-sm sm:size-44"
          />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border border-[#B1D3B9] bg-white p-6 sm:p-8">
            <span className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#E6F2DD] text-[#659287]">
              <Wrench size={20} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">What I do</h2>
            <p className="mt-3 text-sm leading-6 text-[#5B766F]">
              I create useful, maintainable tools for the web, with a focus on game utilities, automation, and straightforward user experiences.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Web applications', 'Custom automation', 'Game utilities', 'Script optimization'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#46675F]">
                  <Check size={16} className="text-[#659287]" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-[#B1D3B9] bg-white p-6 sm:p-8">
            <span className="mb-5 flex size-10 items-center justify-center rounded-lg bg-[#E6F2DD] text-[#659287]">
              <Code2 size={20} aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold">Tools & skills</h2>
            <p className="mt-3 text-sm leading-6 text-[#5B766F]">Technologies I commonly use to turn ideas into reliable products.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-lg bg-[#E6F2DD] px-3 py-2 text-sm font-medium text-[#527A70]">{skill}</span>
              ))}
            </div>
          </article>
        </div>

        <section className="mt-16" aria-labelledby="projects-heading">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#659287]">Selected work</p>
          <h2 id="projects-heading" className="mt-2 text-3xl font-bold">Projects</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.name} className="flex flex-col rounded-xl border border-[#B1D3B9] bg-white p-6">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#5B766F]">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => <span key={tag} className="rounded-md bg-[#E6F2DD] px-2.5 py-1 text-xs font-medium text-[#527A70]">{tag}</span>)}
                </div>
                {project.internal ? (
                  <Link to={project.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#527A70] hover:text-[#29453E]">View project <ArrowRight size={16} /></Link>
                ) : (
                  <a href={project.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#527A70] hover:text-[#29453E]">View project <ArrowRight size={16} /></a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-xl border border-[#B1D3B9] bg-white p-6 sm:p-8" aria-labelledby="independent-tool-heading">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F2DD] text-[#659287]"><ShieldCheck size={20} aria-hidden="true" /></span>
            <div>
              <h2 id="independent-tool-heading" className="text-xl font-semibold">Independent and privacy-first</h2>
              <p className="mt-2 text-sm leading-6 text-[#5B766F]">This is an unofficial, fan-made utility and is not affiliated with or endorsed by GraalOnline or its publishers. Calculator records and preview images stay on your device.</p>
              <Link to="/privacy" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#527A70] hover:text-[#29453E]">Read the privacy policy <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-xl bg-[#659287] p-6 text-white sm:p-8" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-bold">Let’s connect</h2>
          <p className="mt-2 text-sm text-[#E6F2DD]">Questions, ideas, or feedback about the calculator are welcome.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {contacts.map(({ label, value, href, icon }) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="flex items-center gap-3 rounded-lg bg-white/10 p-4 hover:bg-white/20">
                {createElement(icon, { size: 20, 'aria-hidden': true })}
                <span className="min-w-0"><span className="block text-xs text-[#D9EADD]">{label}</span><span className="block truncate text-sm font-semibold">{value}</span></span>
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
