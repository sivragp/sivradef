import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PageTransition } from '../components/PageTransition';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Seo, canonicalUrl } from '../components/Seo';
import { breadcrumbList, italianDateToISO, absoluteImage, orgRef } from '../lib/jsonld';
import { NotFound } from './NotFound';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    // Slug inesistente: renderizza la pagina NotFound (noindex) invece di
    // reindirizzare, così l'utente e i crawler vedono un vero 404.
    return <NotFound />;
  }

  const titleForHead = post.seoTitle ?? post.title;
  const fullTitle = `${titleForHead} — Blog SIVRA`;
  const description = post.metaDescription
    ? post.metaDescription
    : (() => {
        const baseDescription = `${post.excerpt} Scopri la guida completa sul blog SIVRA.`;
        return baseDescription.length > 160 ? `${baseDescription.slice(0, 157)}...` : baseDescription;
      })();

  const path = `/blog/${post.slug}`;
  const imageUrl = absoluteImage(post.image);
  const datePublished = italianDateToISO(post.date);

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl(path) },
    headline: post.title,
    description,
    image: imageUrl,
    datePublished,
    dateModified: datePublished,
    author: { '@type': 'Person', name: post.author },
    publisher: orgRef,
  };

  return (
    <PageTransition>
      <Seo
        title={fullTitle}
        description={description}
        path={path}
        ogImage={imageUrl}
        type="article"
        jsonLd={[
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
          blogPosting,
        ]}
      />
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors mb-12 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Torna al Blog
            </Link>

            <div className="flex items-center gap-4 mb-6 text-xs font-mono text-accent uppercase tracking-widest">
              <span>{post.category}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>
                {/\blettura\b/i.test(post.readTime) ? post.readTime : `${post.readTime} di lettura`}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold mb-10 tracking-tighter leading-[0.95]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 mb-16 py-8 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted uppercase tracking-widest mb-1">Data</div>
                  <div className="text-sm font-bold">{post.date}</div>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-sm overflow-hidden mb-16">
              <img
                src={post.image}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="blog-post-body max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-20 p-12 bg-card border border-white/5 rounded-sm text-center">
              <h3 className="text-2xl font-display font-bold mb-4">
                Vuoi implementare queste strategie nel tuo business?
              </h3>
              <p className="text-muted mb-8 max-w-xl mx-auto">
                Prenota una chiamata strategica gratuita di 30 minuti con il nostro team per analizzare il tuo sistema attuale.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-accent text-black px-8 py-4 rounded-sm font-bold hover:bg-accent-hover transition-colors"
              >
                Prenota Chiamata Strategica
              </Link>
            </div>
          </motion.div>
        </div>
      </article>
    </PageTransition>
  );
}
