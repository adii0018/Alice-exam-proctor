import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PremiumFooter from '../components/common/PremiumFooter'

// ── Alice logo — leaf, GitHub dark theme ─────────────────────────────────────
function AliceLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" rx="22" fill="#161b22"/>
      <rect width="100" height="100" rx="22" fill="none" stroke="#30363d" strokeWidth="2"/>
      <path d="M50 18 C50 18 78 32 78 56 C78 72 65 82 50 82 C50 82 50 52 50 18 Z" fill="#3fb950" opacity="0.95"/>
      <path d="M50 18 C50 18 22 32 22 56 C22 72 35 82 50 82 C50 82 50 52 50 18 Z" fill="#2ea043" opacity="0.7"/>
      <line x1="50" y1="22" x2="50" y2="78" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
      <path d="M50 82 Q48 89 44 93" fill="none" stroke="#2ea043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Star field canvas ─────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth
    let H = document.documentElement.scrollHeight

    const COUNT = Math.floor((W * H) / 6000)
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      base: Math.random() * 0.5 + 0.15,
    }))

    const BRIGHT = Math.floor(COUNT * 0.06)
    for (let i = 0; i < BRIGHT; i++) {
      stars[i].r = Math.random() * 1.6 + 1.0
      stars[i].base = Math.random() * 0.4 + 0.4
    }

    function resize() {
      W = window.innerWidth
      H = document.documentElement.scrollHeight
      canvas.width = W
      canvas.height = H
      drawStars()
    }

    function drawStars() {
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 220, 255, ${s.base})`
        ctx.fill()
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(document.documentElement)

    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        opacity: 1,
      }}
    />
  )
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

const CATEGORIES = ['All', 'Product Updates', 'Engineering', 'Security', 'Tutorials']

const FEATURED_POST = {
  id: 'featured',
  title: 'Introducing Alice 2.0: The Future of Remote Proctoring',
  desc: 'We are thrilled to announce Alice 2.0, completely rebuilt from the ground up with a 99.9% detection accuracy rate, brand new gaze tracking, and unparalleled real-time reporting.',
  category: 'Product Updates',
  author: 'Aditya Singh',
  date: 'Oct 24, 2026',
  image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
}

const POSTS = [
  {
    id: 1,
    title: 'How AI is Changing Online Exams',
    desc: 'Explore how artificial intelligence and computer vision are ensuring integrity without invading privacy.',
    category: 'Engineering',
    author: 'Sarah Jenkins',
    date: 'Oct 12, 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: '5 Tips for a Smooth Proctoring Experience',
    desc: 'Ensure your students have a stress-free exam experience with these best practices for online proctoring.',
    category: 'Tutorials',
    author: 'Michael Chang',
    date: 'Sep 28, 2026',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Security First: End-to-End Encryption',
    desc: 'A deep dive into how we secure video feeds and student data across the Alice ecosystem.',
    category: 'Security',
    author: 'Elena Rodriguez',
    date: 'Sep 15, 2026',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Scaling to 100K Concurrent Exams',
    desc: 'The technical challenges and architectural decisions behind scaling our real-time video processing.',
    category: 'Engineering',
    author: 'Aditya Singh',
    date: 'Aug 30, 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Student Privacy and GDPR Compliance',
    desc: 'Why data minimization and transparency are core to our mission of ethical exam proctoring.',
    category: 'Security',
    author: 'Laura Smith',
    date: 'Aug 12, 2026',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Creating the Perfect Exam Rules',
    desc: 'A teacher’s guide to configuring sensitivity, time limits, and allowed materials in Alice.',
    category: 'Tutorials',
    author: 'Michael Chang',
    date: 'Jul 21, 2026',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  }
]

export default function BlogPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const [heroRef, heroVisible] = useReveal(0.05)
  const [postsRef, postsVisible] = useReveal(0.05)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filteredPosts = POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <StarField />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          
          /* scrollbar */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #0d1117; }
          ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #484f58; }

          /* nav link */
          .gh-nav-link {
            color: #8b949e;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            padding: 6px 12px;
            border-radius: 6px;
            transition: color 0.15s ease, background 0.15s ease;
          }
          .gh-nav-link:hover { color: #e6edf3; background: #161b22; }

          /* primary button */
          .gh-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #2ea043;
            color: #fff;
            border: 1px solid rgba(240,246,252,0.1);
            padding: 9px 20px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
            white-space: nowrap;
          }
          .gh-btn:hover { background: #3fb950; box-shadow: 0 0 0 3px rgba(46,160,67,0.2); transform: translateY(-1px); }
          
          /* outline button */
          .gh-btn-outline {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            color: #e6edf3;
            border: 1px solid #30363d;
            padding: 9px 20px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
            white-space: nowrap;
          }
          .gh-btn-outline:hover { background: #161b22; border-color: #8b949e; transform: translateY(-1px); }

          /* search input */
          .gh-search-input {
            width: 100%;
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 24px;
            color: #e6edf3;
            font-size: 0.9rem;
            padding: 12px 20px 12px 42px;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          .gh-search-input:focus { border-color: #2ea043; box-shadow: 0 0 0 3px rgba(46,160,67,0.15); }
          .gh-search-input::placeholder { color: #8b949e; }

          /* category chip */
          .category-chip {
            background: #161b22;
            border: 1px solid #30363d;
            color: #8b949e;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
          }
          .category-chip:hover { border-color: #8b949e; color: #e6edf3; }
          .category-chip.active { background: rgba(46,160,67,0.1); border-color: rgba(46,160,67,0.4); color: #3fb950; }

          /* cards */
          .blog-card {
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            flex-direction: column;
            cursor: pointer;
          }
          .blog-card:hover { border-color: #484f58; transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.5); }
          .blog-card-img { width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #30363d; transition: transform 0.3s ease; }
          .blog-card:hover .blog-card-img { transform: scale(1.03); }

          .featured-card {
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 16px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 1fr 1fr;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
          }
          .featured-card:hover { border-color: #484f58; box-shadow: 0 12px 32px rgba(0,0,0,0.5); }
          .featured-card-img { width: 100%; height: 100%; object-fit: cover; min-height: 340px; transition: transform 0.3s ease; }
          .featured-card:hover .featured-card-img { transform: scale(1.02); }

          /* reveal animation */
          .reveal { transition: opacity 0.6s ease, transform 0.6s ease; }
          .reveal-hidden { opacity: 0; transform: translateY(24px); }
          .reveal-visible { opacity: 1; transform: translateY(0); }

          /* responsive */
          @media (max-width: 900px) {
            .featured-card { grid-template-columns: 1fr; }
            .featured-card-img { height: 260px; min-height: auto; }
          }
          @media (max-width: 768px) {
            .gh-desktop-nav { display: none !important; }
            .gh-mobile-toggle { display: flex !important; }
            .blog-grid { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>

        {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(13,17,23,0.95)' : '#0d1117',
          borderBottom: `1px solid ${scrolled ? '#21262d' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <AliceLogo size={34} />
              <span style={{ color: '#e6edf3', fontWeight: 700, fontSize: '1rem', letterSpacing: -0.3 }}>Alice Exam Proctor</span>
            </Link>

            <nav className="gh-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Link to="/" className="gh-nav-link">Home</Link>
              <Link to="/blog" className="gh-nav-link" style={{ color: '#e6edf3', background: '#161b22' }}>Blog</Link>
              <a href="https://github.com/adii0018" target="_blank" rel="noopener noreferrer" className="gh-nav-link">GitHub</a>
            </nav>

            <div className="gh-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/auth" className="gh-btn-outline" style={{ padding: '7px 16px' }}>Sign in</Link>
              <Link to="/auth" className="gh-btn" style={{ padding: '7px 16px' }}>Get started</Link>
            </div>

            <button className="gh-mobile-toggle" style={{ display: 'none', background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 6 }} onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
          {mobileOpen && (
            <div style={{ background: '#161b22', borderTop: '1px solid #21262d', padding: '12px 24px 20px' }}>
              <Link to="/" className="gh-nav-link" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #21262d' }}>Home</Link>
              <Link to="/blog" className="gh-nav-link" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid #21262d', color: '#e6edf3' }}>Blog</Link>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Link to="/auth" className="gh-btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Sign in</Link>
                <Link to="/auth" className="gh-btn" style={{ flex: 1, justifyContent: 'center' }}>Get started</Link>
              </div>
            </div>
          )}
        </header>

        {/* ── HERO & FEATURED POST ───────────────────────────────────────────── */}
        <section style={{ padding: '60px 24px 40px', maxWidth: 1280, margin: '0 auto' }}>
          <div ref={heroRef} className={`reveal ${heroVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#e6edf3', letterSpacing: -1, marginBottom: 16 }}>
                Alice <span style={{ color: '#3fb950' }}>Blog</span>
              </h1>
              <p style={{ color: '#8b949e', fontSize: '1.1rem', maxWidth: 540, margin: '0 auto' }}>
                Insights, product updates, and tutorials from the team building the future of remote proctoring.
              </p>
            </div>

            {/* Featured Post */}
            {!searchQuery && activeCategory === 'All' && (
              <div style={{ marginBottom: 64 }}>
                <div style={{ color: '#8b949e', fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>Featured Post</div>
                <div className="featured-card">
                  <div style={{ overflow: 'hidden' }}>
                    <img src={FEATURED_POST.image} alt={FEATURED_POST.title} className="featured-card-img" />
                  </div>
                  <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ background: 'rgba(46,160,67,0.15)', color: '#3fb950', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>{FEATURED_POST.category}</span>
                      <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>{FEATURED_POST.date}</span>
                    </div>
                    <h2 style={{ color: '#e6edf3', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 16, letterSpacing: -0.5 }}>{FEATURED_POST.title}</h2>
                    <p style={{ color: '#8b949e', fontSize: '1rem', lineHeight: 1.6, marginBottom: 24 }}>{FEATURED_POST.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#30363d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e6edf3', fontWeight: 600, fontSize: '0.8rem' }}>
                        {FEATURED_POST.author[0]}
                      </div>
                      <span style={{ color: '#c9d1d9', fontSize: '0.85rem', fontWeight: 500 }}>{FEATURED_POST.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SEARCH & CATEGORIES ────────────────────────────────────────────── */}
        <section style={{ padding: '0 24px 32px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ position: 'relative', maxWidth: 400 }}>
              <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="gh-search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', borderBottom: '1px solid #21262d', paddingBottom: 24 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST POSTS ───────────────────────────────────────────────────── */}
        <section style={{ padding: '0 24px 96px', maxWidth: 1280, margin: '0 auto' }}>
          <div ref={postsRef} className={`reveal ${postsVisible ? 'reveal-visible' : 'reveal-hidden'}`}>
            <h3 style={{ color: '#e6edf3', fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 }}>Latest Articles</h3>
            
            {filteredPosts.length > 0 ? (
              <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {filteredPosts.map((post, i) => (
                  <div key={post.id} className="blog-card" style={{ transitionDelay: `${i * 0.05}s` }}>
                    <div style={{ overflow: 'hidden' }}>
                      <img src={post.image} alt={post.title} className="blog-card-img" />
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ color: '#3fb950', fontSize: '0.75rem', fontWeight: 600 }}>{post.category}</span>
                        <span style={{ color: '#484f58' }}>•</span>
                        <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>{post.date}</span>
                      </div>
                      <h3 style={{ color: '#e6edf3', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 12 }}>{post.title}</h3>
                      <p style={{ color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>{post.desc}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #21262d' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#30363d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e6edf3', fontWeight: 600, fontSize: '0.65rem' }}>
                          {post.author[0]}
                        </div>
                        <span style={{ color: '#8b949e', fontSize: '0.8rem', fontWeight: 500 }}>{post.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '64px 24px', textAlign: 'center', background: '#161b22', borderRadius: 12, border: '1px dashed #30363d' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <div style={{ color: '#e6edf3', fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>No articles found</div>
                <div style={{ color: '#8b949e', fontSize: '0.9rem' }}>Try adjusting your search query or category filter.</div>
                <button onClick={() => {setSearchQuery(''); setActiveCategory('All')}} className="gh-btn-outline" style={{ marginTop: 24 }}>Clear filters</button>
              </div>
            )}
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <PremiumFooter />
      </div>
    </div>
  )
}
