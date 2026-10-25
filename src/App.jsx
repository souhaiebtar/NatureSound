import { useEffect, useRef, useState } from 'react'
import {
  AudioLines, Bird, Bookmark, Check, ChevronRight, Cloud, CloudDownload,
  CloudLightning, CloudRain, Download, ExternalLink, Flame, Flower2, Footprints,
  Headphones, Heart, Home, Leaf, Library, Menu, Moon, MoreHorizontal, Mountain,
  Music2, Pause, Play, Plus, Search, Settings2, Share2, Sparkles, Square, Timer,
  Trash2, Trees, User, Volume2, Waves, Wind, X
} from 'lucide-react'

const SOUNDS = [
  { id: 'rain', name: 'Soft rain', category: 'Water', icon: CloudRain, color: '#dce9ed', ink: '#4b7180', variations: ['Dense', 'Porch', 'Dripping', 'Shack', 'Gutter'] },
  { id: 'thunder', name: 'Thunder', category: 'Weather', icon: CloudLightning, color: '#e5e2ec', ink: '#746985', variations: [] },
  { id: 'forest', name: 'Forest', category: 'Nature', icon: Trees, color: '#e0e9da', ink: '#58744e', variations: ['Evening', 'Eerie'] },
  { id: 'waves', name: 'Ocean waves', category: 'Water', icon: Waves, color: '#dce9e7', ink: '#467b77', variations: ['Beach', 'Slow'] },
  { id: 'fire', name: 'Crackling fire', category: 'Ambience', icon: Flame, color: '#f2e5d7', ink: '#a16d45', variations: ['Calm', 'Crackling'] },
  { id: 'bird', name: 'Songbirds', category: 'Nature', icon: Bird, color: '#eee8d8', ink: '#8c7a46', variations: ['Blackbird', 'Nightingale', 'Crow'] },
  { id: 'wind', name: 'Wind', category: 'Weather', icon: Wind, color: '#e4e9ed', ink: '#667d8a', variations: ['Steady', 'Howling'] },
  { id: 'river', name: 'River stream', category: 'Water', icon: AudioLines, color: '#dfe9ed', ink: '#517a8b', variations: ['Calm', 'Strong'] },
  { id: 'night', name: 'Night sounds', category: 'Nature', icon: Moon, color: '#e4e3ee', ink: '#6c6b8d', variations: ['Meadow', 'Suburban'] },
  { id: 'frog', name: 'Frogs', category: 'Nature', icon: Flower2, color: '#e1eadb', ink: '#667c4c', variations: ['Cricket', 'Chorus', 'Natterjack', 'Wood'] },
  { id: 'leaves', name: 'Rustling leaves', category: 'Nature', icon: Leaf, color: '#e7ead9', ink: '#788450', variations: [] },
  { id: 'footsteps', name: 'Footsteps', category: 'Ambience', icon: Footprints, color: '#eee5df', ink: '#8a6d5b', variations: ['Gravel', 'Snow', 'Pavement'] },
  { id: 'train', name: 'Train ride', category: 'Ambience', icon: Library, color: '#e8e3df', ink: '#7a6c64', variations: ['Slow', 'Fast'] },
  { id: 'restaurant', name: 'Café murmur', category: 'Ambience', icon: Cloud, color: '#eee5dc', ink: '#8b735d', variations: ['English', 'French', 'German', 'Pub'] },
  { id: 'noise', name: 'White noise', category: 'Ambience', icon: AudioLines, color: '#e5e5e3', ink: '#777873', variations: ['White', 'Pink', 'Brown'] },
]

