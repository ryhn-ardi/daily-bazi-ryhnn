'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDayPillar, STEMS, BRANCHES, STEM_META, BRANCH_META } from '@/lib/bazi'
import type { UserProfile } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [today, setToday] = useState({ si: 0, bi: 0 })
  const [showReading, setShowReading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('bazi_user')
    if (!raw) { router.push('/'); return }
    const u = JSON.parse(raw) as UserProfile
    setUser(u)
    setToday(getDayPillar(new Date()))
  }, [router])

  if (!user) return <LoadingScreen />

  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).toUpperCase()

  const stemMeta   = STEM_META[today.si]
  const branchMeta = BRANCH_META[today.bi]
  const pillarKey  = STEMS[today.si] + BRANCHES[today.bi]

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        padding: '52px 20px 28px', textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg,rgba(200,149,58,.05),transparent)'
      }}>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'.3em', color:'var(--gl)', textTransform:'uppercase', marginBottom:8 }}>
          {dateStr}
        </div>
        <div style={{ fontSize: 24 }}>
          Selamat datang, <span style={{ color:'var(--gold)' }}>{user.name}</span>
        </div>
        <div style={{ marginTop: 7, fontSize: 13, color: 'var(--dim)', fontStyle: 'italic' }}>
          {user.day_master || '甲 Yang Wood'} · Day Master · Kua {user.kua_number || 1}
        </div>
        <button
          onClick={() => { localStorage.removeItem('bazi_user'); router.push('/') }}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'var(--s2)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '6px 14px', fontSize: 11,
            color: 'var(--dim)', cursor: 'pointer', fontFamily: 'Cinzel,serif',
            letterSpacing: '.1em'
          }}
        >
          Keluar
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>

        {/* Mandala */}
        <div style={{ width: 160, height: 160, marginBottom: 28 }}>
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8c060"/>
                <stop offset="50%" stopColor="#c8953a"/>
                <stop offset="100%" stopColor="#6a4010"/>
              </linearGradient>
            </defs>
            <g className="ring-a">
              <circle cx="80" cy="80" r="76" fill="none" stroke="url(#gg)" strokeWidth=".8" strokeDasharray="4 12" opacity=".4"/>
              <line x1="80" y1="4"   x2="80"  y2="14"  stroke="#c8953a" strokeWidth="1.5" opacity=".5"/>
              <line x1="156" y1="80" x2="146" y2="80"  stroke="#c8953a" strokeWidth="1.5" opacity=".5"/>
              <line x1="80" y1="156" x2="80"  y2="146" stroke="#c8953a" strokeWidth="1.5" opacity=".5"/>
              <line x1="4"  y1="80"  x2="14"  y2="80"  stroke="#c8953a" strokeWidth="1.5" opacity=".5"/>
              <line x1="130" y1="22" x2="123" y2="29" stroke="#c8953a" strokeWidth="1" opacity=".3"/>
              <line x1="138" y1="130" x2="131" y2="123" stroke="#c8953a" strokeWidth="1" opacity=".3"/>
              <line x1="30"  y1="138" x2="37" y2="131" stroke="#c8953a" strokeWidth="1" opacity=".3"/>
              <line x1="22"  y1="30"  x2="29" y2="37"  stroke="#c8953a" strokeWidth="1" opacity=".3"/>
            </g>
            <g className="ring-b">
              <circle cx="80" cy="80" r="55" fill="none" stroke="#c8953a" strokeWidth=".5" strokeDasharray="2 8" opacity=".22"/>
            </g>
            <circle cx="80" cy="80" r="38" fill="#0a0a18" stroke="#1c1c38" strokeWidth=".5"/>
            <text x="80" y="104" textAnchor="middle" fontSize="52" fill="url(#gg)" fontFamily="serif" opacity=".9">命</text>
          </svg>
        </div>

        {/* Read button */}
        <button
          onClick={() => setShowReading(true)}
          style={{
            width: '100%', maxWidth: 300,
            background: 'var(--surface)', border: '1px solid var(--gl)',
            borderRadius: 22, cursor: 'pointer', overflow: 'hidden',
            transition: 'all .3s', fontFamily: 'inherit',
          }}
        >
          <div style={{ padding: '22px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 30, marginBottom: 9 }}>🔮</div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:16, letterSpacing:'.1em', color:'var(--gold)', display:'block' }}>
              BACA BAZI HARI INI
            </div>
            <div style={{ fontSize:13, color:'var(--dim)', marginTop:4 }}>
              {STEMS[today.si]}{BRANCHES[today.bi]} · {stemMeta[1]} / {branchMeta[2]}
            </div>
          </div>
          <div style={{
            borderTop: '1px solid var(--border)', padding: '9px 18px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize:11, color:'var(--dim)' }}>Kode aksesmu:</span>
            <strong style={{ fontSize:12, color:'var(--gold)', fontFamily:'Cinzel,serif', letterSpacing:'.08em' }}>
              {user.access_code}
            </strong>
          </div>
        </button>

        <div style={{ marginTop:14, fontSize:12, color:'var(--dim)', fontStyle:'italic' }}>
          Data tersimpan permanen · Tidak butuh internet
        </div>
      </div>

      {/* Reading modal */}
      {showReading && (
        <ReadingModal
          user={user}
          si={today.si}
          bi={today.bi}
          onClose={() => setShowReading(false)}
        />
      )}
    </main>
  )
}

// ── Reading Modal ──────────────────────────────────
function ReadingModal({ user, si, bi, onClose }: {
  user: UserProfile; si: number; bi: number; onClose: () => void
}) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const stemMeta   = STEM_META[si]
  const branchMeta = BRANCH_META[bi]

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg)',
      overflowY: 'auto', zIndex: 100,
      animation: 'fadeUp .4s ease forwards'
    }}>
      {/* Top bar */}
      <div style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--border)', background: 'var(--surface)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button onClick={onClose} style={{
          width:36, height:36, borderRadius:'50%',
          background:'var(--s2)', border:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', fontSize:20, color:'var(--dim)', flexShrink:0
        }}>←</button>
        <div>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:14, color:'var(--gold)' }}>Bacaan Hari Ini</div>
          <div style={{ fontSize:12, color:'var(--dim)' }}>{dateStr}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:16, display:'flex', flexDirection:'column', gap:14, paddingBottom:48 }}>

        {/* Pillar hero */}
        <PillarHero si={si} bi={bi} stemMeta={stemMeta} branchMeta={branchMeta} user={user} />

        {/* Score */}
        <ScoreCard si={si} bi={bi} />

        {/* Sections */}
        <SectionCard ico="💼" title="Karir & Pekerjaan"   si={si} section="career" />
        <SectionCard ico="🌿" title="Kesehatan & Energi"  si={si} section="health" />
        <SectionCard ico="💰" title="Finansial & Rezeki"  si={si} section="finance" />
        <SectionCard ico="❤️" title="Relasi & Asmara"    si={si} section="romance" />

        {/* Chart reference */}
        <ChartRef user={user} />
      </div>
    </div>
  )
}

