interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div className="flex-grow flex items-center justify-center relative px-6 node-bg min-h-screen">
      {/* TopNavBar (Shared Component for Login) */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-[#091328] font-headline tabular-nums">
        <div className="text-2xl font-bold tracking-tight text-[#9ba8ff]">AutoComm</div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[#40485d] text-sm font-medium tracking-wide uppercase">Institutional Grade Security</span>
        </div>
      </nav>

      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20" style={{ background: 'radial-gradient(circle at center, transparent 0%, #060e20 70%)' }}></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md z-10">
        <div className="glass-panel ethereal-glow rounded-xl p-10 flex flex-col items-center">
          {/* Brand Anchor */}
          <div className="mb-8 text-center">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant text-sm font-medium tracking-wide font-body">Institutional Grade Intelligence</p>
          </div>

          {/* Form */}
          <form className="w-full space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            {/* Email Field */}
            <div className="space-y-2 group">
              <label className="block text-sm uppercase tracking-widest text-outline ml-1 font-label" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-tertiary transition-colors duration-300" style={{ fontSize: '1.25rem' }}>mail</span>
                <input className="w-full bg-surface-variant border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-tertiary transition-all duration-300 outline-none body-md relative z-10" id="email" placeholder="name@institution.com" type="email" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm uppercase tracking-widest text-outline font-label" htmlFor="password">Password</label>
                <a className="text-[10px] text-primary hover:text-tertiary transition-colors duration-200 uppercase tracking-tighter" href="#">Forgot Access?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-tertiary transition-colors duration-300" style={{ fontSize: '1.25rem' }}>lock</span>
                <input className="w-full bg-surface-variant border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-tertiary transition-all duration-300 outline-none body-md relative z-10" id="password" placeholder="••••••••" type="password" />
              </div>
            </div>

            {/* CTA */}
            <button className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed font-headline font-bold text-lg rounded-lg hover:shadow-[0_0_20px_rgba(155,168,255,0.4)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 relative z-10" type="submit">
              Sign In
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_forward</span>
            </button>
          </form>

          {/* Alternative Methods */}
          <div className="mt-10 w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              <span className="text-sm uppercase tracking-widest text-outline">Verification</span>
              <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
            </div>
            <button type="button" className="w-full py-3 bg-surface-container rounded-lg flex items-center justify-center gap-3 text-on-surface hover:bg-surface-container-high transition-colors duration-200 group relative z-10">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
              <span className="text-sm font-semibold">SSO Authentication</span>
            </button>
          </div>
        </div>

        {/* Support/Create */}
        <p className="mt-8 text-center text-on-surface-variant text-sm">
          Don't have access? <a className="text-primary font-bold hover:underline transition-all relative z-10" href="#">Request Credentials</a>
        </p>
      </div>

      {/* Footer (Shared Component) */}
      <footer className="fixed bottom-0 w-full flex justify-between px-12 py-8 bg-transparent font-body text-sm uppercase tracking-widest">
        <div className="text-[#40485d]">© 2024 AutoComm AI. All rights reserved.</div>
        <div className="flex gap-8">
          <a className="text-[#40485d] hover:text-[#9ba8ff] transition-opacity" href="#">Privacy Policy</a>
          <a className="text-[#40485d] hover:text-[#9ba8ff] transition-opacity" href="#">Terms of Service</a>
          <a className="text-[#40485d] hover:text-[#9ba8ff] transition-opacity" href="#">Security Architecture</a>
        </div>
      </footer>

      {/* Abstract Flux Decorative Images */}
      <div className="fixed top-1/4 right-0 opacity-10 blur-xl pointer-events-none">
        <img alt="Aether currents" className="w-96" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6bgpepuEhwhdwS2GjpX-PYr8CKoB_7ujvUEclHfg-qlCuo-8VlSUHcWsVQSk93q2NAo0jqOOzG_WXMuBGvoku6NziRg4Jl2ZL9DtYC5BaVpg0U2jZZ5kiA3RDGrxvusq7uJAIywoM7tynHkLs_QZyQY9nEdZR0Z_cnrJbB1icFzuOmlDZHOWJjV3YNIr--N2BiYvjMxlShc9HiD84u9f5hRXeKQVM7ruEt7-hfxweAbLBluilSWIUtyKa_s1FsIowP0xM8Mu90h4i" />
      </div>
    </div>
  )
}