const PRESETS = [
  { name: 'Rainy day in the forest', subtitle: 'Rain · Forest · Thunder', sounds: ['rain', 'forest', 'thunder'], image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=85' },
  { name: 'By the ocean', subtitle: 'Ocean waves · Wind', sounds: ['waves', 'wind'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Cozy evening', subtitle: 'Crackling fire · Soft rain', sounds: ['fire', 'rain'], image: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1000&q=80' },
]

const soundUrl = (id, variation) => `/sounds/${id}/${id}${variation ? `_${variation.toLowerCase()}` : ''}.ogg`
const getInitialSaved = () => { try { return JSON.parse(localStorage.getItem('moodil-mixes') || '[]') } catch { return [] } }

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'compact' : ''}`}><span className="brand-mark"><Leaf size={22} strokeWidth={2.3} /></span><span>moodil<span className="brand-dot">.</span></span></div>
}

function Equalizer() { return <span className="equalizer" aria-label="Playing"><i /><i /><i /></span> }

export default function App() {
  const [active, setActive] = useState([])
  const [volumes, setVolumes] = useState({})
  const [variations, setVariations] = useState({})
  const [playing, setPlaying] = useState(true)
  const [category, setCategory] = useState('All sounds')
  const [view, setView] = useState('Home')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [mixName, setMixName] = useState('')
  const [saved, setSaved] = useState(getInitialSaved)
  const [toast, setToast] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [scUrl, setScUrl] = useState('')
  const [scTrack, setScTrack] = useState('')
  const [scError, setScError] = useState('')
  const audio = useRef({})
  const timer = useRef(null)

  const notify = (message) => { setToast(message); window.clearTimeout(notify.t); notify.t = window.setTimeout(() => setToast(''), 2800) }
  const getSound = (id) => SOUNDS.find(s => s.id === id)

  useEffect(() => {
    active.forEach(id => {
      const sound = getSound(id)
      const variation = variations[id] || sound.variations[0] || ''
      const url = soundUrl(id, variation)
      if (!audio.current[id]) audio.current[id] = new Audio()
      const el = audio.current[id]
      if (el.dataset.url !== url) { el.src = url; el.dataset.url = url; el.loop = true; el.preload = 'auto' }
      el.volume = (volumes[id] ?? 55) / 100
      if (playing) el.play().catch(() => {})
      else el.pause()
    })
    Object.entries(audio.current).forEach(([id, el]) => { if (!active.includes(id)) el.pause() })
  }, [active, volumes, variations, playing])

  useEffect(() => { localStorage.setItem('moodil-mixes', JSON.stringify(saved)) }, [saved])
  useEffect(() => () => { Object.values(audio.current).forEach(el => el.pause()); clearTimeout(timer.current) }, [])

  const toggleSound = (id) => {
    setPlaying(true)
    setActive(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])
  }
  const playMix = (sounds, name) => {
    setActive(sounds); setPlaying(true); setView('Home'); notify(`Playing “${name}”`)
    document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const stopAll = () => { setActive([]); setPlaying(false); clearTimeout(timer.current); setTimerMinutes(0) }
  const saveMix = () => {
    if (!active.length) return notify('Choose at least one sound first')
    const name = mixName.trim() || 'My peaceful mix'
    setSaved(current => [{ id: Date.now(), name, sounds: [...active], volumes: { ...volumes } }, ...current])
    setMixName(''); setModal(null); notify('Mix saved to your collection')
  }
  const startTimer = (minutes) => {
    clearTimeout(timer.current)
    setTimerMinutes(minutes)
    if (minutes) timer.current = setTimeout(() => { stopAll(); notify('Sleep timer finished. Good night.') }, minutes * 60000)
    setModal(null); notify(minutes ? `Sleep timer set for ${minutes} minutes` : 'Sleep timer turned off')
  }
  const importSoundCloud = () => {
    try {
      const url = new URL(scUrl.trim())
      if (!/(^|\.)soundcloud\.com$/.test(url.hostname)) throw new Error()
      setScTrack(url.href); setScError('')
    } catch { setScError('Paste a valid SoundCloud track or playlist link.') }
  }
  const openSoundCloud = () => { if (scTrack) window.open(scTrack, '_blank', 'noopener,noreferrer') }

  const filtered = SOUNDS.filter(s => (category === 'All sounds' || s.category === category) && `${s.name} ${s.category}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="app-shell">
    <aside className="sidebar">
      <Brand />
      <nav className="side-nav">
        {[[Home, 'Home'], [Search, 'Explore'], [Heart, 'Saved'], [User, 'Profile']].map(([Icon, label]) => <button key={label} className={view === label ? 'active' : ''} onClick={() => setView(label)}><Icon size={20} /><span>{label}</span>{label === 'Saved' && saved.length > 0 && <b>{saved.length}</b>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="little-quote"><Leaf size={20} /><p>“Nature is not a place to visit. It is home.”</p><span>— Gary Snyder</span></div>
        <button className="soundcloud-link" onClick={() => setModal('soundcloud')}><CloudDownload size={20} /><span>Import from<br /><strong>SoundCloud</strong></span><Plus size={17} /></button>
      </div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <div className="mobile-brand"><Brand compact /></div>
        <div className="greeting"><span className="eyebrow">YOUR POCKET OF PEACE</span><h1>{view === 'Home' ? 'Find your calm.' : view}</h1></div>
        <div className="header-actions">
          {searchOpen && <input autoFocus className="header-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sounds…" aria-label="Search sounds" />}
          <button className="icon-button" onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setQuery('') }} aria-label="Search"><Search size={20} /></button>
          <button className="avatar" onClick={() => setView('Profile')} aria-label="Profile"><span>JD</span><i /></button>
        </div>
      </header>

      {view === 'Home' && <>
        <section className="hero">
          <img src={PRESETS[0].image} alt="Sunlight through a peaceful green forest" />
          <div className="hero-shade" />
          <div className="hero-content"><span className="hero-tag"><Sparkles size={13} /> FEATURED MIX</span><h2>A little escape,<br />whenever you need it.</h2><p>{PRESETS[0].subtitle}</p><button onClick={() => playMix(PRESETS[0].sounds, PRESETS[0].name)}><span><Play size={17} fill="currentColor" /></span>Listen to the mix</button></div>
          <div className="hero-note"><Headphones size={17} /><span>Best enjoyed<br />with headphones</span></div>
        </section>

        <section className="sound-section">
          <div className="section-heading"><div><h2>Create your atmosphere</h2><p>Tap to play. Layer sounds to make it yours.</p></div><button className="text-button" onClick={() => active.length ? setModal('save') : notify('Choose sounds to create a mix')}><Plus size={17} /> Save mix</button></div>
          <div className="category-row">{['All sounds', 'Nature', 'Water', 'Weather', 'Ambience'].map(item => <button key={item} onClick={() => setCategory(item)} className={category === item ? 'active' : ''}>{item}</button>)}</div>
          <div className="sound-grid">{filtered.map(sound => {
            const Icon = sound.icon; const isActive = active.includes(sound.id)
            return <article key={sound.id} className={`sound-card ${isActive ? 'is-active' : ''}`} style={{ '--tile': sound.color, '--ink': sound.ink }}>
              <button className="sound-toggle" onClick={() => toggleSound(sound.id)} aria-pressed={isActive} aria-label={`${isActive ? 'Stop' : 'Play'} ${sound.name}`}>
                <span className="sound-icon"><Icon size={30} strokeWidth={1.55} />{isActive && <span className="playing-dot"><Equalizer /></span>}</span>
                <span className="sound-name">{sound.name}</span><span className="sound-category">{sound.category}</span>
              </button>
              <span className="card-action">{isActive ? <Check size={15} /> : <Plus size={15} />}</span>
              {isActive && <div className="sound-controls">
                <Volume2 size={14} /><input aria-label={`${sound.name} volume`} type="range" min="0" max="100" value={volumes[sound.id] ?? 55} onChange={e => setVolumes({ ...volumes, [sound.id]: Number(e.target.value) })} />
                {sound.variations.length > 0 && <select aria-label={`${sound.name} variation`} value={variations[sound.id] || sound.variations[0]} onChange={e => setVariations({ ...variations, [sound.id]: e.target.value })}>{sound.variations.map(v => <option key={v}>{v}</option>)}</select>}
              </div>}
            </article>
          })}</div>
          {!filtered.length && <div className="empty"><Search size={32} /><h3>No sounds found</h3><p>Try a different name or category.</p></div>}
        </section>
      </>}

      {view === 'Explore' && <section className="page-section">
        <button className="soundcloud-banner" onClick={() => setModal('soundcloud')}><span className="sc-icon"><Cloud size={32} /></span><span><strong>Bring your SoundCloud favorites</strong><small>Paste a track link and listen without leaving your space.</small></span><ChevronRight /></button>
        <div className="section-heading"><div><h2>Curated escapes</h2><p>A starting point for your perfect moment.</p></div></div>
        <div className="preset-grid">{PRESETS.map(preset => <article className="preset-card" key={preset.name}><img src={preset.image} alt="" /><div className="preset-overlay" /><div><span>NATURE MIX</span><h3>{preset.name}</h3><p>{preset.subtitle}</p></div><button onClick={() => playMix(preset.sounds, preset.name)} aria-label={`Play ${preset.name}`}><Play size={20} fill="currentColor" /></button></article>)}</div>
        <div className="section-heading explore-all"><div><h2>Explore every sound</h2><p>From gentle rain to a bustling café.</p></div></div>
        <div className="explore-list">{SOUNDS.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map(sound => { const Icon = sound.icon; const isActive = active.includes(sound.id); return <button key={sound.id} onClick={() => toggleSound(sound.id)}><span className="list-icon" style={{ background: sound.color, color: sound.ink }}><Icon size={23} /></span><span><strong>{sound.name}</strong><small>{sound.category}</small></span>{isActive ? <Equalizer /> : <Plus size={18} />}</button> })}</div>
      </section>}

      {view === 'Saved' && <section className="page-section">
        <div className="section-heading"><div><h2>Your saved moments</h2><p>Personal mixes, ready whenever you are.</p></div><button className="text-button" onClick={() => setModal('save')}><Plus size={17} /> Save current</button></div>
        {saved.length ? <div className="saved-grid">{saved.map((mix, index) => <article className="saved-card" key={mix.id}><div className={`saved-art art-${index % 3}`}>{mix.sounds.slice(0, 4).map(id => { const Icon = getSound(id).icon; return <Icon key={id} size={29} /> })}</div><div className="saved-info"><span>{mix.sounds.length} LAYERS</span><h3>{mix.name}</h3><p>{mix.sounds.map(id => getSound(id).name).join(' · ')}</p><div><button className="primary-small" onClick={() => { setVolumes(mix.volumes); playMix(mix.sounds, mix.name) }}><Play size={15} fill="currentColor" /> Play mix</button><button className="delete-button" onClick={() => setSaved(saved.filter(x => x.id !== mix.id))} aria-label={`Delete ${mix.name}`}><Trash2 size={17} /></button></div></div></article>)}</div> : <div className="empty saved-empty"><span><Heart size={35} /></span><h3>A quiet corner for your favorites</h3><p>Layer a few sounds, then save your mix here.</p><button onClick={() => setView('Home')}>Create your first mix <ChevronRight size={17} /></button></div>}
      </section>}

      {view === 'Profile' && <section className="page-section profile-page">
        <div className="profile-card"><div className="profile-avatar">JD</div><div><h2>Your peaceful space</h2><p>No account needed. Your mixes stay on this device.</p></div><span className="local-badge"><Check size={13} /> Saved locally</span></div>
        <div className="settings-list">
          <button onClick={() => setModal('timer')}><span><Timer /></span><div><strong>Sleep timer</strong><small>{timerMinutes ? `Stops after ${timerMinutes} minutes` : 'Drift off without worrying'}</small></div><ChevronRight /></button>
          <button onClick={() => setModal('soundcloud')}><span><CloudDownload /></span><div><strong>SoundCloud import</strong><small>Listen to tracks through the official player</small></div><ChevronRight /></button>
          <button onClick={() => { localStorage.removeItem('moodil-mixes'); setSaved([]); notify('Saved mixes cleared') }}><span><Trash2 /></span><div><strong>Clear saved mixes</strong><small>Remove your personal mixes from this device</small></div><ChevronRight /></button>
        </div>
        <div className="about-card"><Leaf size={26} /><h3>Nature is my medicine.</h3><p>Inspired by Moodil. Made for slow mornings, focused afternoons, and restful nights.</p><span>MOODIL · NATURE SOUNDS</span></div>
      </section>}
      <footer><Brand compact /><span>Take a breath. Stay a while.</span><button onClick={() => setModal('about')}>About</button></footer>
    </main>

    <nav className="bottom-nav">{[[Home, 'Home'], [Search, 'Explore'], [Heart, 'Saved'], [User, 'Profile']].map(([Icon, label]) => <button key={label} className={view === label ? 'active' : ''} onClick={() => setView(label)}><Icon size={21} /><span>{label}</span></button>)}</nav>

    {active.length > 0 && <div className="player-wrap"><div className="now-playing">
      <button className="main-play" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause all' : 'Play all'}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
      <div className="now-info"><span>NOW PLAYING <Equalizer /></span><strong>{active.length === 1 ? getSound(active[0]).name : `${getSound(active[0]).name} + ${active.length - 1} more`}</strong></div>
      <div className="now-icons">{active.slice(0, 4).map(id => { const sound = getSound(id); const Icon = sound.icon; return <span key={id} style={{ background: sound.color, color: sound.ink }}><Icon size={18} /></span> })}</div>
      <button className="player-action timer-action" onClick={() => setModal('timer')} aria-label="Sleep timer"><Timer size={20} />{timerMinutes > 0 && <i />}</button>
      <button className="player-action" onClick={() => setModal('save')} aria-label="Save mix"><Bookmark size={20} /></button>
      <button className="player-action stop-action" onClick={stopAll} aria-label="Stop all sounds"><Square size={17} fill="currentColor" /></button>
    </div></div>}

    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null) }}><section className={`modal ${modal === 'soundcloud' ? 'sc-modal' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" onClick={() => setModal(null)} aria-label="Close"><X size={20} /></button>
      {modal === 'save' && <><span className="modal-symbol"><Bookmark /></span><span className="eyebrow">KEEP THIS MOMENT</span><h2 id="modal-title">Save your mix</h2><p>Give this atmosphere a name. It will be waiting in your saved moments.</p><label className="input-label">Mix name<input autoFocus value={mixName} onChange={e => setMixName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveMix()} placeholder="e.g. Sunday morning" maxLength={50} /></label><div className="mix-preview">{active.map(id => { const Icon = getSound(id).icon; return <span key={id}><Icon size={17} />{getSound(id).name}</span> })}</div><button className="modal-primary" onClick={saveMix}>Save to my collection <ChevronRight size={18} /></button></>}
      {modal === 'timer' && <><span className="modal-symbol"><Moon /></span><span className="eyebrow">REST EASY</span><h2 id="modal-title">Sleep timer</h2><p>Choose when you’d like your sounds to gently stop.</p><div className="timer-options">{[0, 15, 30, 45, 60].map(m => <button key={m} className={timerMinutes === m ? 'selected' : ''} onClick={() => startTimer(m)}>{m === 0 ? 'Off' : <><strong>{m}</strong><span>minutes</span></>}{timerMinutes === m && <Check size={16} />}</button>)}</div></>}
      {modal === 'soundcloud' && <><span className="modal-symbol orange"><Cloud /></span><span className="eyebrow">YOUR MUSIC, YOUR SPACE</span><h2 id="modal-title">Listen from SoundCloud</h2><p>Paste a public SoundCloud track or playlist link to open its official player.</p><label className="input-label">SoundCloud link<div className="url-input"><input value={scUrl} onChange={e => { setScUrl(e.target.value); setScError('') }} onKeyDown={e => e.key === 'Enter' && importSoundCloud()} placeholder="https://soundcloud.com/artist/track" inputMode="url" /><button onClick={importSoundCloud}>Add</button></div></label>{scError && <div className="form-error">{scError}</div>}{scTrack ? <div className="sc-player"><iframe title="SoundCloud player" width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(scTrack)}&color=%23263e32&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`} /><button className="download-link" onClick={openSoundCloud}><Download size={17} /> Download on SoundCloud <ExternalLink size={14} /></button><small>Downloads are available only when enabled by the artist on SoundCloud.</small></div> : <div className="sc-empty"><Music2 size={27} /><span>Your track will appear here</span></div>}<button className="browse-sc" onClick={() => window.open('https://soundcloud.com/search/sounds?q=nature%20sounds', '_blank', 'noopener,noreferrer')}>Find nature sounds on SoundCloud <ExternalLink size={14} /></button></>}
      {modal === 'about' && <><Brand /><h2 id="modal-title">A little more quiet.</h2><p>Moodil is a simple space to rest, focus, and reconnect with nature. Mix original nature sounds and keep your favorites on your device.</p><p>SoundCloud playback uses SoundCloud’s official embedded player. Artist-controlled downloads open on SoundCloud.</p><button className="modal-primary" onClick={() => setModal(null)}>Back to my peaceful place</button></>}
    </section></div>}
    {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
  </div>
}
