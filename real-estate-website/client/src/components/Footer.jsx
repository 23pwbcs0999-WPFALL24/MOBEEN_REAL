function Footer() {
  return (
    <footer className="mt-12 border-t border-ink/10 bg-white/80">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/mobeen.jpg" alt="Mobeen logo" className="h-10 w-10 rounded-full object-cover" />
            <h4 className="text-xl font-semibold">MOBEEN</h4>
          </div>
          <p className="mt-2 text-sm text-slate">
            Real Estate Consultant for trusted property buying, selling, and investment guidance.
          </p>
        </div>
        <div>
          <h5 className="text-sm font-bold uppercase tracking-widest text-slate">Company</h5>
          <p className="mt-2 text-sm text-slate">About | Careers | Terms | Privacy</p>
        </div>
        <div>
          <h5 className="text-sm font-bold uppercase tracking-widest text-slate">Contact</h5>
          <p className="mt-2 text-sm text-slate">0329-5399439</p>
          <p className="text-sm text-slate">0345-9394111</p>
          <p className="mt-1 text-sm text-slate">Peshawar, Pakistan</p>
          <a
            href="https://www.facebook.com/p/Mobeen-Real-Estate-Consultant-100064058564598/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-ink hover:text-accent"
          >
            Facebook Page
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
