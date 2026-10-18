import { useState } from 'react';
import UserManagement from './UserManagement';

export default function Settings() {
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-5 pb-12 pt-24 sm:px-6 lg:px-8">
      <header className="mb-6 mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[#18231d]">
            {activeTab === 'profile' ? 'Profil dan akun' : 'Pengaturan ruang kerja'}
          </h1>
          <p className="text-sm text-[#536158]">
            {activeTab === 'profile' ? 'Kelola identitas dan keamanan akun Anda.' : 'Kelola konfigurasi ruang kerja dan akses tim.'}
          </p>
        </div>
      </header>
      
      <div className="mb-6 flex flex-wrap gap-x-4 border-b border-[#d0d6cc]">
        <button 
          className={`relative whitespace-nowrap px-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'profile' ? 'text-[#176b52]' : 'text-[#536158] hover:text-[#18231d]'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
          {activeTab === 'profile' && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#176b52]"></div>}
        </button>
        <button 
          className={`relative whitespace-nowrap px-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'team' ? 'text-[#176b52]' : 'text-[#536158] hover:text-[#18231d]'}`}
          onClick={() => setActiveTab('team')}
        >
          Tim dan akses
          {activeTab === 'team' && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#176b52]"></div>}
        </button>
        <button 
          className={`relative whitespace-nowrap px-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'commissions' ? 'text-[#176b52]' : 'text-[#536158] hover:text-[#18231d]'}`}
          onClick={() => setActiveTab('commissions')}
        >
          Aturan komisi
          {activeTab === 'commissions' && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#176b52]"></div>}
        </button>
        <button 
          className={`relative whitespace-nowrap px-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'integration' ? 'text-[#176b52]' : 'text-[#536158] hover:text-[#18231d]'}`}
          onClick={() => setActiveTab('integration')}
        >
          Integrasi
          {activeTab === 'integration' && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#176b52]"></div>}
        </button>
      </div>
      
      {activeTab === 'team' && (
        <UserManagement />
      )}

      {activeTab === 'profile' && (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Section 1: Profile & Account */}
        <section className="col-span-1 space-y-8 lg:col-span-8">
          <div className="border-y border-[#d0d6cc] bg-transparent p-5 sm:p-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                <div className="relative group">
                  <div className="h-16 w-16 cursor-pointer overflow-hidden rounded-sm border border-[#c8d0c7] transition-colors group-hover:border-[#176b52] sm:h-20 sm:w-20">
                    <img className="w-full h-full object-cover" data-alt="Portrait of professional user in deep blue suit, sharp lighting, editorial style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzBbgcP3A5bmPUXYdelN0JVFtE-L2xA8EeEAkf5D_CAeAPllEljJrvKymQN2EPR8OGREilpZQIqBK6jShLYElbY-9ArV3TBcQt0cSK45dxpyEXy3xSI74JxXrwCEQZq1HCyxIQbr0Naw7rG3ghyKMmmyI0TbtZoDNQH0wu38iaqUoazK8tUkSUYuQ7bmaHjl0UhqD4ePAI_HWw611QBbY8cSfC-s0Ayq8rSYHcXsAMZhaaihR3IJZ2zIJZ9nRW8Rp9pAivWv0MewuE"/>
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm bg-[#176b52] text-white transition-transform active:scale-90">
                    <span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#18231d]">Alex Strathmore</h3>
                  <p className="text-sm text-[#536158]">Kepala Operasional Pendapatan</p>
                </div>
              </div>
              <button className="rounded-sm border border-[#176b52] px-4 py-2 text-sm font-semibold text-[#176b52] transition-colors hover:bg-[#176b52] hover:text-white">Simpan perubahan</button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="space-y-1">
                <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Nama lengkap</label>
                <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" type="text" defaultValue="Alex Strathmore"/>
              </div>
              <div className="space-y-1">
                <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-[#536158]">Alamat email</label>
                <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm text-[#18231d] focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" type="email" defaultValue="alex@autocomm.ai"/>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-outline-variant/10">
              <h4 className="mb-6 text-sm font-semibold text-[#18231d]">Keamanan dan notifikasi</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined" data-icon="lock">lock</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#18231d]">Autentikasi dua faktor</p>
                      <p className="text-xs text-[#536158]">Lindungi akun dengan verifikasi biometrik</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-secondary/40 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-on-surface rounded-full shadow-md"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" data-icon="mail">mail</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#18231d]">Ringkasan komisi harian</p>
                      <p className="text-xs text-[#536158]">Terima rekap otomatis setiap 24 jam</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-on-surface rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 2: User Management (Floating Action Card) */}
        <section className="col-span-1 space-y-6 lg:col-span-4">
          <div className="border-y border-[#d0d6cc] bg-transparent py-5 lg:px-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#18231d]">Tambah pengguna</h3>
              <span className="material-symbols-outlined text-tertiary" data-icon="person_add">person_add</span>
            </div>
            <div className="space-y-4">
              <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" placeholder="Nama lengkap" type="text"/>
              <input className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" placeholder="Email kerja" type="email"/>
              <select className="w-full rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 text-sm focus:border-[#176b52] focus:outline-none focus:ring-1 focus:ring-[#176b52]" defaultValue="Sales Executive">
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Sales Executive">Sales Executive</option>
              </select>
              <button className="w-full rounded-sm bg-[#176b52] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f513f]">Kirim undangan</button>
            </div>
          </div>
          
          <div className="space-y-4 border-y border-[#d0d6cc] py-5 lg:px-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#536158]">Tim saat ini</p>
              <span className="text-xs font-bold text-tertiary">42 / 50</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-surface-container rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold">JD</div>
                  <div>
                    <p className="text-xs font-bold">Jane Doe</p>
                    <p className="text-[10px] text-on-surface-variant">Manager</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer" data-icon="more_vert">more_vert</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-surface-container rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">MS</div>
                  <div>
                    <p className="text-xs font-bold">Marcus Smith</p>
                    <p className="text-[10px] text-on-surface-variant">Sales</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer" data-icon="more_vert">more_vert</span>
              </div>
            </div>
          </div>
        </section>
        
      </div>
      )}

      {activeTab === 'commissions' && (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Section 3: Commission Setup (Bento Style) */}
        <section className="col-span-1 grid grid-cols-1 gap-8 lg:col-span-12 lg:grid-cols-12">
          <div className="col-span-1 flex flex-col justify-between border-y border-[#d0d6cc] bg-transparent p-5 lg:col-span-4 sm:p-6">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined" data-icon="percent">percent</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">Flat Commission</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">The baseline revenue percentage applied to all standard workspace transactions.</p>
            </div>
            <div className="relative">
              <input className="w-full text-4xl font-headline font-black bg-transparent border-none text-on-surface focus:ring-0 focus:outline-none p-0 tabular-nums" type="text" defaultValue="5.25"/>
              <span className="absolute right-0 bottom-1 text-2xl font-bold text-primary">%</span>
              <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent mt-2 rounded-full"></div>
            </div>
          </div>
          
          <div className="col-span-1 border-y border-[#d0d6cc] bg-transparent p-5 lg:col-span-8 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-headline font-bold">Tiered Logic Tables</h3>
              <button className="flex items-center gap-2 text-xs font-bold text-secondary">
                <span className="material-symbols-outlined text-sm" data-icon="add_circle">add_circle</span>
                Add Tier
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-lowest text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Sales Threshold</th>
                    <th className="px-4 py-3">Bonus Multiplier</th>
                    <th className="px-4 py-3">Retention Rule</th>
                    <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-body">
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-4 py-5 tabular-nums text-on-surface font-medium">&gt; $5,000,000</td>
                    <td className="px-4 py-5 tabular-nums text-tertiary">+1.5%</td>
                    <td className="px-4 py-5 text-on-surface-variant italic">90 Day Lock</td>
                    <td className="px-4 py-5 text-right"><span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-error" data-icon="delete">delete</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="px-4 py-5 tabular-nums text-on-surface font-medium">&gt; $10,000,000</td>
                    <td className="px-4 py-5 tabular-nums text-tertiary">+2.75%</td>
                    <td className="px-4 py-5 text-on-surface-variant italic">Immediate</td>
                    <td className="px-4 py-5 text-right"><span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-error" data-icon="delete">delete</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
      </div>
      )}

      {activeTab === 'integration' && (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Section 4 & 5: Data & Reports */}
        <section className="col-span-1 border-y border-[#d0d6cc] bg-transparent p-5 lg:col-span-7 sm:p-6">
          <div className="flex items-center gap-4 mb-8">
            <span className="material-symbols-outlined text-secondary" data-icon="cloud_upload">cloud_upload</span>
            <h3 className="text-xl font-headline font-bold">AI-Assisted Data Mapping</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-secondary transition-all">
              <span className="material-symbols-outlined text-secondary text-3xl" data-icon="download">download</span>
              <span className="text-xs font-bold">Download Template</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex flex-col items-center justify-center space-y-2 cursor-pointer group">
              <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform" data-icon="upload_file">upload_file</span>
              <span className="text-xs font-bold text-secondary">Upload CSV for Mapping</span>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">Current AI Mapping Logic</p>
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary">
              <div className="flex items-center gap-8">
                <span className="bg-surface-container px-3 py-1 rounded-lg text-xs font-mono">Tgl_Trx</span>
                <span className="material-symbols-outlined text-secondary-dim" data-icon="arrow_forward">arrow_forward</span>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-lg text-xs font-bold">Transaction Date</span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold">98% Match</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border-l-4 border-tertiary">
              <div className="flex items-center gap-8">
                <span className="bg-surface-container px-3 py-1 rounded-lg text-xs font-mono">Amt_Gross</span>
                <span className="material-symbols-outlined text-tertiary" data-icon="arrow_forward">arrow_forward</span>
                <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-lg text-xs font-bold">Gross Revenue</span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold">Auto-Mapped</span>
            </div>
          </div>
        </section>
        
        <section className="col-span-1 space-y-6 lg:col-span-5">
          <div className="border-y border-[#d0d6cc] bg-transparent p-5 sm:p-6">
            <h3 className="text-xl font-headline font-bold mb-6">Automated Reports</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary tracking-widest uppercase">Report Frequency</label>
                <select className="w-full bg-surface-container-high border-none rounded-xl py-4 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface" defaultValue="Weekly Performance">
                  <option value="Daily Audit">Daily Audit</option>
                  <option value="Weekly Performance">Weekly Performance</option>
                  <option value="Monthly Board Deck">Monthly Board Deck</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-primary tracking-widest uppercase">Recipients</label>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    Executives <span className="material-symbols-outlined text-[10px] cursor-pointer" data-icon="close">close</span>
                  </span>
                  <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    Finance Team <span className="material-symbols-outlined text-[10px] cursor-pointer" data-icon="close">close</span>
                  </span>
                  <button className="bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-bold border border-outline-variant/30 hover:border-primary transition-colors">
                    + Add Recipient
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 6: AI Integration */}
          <div className="border-y border-[#d0d6cc] bg-[#e9ece5] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-base font-semibold text-[#18231d]">Integrasi asisten</h3>
              <div className="h-2 w-2 rounded-full bg-[#39835f]"></div>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#536158]">Endpoint integrasi</label>
                <div className="flex gap-2">
                  <input className="min-w-0 flex-1 rounded-sm border border-[#c8d0c7] bg-white px-3 py-3 font-mono text-sm text-[#536158] focus:outline-none" type="password" defaultValue="••••••••••••••••"/>
                  <button className="h-11 w-11 bg-surface-container-high rounded-xl flex items-center justify-center text-on-surface-variant border border-outline-variant/20"><span className="material-symbols-outlined" data-icon="visibility">visibility</span></button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#536158]">Kepekaan deteksi anomali</label>
                  <span className="text-xs font-black text-tertiary tabular-nums">0.84</span>
                </div>
                <div className="relative h-2 w-full bg-surface-container rounded-full">
                  <div className="absolute h-full w-[84%] bg-gradient-to-r from-tertiary-dim to-tertiary rounded-full shadow-[0_0_15px_#81ecff50]"></div>
                  <div className="absolute h-5 w-5 bg-on-surface rounded-full shadow-xl border-4 border-tertiary -top-1.5 left-[84%] -translate-x-1/2 cursor-pointer active:scale-125 transition-transform"></div>
                </div>
                <p className="text-xs leading-snug text-[#536158]">Kepekaan lebih tinggi akan menandai lebih banyak penyimpangan komisi bertingkat.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      )}
      
      {/* Floating Action for Success Feedback */}
      {showNotification && (
        <div className="fixed bottom-4 left-4 right-4 z-30 flex items-center gap-3 border border-[#d0d6cc] bg-[#fbfcf8] px-4 py-3 shadow-lg sm:left-auto sm:right-8 sm:w-auto">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#d9e6d8] text-[#176b52]">
            <span className="material-symbols-outlined" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#18231d]">Pengaturan tersinkron</p>
            <p className="text-xs text-[#536158]">Konfigurasi ruang kerja telah diperbarui.</p>
          </div>
          <button className="ml-4 text-on-surface-variant hover:text-on-surface" onClick={() => setShowNotification(false)}>
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
