export default function FormationDetailLoading() {
  return (
    <main className="animate-pulse bg-white">
      <section className="bg-secondary/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="mt-5 h-10 max-w-3xl rounded bg-muted" />
          <div className="mt-3 h-6 max-w-2xl rounded bg-muted" />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="h-12 rounded bg-muted" />
            <div className="h-12 rounded bg-muted" />
            <div className="h-12 rounded bg-muted" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="mt-4 h-20 max-w-4xl rounded bg-muted" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="h-12 rounded bg-muted" />
          <div className="h-12 rounded bg-muted" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 lg:px-8">
        <div className="h-8 w-72 rounded bg-muted" />
        <div className="mt-5 h-64 rounded-2xl bg-muted" />
      </section>
    </main>
  );
}
