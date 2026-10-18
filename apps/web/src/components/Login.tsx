interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <main className="grid min-h-screen bg-[#f3f4ef] lg:grid-cols-2">
      <section className="flex min-h-[220px] flex-col justify-between bg-[#173c2e] px-7 py-7 text-white sm:px-12 sm:py-10 lg:min-h-screen lg:px-16 lg:py-12">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#d9e6d8] text-[#173c2e]">
            <span className="material-symbols-outlined">account_balance</span>
          </span>
          <span className="text-lg font-bold">AutoComm</span>
        </div>
        <div className="max-w-lg py-8 lg:py-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#b8cbbd]">Komisi & pembukuan</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Angka yang rapi.<br />Tim yang fokus.</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#d2dfd4]">Kelola transaksi dan perhitungan komisi dalam satu ruang kerja.</p>
        </div>
        <p className="hidden text-xs text-[#b8cbbd] lg:block">Ruang kerja internal · AutoComm</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#727c72]">Masuk ke akun</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#18231d]">Selamat datang kembali</h2>
          <p className="mt-2 text-sm text-[#536158]">Gunakan akun kerja Anda untuk melanjutkan.</p>

          <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#34443a]" htmlFor="email">Email kerja</label>
              <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm text-[#18231d] placeholder:text-[#89938a] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" id="email" placeholder="nama@perusahaan.co.id" type="email" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-[#34443a]" htmlFor="password">Kata sandi</label>
                <a className="text-xs font-medium text-[#176b52] hover:underline" href="#">Lupa kata sandi?</a>
              </div>
              <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm text-[#18231d] placeholder:text-[#89938a] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" id="password" placeholder="Masukkan kata sandi" type="password" />
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#176b52] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f]" type="submit">
              Masuk
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <p className="mt-8 border-t border-[#d0d6cc] pt-5 text-xs leading-5 text-[#727c72]">Akses hanya untuk anggota workspace. Hubungi administrator jika Anda belum memiliki akun.</p>
        </div>
      </section>
    </main>
  )
}