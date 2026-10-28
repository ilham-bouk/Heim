import Breadcrumb from './Breadcrumb';

/**
 * Shell for plain content pages (FAQ, Shipping, Returns, Privacy, Terms, Track Order).
 * @param {string} title - page <h1> and breadcrumb label
 * @param {string} [eyebrow] - small label above the title
 * @param {string} [intro] - one-line summary under the title
 * @param {React.ReactNode} [notice] - highlighted note above the content (e.g. "placeholder text")
 */
const InfoPage = ({ title, eyebrow, intro, notice, children }) => (
  <div className="min-h-screen bg-background">
    <Breadcrumb items={[{ label: title }]} />

    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        {eyebrow && (
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-accent-text">
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-foreground/70">{intro}</p>}
      </div>
    </section>

    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
      {notice && (
        <div role="note" className="mb-10 rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
          {notice}
        </div>
      )}
      {children}
    </div>
  </div>
);

/** A titled block of body copy inside InfoPage. */
export const InfoSection = ({ title, children }) => (
  <section className="mb-10 last:mb-0">
    <h2 className="mb-3 text-2xl font-bold text-foreground">{title}</h2>
    <div className="space-y-3 leading-relaxed text-foreground/80">{children}</div>
  </section>
);

export default InfoPage;