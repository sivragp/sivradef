import { PageTransition } from '../components/PageTransition';
import { motion } from 'motion/react';
import { Seo } from '../components/Seo';
import { breadcrumbList } from '../lib/jsonld';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

type Project = {
  key: string;
  name: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
};

const projects: Project[] = [
  {
    key: 'aimprenditori',
    name: 'Associazione Imprenditori Italia',
    url: 'https://aimprenditori.it/',
    category: 'Istituzionale · Editoriale',
    description:
      "Sito istituzionale dell'Associazione Imprenditori Italia, realtà di rappresentanza che affianca le PMI italiane su bandi, finanziamenti, formazione ed eventi. Sviluppato su Shopify con tema custom in Liquid. SIVRA cura la manutenzione del tema e la gestione editoriale completa: pubblicazione della news settimanale e aggiornamento continuo di bandi e opportunità di finanziamento.",
    tags: ['Shopify', 'Liquid', 'Gestione editoriale', 'Manutenzione tema', 'Content management'],
  },
  {
    key: 'asteryslab',
    name: 'Asterys Lab',
    url: 'https://asterys-lab-scuola-di-coaching-icf-8eib-r758rs4il.vercel.app',
    category: 'Formazione',
    description:
      "Sito di Asterys Lab, scuola di coaching accreditata ICF con sedi a Milano, Roma e online: percorsi di certificazione (Level 1 e 2, ACC/PCC/MCC), corsi brevi, team coaching sistemico, mentor coaching, supervisione e formazione per le aziende. SIVRA ha costruito il sito multi-pagina che presenta l'offerta formativa, gli accreditamenti ICF, gli eventi e il blog, con gestione SEO dedicata per ogni pagina.",
    tags: ['UI/UX', 'React', 'SEO', 'Formazione', 'Istituzionale'],
  },
  {
    key: 'diamanti',
    name: 'Diamanti Automobili',
    url: 'https://diamantiautomobili.com',
    category: 'Automotive · Lead gen',
    description:
      'Sito di Diamanti Automobili, consulente indipendente per l\'acquisto auto (auto broker) con base a Roma e operatività in tutta Italia: ricerca su misura, perizia, permuta, finanziamento e consegna a domicilio. SIVRA ha costruito e cura il sito vetrina orientato alla generazione di contatti, con percorso a step del servizio, form di richiesta consulenza (tipo veicolo e budget) e sezioni di prova come casi di consegna e brand trattati.',
    tags: ['UI/UX', 'Lead gen', 'Landing page', 'Form', 'SEO'],
  },
  {
    key: 'miriale',
    name: 'Miriale Holiday House',
    url: 'https://miriale-house.com',
    category: 'Hospitality',
    description:
      "Sito vetrina per una casa vacanze a Fiumicino, vicino Roma e all'aeroporto, con due appartamenti affittabili singolarmente o come struttura intera. SIVRA ha costruito e cura la presentazione della struttura: descrizione degli alloggi, gallery fotografica, sezione posizione e servizi, e contatto diretto per le richieste via WhatsApp, email e telefono, senza intermediari.",
    tags: ['UI/UX', 'Sito vetrina', 'Hospitality', 'Gallery', 'Lead gen'],
  },
  {
    key: 'easylocker',
    name: 'Easy Locker',
    url: 'https://easy-bagagli.vercel.app',
    category: 'SaaS · Prodotto',
    description:
      "Piattaforma SaaS multi-tenant per il deposito bagagli automatizzato, costruita da SIVRA. Gestisce l'intero flusso self-service: prenotazione online, pagamento con carta, invio del codice di sblocco via email e accesso agli armadietti H24. L'architettura config-driven per-tenant permette di attivare nuovi punti deposito con branding e listino dedicati; primo deployment live per Easy Bagagli a Roma Termini.",
    tags: ['SaaS', 'Multi-tenant', 'Booking', 'Payment', 'Next.js'],
  },
  {
    key: 'laterrazza',
    name: 'La Terrazza del Marchese',
    url: 'https://la-terrazza-del-marchese.vercel.app',
    category: 'Ristorazione · Hospitality',
    description:
      "Sito vetrina per un ristorante di cucina romana a Ostia Lido, con sala interna e terrazza per eventi privati. SIVRA ha costruito il sito su Next.js: racconto del locale (storia, cucina, terrazza), showcase dei piatti e gallery, con contatto diretto via telefono, WhatsApp ed email. Un'unica presenza online curata per comunicare l'identità del locale e canalizzare le prenotazioni.",
    tags: ['Next.js', 'UI/UX', 'Hospitality', 'Vercel', 'Landing page'],
  },
  {
    key: 'anticaloggia',
    name: 'Antica Loggia',
    url: 'https://antica-loggia.vercel.app',
    category: 'Hospitality · Casa vacanze',
    description:
      'Sito vetrina per Antica Loggia, casa vacanze in un appartamento storico del XVII secolo a Trevi, nel cuore dell\'Umbria. SIVRA ha costruito il sito che presenta la struttura, i servizi e la galleria fotografica, con navigazione tra ambienti, localizzazione e attrazioni del territorio. La richiesta di prenotazione è gestita via contatto diretto WhatsApp e form.',
    tags: ['UI/UX', 'Next.js', 'Hospitality', 'WhatsApp booking', 'Gallery'],
  },
];