function PillarHero({ si, bi, stemMeta, branchMeta, user }: {
  si:number; bi:number;
  stemMeta: (string|boolean)[];
  branchMeta: string[];
  user: UserProfile;
}) {
  const elClass = (el: string) => ({
    Kayu:'#5ac85a',Api:'#e06040',Tanah:'#c89040',Logam:'#b0b0cc',Air:'#4898e0'
  }[el] || '#c89040')

  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--b2)',
      borderRadius:22, padding:'26px 16px', textAlign:'center',
      position:'relative', overflow:'hidden', animation:'fadeUp .5s ease forwards'
    }}>
      <div style={{ fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'.28em', color:'var(--dim)', textTransform:'uppercase', marginBottom:14 }}>
        ✦ &nbsp; PILAR HARI INI &nbsp; ✦
      </div>
      <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-end', gap:18, marginBottom:10 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:68, lineHeight:1, background:`linear-gradient(180deg,#e8c060,#c8953a,#5a3808)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {STEMS[si]}
          </div>
          <div style={{ fontSize:11, color:'var(--dim)', marginTop:4 }}>{stemMeta[0] as string} · {stemMeta[1] as string}</div>
        </div>
        <div style={{ fontSize:36, color:'var(--b2)', paddingBottom:14 }}>·</div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:68, lineHeight:1, background:`linear-gradient(180deg,#e8c060,#c8953a,#5a3808)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {BRANCHES[bi]}
          </div>
          <div style={{ fontSize:11, color:'var(--dim)', marginTop:4 }}>{branchMeta[0]} · {branchMeta[1]}</div>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:8 }}>
        {[stemMeta[1] as string, branchMeta[2]].map((el, i) => (
          <span key={i} style={{
            padding:'4px 16px', borderRadius:20, fontSize:12,
            color: elClass(el), border:`1px solid ${elClass(el)}40`,
            background: `${elClass(el)}18`
          }}>{el}</span>
        ))}
      </div>
    </div>
  )
}

function ScoreCard({ si, bi }: { si: number; bi: number }) {
  const BASE_SCORES = [4,3,8,9,8,7,5,6,4,5]
  const BRANCH_MODS = [-1.5,0.5,0,1,-0.5,0.5,2,0.5,-0.5,-1,0.5,0]
  const score = Math.min(10, Math.max(1, Math.round(BASE_SCORES[si] + BRANCH_MODS[bi])))
  const labels = ['','','🌑 Hari penuh tantangan','🌧️ Perlu kehati-hatian','⚖️ Cukup seimbang','⚖️ Cukup seimbang','⚖️ Cukup seimbang','🌟 Energi menguntungkan','🌟 Energi menguntungkan','✨ Hari luar biasa!','✨ Hari luar biasa!']

  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--b2)',
      borderRadius:18, padding:18, display:'flex', alignItems:'center', gap:16,
      animation:'fadeUp .55s ease forwards'
    }}>
      <div style={{ fontFamily:'Cinzel Decorative,serif', fontSize:50, color:'var(--gold)', lineHeight:1, flexShrink:0 }}>
        {score}<sub style={{ fontSize:16, color:'var(--dim)' }}>/10</sub>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'.2em', color:'var(--dim)', textTransform:'uppercase', marginBottom:7 }}>
          Skor Keberuntungan
        </div>
        <div style={{ background:'var(--s2)', borderRadius:4, height:6, overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:4, width:`${score/10*100}%`,
            background:'linear-gradient(90deg,var(--gl),var(--gold))',
            transition:'width 1.4s cubic-bezier(.22,1,.36,1)'
          }}/>
        </div>
        <div style={{ fontSize:12, color:'var(--dim)', marginTop:6 }}>{labels[score]}</div>
      </div>
    </div>
  )
}

function SectionCard({ ico, title, si, section }: {
  ico: string; title: string; si: number; section: 'career'|'health'|'finance'|'romance'
}) {
  const [open, setOpen] = useState(false)

  // Simple generic readings based on stem element
  const stemEl = STEM_META[si][1] as string
  const readings: Record<string, Record<string, string>> = {
    career: {
      Kayu:'Energi Kayu mendominasi hari ini — cocok untuk pekerjaan yang membutuhkan pertumbuhan dan inisiatif. Fokus pada eksekusi yang sudah direncanakan.',
      Api:'Energi Api menyala hari ini — presentasi, komunikasi, dan ekspresi diri berada di puncak. Manfaatkan momentum ini untuk menyampaikan ide.',
      Tanah:'Energi Tanah memberikan stabilitas — hari terbaik untuk pekerjaan terstruktur, administrasi, dan networking yang menghasilkan koneksi nyata.',
      Logam:'Energi Logam memberikan ketepatan — urusan formal, kontrak, dan pekerjaan yang membutuhkan presisi berjalan sangat baik.',
      Air:'Energi Air mendukung refleksi — hari terbaik untuk riset, perencanaan strategis, dan pekerjaan yang membutuhkan pemikiran mendalam.',
    },
    health: {
      Kayu:'Hati dan Empedu aktif hari ini. Jaga pola makan, hindari stres berlebih. Olahraga ringan sangat dianjurkan.',
      Api:'Jantung dan sirkulasi darah dalam kondisi prima. Hari terbaik untuk olahraga intens. Pastikan tetap terhidrasi.',
      Tanah:'Lambung dan sistem pencernaan optimal. Makan teratur dan bergizi. Hindari makan berlebihan.',
      Logam:'Paru-paru dan sistem pernapasan perlu perhatian. Olahraga aerobik ringan dan udara segar sangat bermanfaat.',
      Air:'Ginjal dan sistem saraf aktif. Istirahat cukup dan hindari overthinking. Tidur lebih awal dari biasanya.',
    },
    finance: {
      Kayu:'Bukan hari terbaik untuk transaksi besar. Fokus pada review keuangan dan evaluasi portofolio.',
      Api:'Hari baik untuk negosiasi dan presentasi nilai diri. Peluang pendapatan dari kreativitas bisa muncul.',
      Tanah:'Hari terbaik untuk deal bisnis dan networking finansial. Peluang dari koneksi sangat terbuka.',
      Logam:'Cocok untuk urusan finansial formal — kontrak, pengajuan kredit, atau investasi terstruktur.',
      Air:'Hari untuk belajar dan merencanakan, bukan eksekusi. Riset instrumen investasi yang tepat.',
    },
    romance: {
      Kayu:'Energi kompetitif bisa memunculkan gesekan — jaga komunikasi tetap terbuka dan tidak defensif.',
      Api:'Pesonamu alami dan hangat hari ini. Hari terbaik untuk mengungkapkan perasaan atau memperdalam koneksi.',
      Tanah:'Magnetisme sosialmu tinggi. Pertemuan tak terduga yang bermakna bisa terjadi hari ini.',
      Logam:'Stabilitas dan komitmen terasa kuat. Hari baik untuk membicarakan hal-hal serius dalam hubungan.',
      Air:'Energi introvert dan reflektif. Percakapan yang mendalam satu lawan satu lebih memuaskan dari keramaian.',
    }
  }

  const text = readings[section][stemEl] || 'Bacaan sedang dipersiapkan.'

  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:15, overflow:'hidden', animation:'fadeUp .6s ease forwards'
    }}>
      <div style={{
        padding:'12px 16px', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:9
      }}>
        <span style={{ fontSize:16 }}>{ico}</span>
        <span style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:'.16em', color:'var(--gold)', textTransform:'uppercase', flex:1 }}>
          {title}
        </span>
      </div>
      <div style={{ padding:16 }}>
        <p style={{ fontSize:15, lineHeight:1.8, color:'var(--text)', marginBottom: open ? 0 : 0 }}>{text}</p>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width:'100%', background: open ? 'linear-gradient(135deg,rgba(200,149,58,.10),rgba(40,160,154,.05))' : 'var(--s2)',
            border:`1px solid ${open ? 'var(--gl)' : 'var(--border)'}`,
            borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:10,
            padding:'14px 16px', marginTop:14, transition:'all .2s', fontFamily:'inherit'
          }}
        >
          <span style={{ fontSize:18, transition:'transform .3s', transform: open ? 'rotate(15deg) scale(1.1)' : 'none' }}>
            {ico}
          </span>
          <span style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:'.18em', color:'var(--gold)', textTransform:'uppercase', flex:1, textAlign:'left' }}>
            Rincian Detail
          </span>
          <span style={{ fontSize:11, color: open ? 'transparent' : 'var(--dim)', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'2px 10px', transition:'opacity .2s' }}>
            4 poin
          </span>
          <span style={{ fontSize:14, color: open ? 'var(--gold)' : 'var(--dim)', transition:'transform .32s cubic-bezier(.34,1.56,.64,1)', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
        </button>
        {open && (
          <div style={{ marginTop:12, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <SimpleCell ico="📌" lbl="Fokus Utama"   txt="Lihat bacaan di atas untuk panduan utama hari ini." accent="gold" />
            <SimpleCell ico="✅" lbl="Aksi Terbaik"  txt="Satu langkah konkret yang bisa kamu lakukan hari ini." accent="teal" />
            <SimpleCell ico="⚠️" lbl="Waspada"       txt="Perhatikan energi yang bisa menghambat hari ini."   accent="red"  />
            <SimpleCell ico="💡" lbl="Insight"        txt="Refleksikan bagaimana energi ini terasa dalam hidupmu." accent="dim" />
          </div>
        )}
      </div>
    </div>
  )
}

function SimpleCell({ ico, lbl, txt, accent }: { ico:string; lbl:string; txt:string; accent:string }) {
  const colors: Record<string, string> = { gold:'var(--gl)', teal:'var(--teal)', red:'var(--red)', dim:'var(--dim)' }
  return (
    <div style={{
      background:'var(--s2)', border:`1px solid var(--border)`,
      borderTop: `2px solid ${colors[accent]}`,
      borderRadius:12, padding:'12px 11px'
    }}>
      <div style={{ fontSize:18, marginBottom:5 }}>{ico}</div>
      <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'.18em', color:colors[accent], textTransform:'uppercase', marginBottom:5 }}>{lbl}</div>
      <div style={{ fontSize:13, lineHeight:1.65, color:'var(--dim)' }}>{txt}</div>
    </div>
  )
}

function ChartRef({ user }: { user: UserProfile }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:15, overflow:'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width:'100%', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, padding:'14px 16px', fontFamily:'inherit' }}
      >
        <span style={{ fontSize:15 }}>🏛️</span>
        <span style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:'.16em', color:'var(--gold)', textTransform:'uppercase', flex:1, textAlign:'left' }}>
          Chart Kelahiran · Referensi
        </span>
        <span style={{ fontSize:13, color: open ? 'var(--gold)' : 'var(--dim)', transition:'transform .25s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && (
        <div style={{ padding:'0 16px 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:10 }}>
            {[
              { lbl:'JAM',   s: user.hour_pillar?.[0]  || '乙', b: user.hour_pillar?.[1]  || '亥', n:'Jam' },
              { lbl:'HARI ✦',s: user.day_pillar?.[0]   || '甲', b: user.day_pillar?.[1]   || '午', n:'Hari' },
              { lbl:'BULAN', s: user.month_pillar?.[0] || '甲', b: user.month_pillar?.[1] || '戌', n:'Bulan' },
              { lbl:'TAHUN', s: user.year_pillar?.[0]  || '己', b: user.year_pillar?.[1]  || '卯', n:'Tahun' },
            ].map((p, i) => (
              <div key={i} style={{ textAlign:'center', background:'var(--s2)', border:`1px solid ${i===1?'#c8953a50':'var(--border)'}`, borderRadius:9, padding:'9px 4px' }}>
                <div style={{ fontSize:8, color:'var(--dim)', marginBottom:4 }}>{p.lbl}</div>
                <div style={{ fontSize:20, color: i===1 ? 'var(--gh)' : 'var(--gold)', lineHeight:1 }}>{p.s}</div>
                <div style={{ fontSize:20, color:'var(--dim)', lineHeight:1, marginTop:2 }}>{p.b}</div>
                <div style={{ fontSize:8, color:'var(--dim)', marginTop:3 }}>{p.n}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:13, color:'var(--dim)', lineHeight:1.65, fontStyle:'italic' }}>
            {user.day_master || 'Day Master'} · {user.birth_date} · Kua {user.kua_number || '—'}<br/>
            Lucky: {user.lucky_elements || '—'} · Dominan: {user.dominant_element || '—'}
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight:'100svh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18 }}>
      <div style={{ width:50, height:50, borderRadius:'50%', border:'2px solid var(--b2)', borderTopColor:'var(--gold)', animation:'spin 1s linear infinite' }}/>
      <div style={{ fontFamily:'Cinzel,serif', fontSize:11, letterSpacing:'.25em', color:'var(--gold)' }}>MEMUAT</div>
    </div>
  )
}
