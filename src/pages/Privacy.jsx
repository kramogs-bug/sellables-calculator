import { ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';

const effectiveDate = 'July 13, 2026';

export default function Privacy() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E6F2DD] text-[#29453E]">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="border-b border-[#B1D3B9] pb-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[#659287] text-white"><ShieldCheck size={22} aria-hidden="true" /></span>
          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-[#659287]">Your data stays yours</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy policy</h1>
          <p className="mt-3 text-sm text-[#527A70]">Effective date: {effectiveDate}</p>
        </header>

        <div className="mt-8 space-y-5 text-sm leading-7 text-[#4F7168]">
          <section className="rounded-xl border border-[#B1D3B9] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#29453E]">Information we collect</h2>
            <p className="mt-2">Graal Sellables Tools does not require an account and does not collect, sell, share, or transmit personal information, calculator entries, tracker records, or uploaded sprite images to the developer or an external server.</p>
          </section>

          <section className="rounded-xl border border-[#B1D3B9] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#29453E]">Local device storage</h2>
            <p className="mt-2">The app uses browser local storage and Android app preferences to remember calculator quantities, ratios, tracker records, and floating-calculator settings. Head and body images are decoded and previewed locally in your browser or app and are not uploaded by this service.</p>
          </section>

          <section className="rounded-xl border border-[#B1D3B9] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#29453E]">Android overlay permission</h2>
            <p className="mt-2">The optional floating calculator requests permission to display a user-controlled calculator over other apps. It does not read, record, capture, or inspect the content of the app underneath it. The feature starts only after you enable it and can be stopped from the overlay, the app, or its notification.</p>
          </section>

          <section className="rounded-xl border border-[#B1D3B9] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Trash2 size={20} className="mt-1 shrink-0 text-[#659287]" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-bold text-[#29453E]">Delete your local data</h2>
                <p className="mt-2">Use the reset or clear controls available in the app. You can also clear the site data in your browser, or clear the Android app storage or uninstall the APK. Because no account or server record is created, there is no remote profile to delete.</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#B1D3B9] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#29453E]">External services and policy changes</h2>
            <p className="mt-2">Links to GitHub, Discord, email, or other websites open services with their own privacy policies. If this app later adds analytics, advertising, accounts, cloud storage, or another form of data collection, this policy and the store Data safety disclosure must be updated before that feature is released.</p>
          </section>

          <section className="rounded-xl bg-[#659287] p-5 text-white sm:p-6">
            <h2 className="text-lg font-bold">Contact</h2>
            <p className="mt-2 text-[#E6F2DD]">For privacy questions, contact the developer at vjohnmark673@gmail.com.</p>
            <a href="mailto:vjohnmark673@gmail.com" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-[#527A70] hover:bg-[#E6F2DD]">Email the developer <ExternalLink size={15} aria-hidden="true" /></a>
          </section>
        </div>
      </article>
    </main>
  );
}