function renderProjectCard(project: Project, index: number) {
  const isEager = index === 0;
  // Su desktop alterniamo il lato dell'immagine per dare ritmo alla pagina.
  const imageOnLeft = index % 2 === 1;

  return (
    <motion.article
      key={project.key}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      {/* Hero image reale del sito */}
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer noopener"
        className={`group relative block overflow-hidden rounded-sm border border-white/10 bg-card shadow-2xl transition-colors hover:border-accent/40 ${
          imageOnLeft ? 'lg:order-1' : 'lg:order-2'
        }`}
        aria-label={`Apri il sito ${project.name} in una nuova scheda`}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={`/portfolio/${project.key}.webp`}
            alt={`Anteprima del sito ${project.name} realizzato da SIVRA`}
            width={1280}
            height={800}
            loading={isEager ? 'eager' : 'lazy'}
            decoding={isEager ? 'auto' : 'async'}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <span className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-background/70 text-accent backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </a>

      {/* Contenuti */}
      <div className={`space-y-5 ${imageOnLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="font-mono text-xs uppercase tracking-widest text-accent sm:text-sm">
          {project.category}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-start gap-3 font-display text-3xl font-bold leading-tight transition-colors hover:text-accent sm:text-4xl"
        >
          <span>{project.name}</span>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-accent opacity-70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-7 sm:w-7" />
        </a>

        <p className="leading-relaxed text-muted">{project.description}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 rounded-sm border border-accent/40 px-5 py-2.5 text-sm font-bold text-accent transition-colors hover:bg-accent hover:text-black"
          >
            Visita il sito
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function CaseStudies() {
  return (
    <PageTransition>
      <Seo
        title="Portfolio: i progetti web realizzati da SIVRA"
        description="Il portfolio SIVRA: siti web, e-commerce e piattaforme SaaS costruiti su misura per PMI, associazioni e attività — hospitality, automotive, formazione e prodotti digitali."
        path="/case-studies"
        jsonLd={[
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Casi Studio', path: '/case-studies' },
          ]),
        ]}
      />

      <section className="border-b border-white/5 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-display text-4xl font-bold sm:text-6xl md:text-7xl"
          >
            I Nostri <span className="text-accent">Progetti</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            Costruiamo siti, e-commerce e piattaforme su misura per aziende,
            associazioni e attività. Ogni progetto è un ecosistema digitale
            pensato per comunicare valore e generare risultati concreti.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="space-y-20 sm:space-y-28 lg:space-y-32">
          {projects.map((project, index) => renderProjectCard(project, index))}
        </div>

        {/* CTA finale */}
        <section className="mt-20 rounded-sm border border-white/5 bg-card px-6 py-16 text-center sm:mt-28">
          <h2 className="mb-6 font-display text-3xl font-bold md:text-4xl">
            Vuoi un progetto come questi per la tua attività?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted">
            Analizziamo insieme i tuoi obiettivi e costruiamo la presenza
            digitale su misura per la tua realtà.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-sm bg-accent px-10 py-4 font-bold text-black transition-all hover:bg-accent-hover"
          >
            Prenota una chiamata strategica
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </div>
    </PageTransition>
  );
}
