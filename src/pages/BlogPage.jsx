import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, Tag, Calendar, User, ArrowUpRight, Rss, TrendingUp, Shield, Cpu, GraduationCap } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Posts', icon: Rss, count: 7 },
  { id: 'Product Updates', label: 'Product Updates', icon: TrendingUp, count: 1 },
  { id: 'Engineering', label: 'Engineering', icon: Cpu, count: 2 },
  { id: 'Security', label: 'Security', icon: Shield, count: 2 },
  { id: 'Tutorials', label: 'Tutorials', icon: GraduationCap, count: 2 },
];

const CATEGORY_COLORS = {
  'Product Updates': '#34d399',
  'Engineering': '#60a5fa',
  'Security': '#f87171',
  'Tutorials': '#a78bfa',
};

const FEATURED_POST = {
  id: 'featured',
  title: 'Introducing Alice 2.0: The Future of Remote Proctoring',
  desc: 'We are thrilled to announce Alice 2.0 — completely rebuilt from the ground up with a 99.9% detection accuracy rate, brand new gaze tracking, and unparalleled real-time reporting dashboards.',
  category: 'Product Updates',
  author: 'Aditya Singh',
  date: 'Oct 24, 2026',
  readTime: '5 min read',
  image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
};

const POSTS = [
  { id: 1, title: 'How AI is Changing Online Exams', desc: 'Explore how artificial intelligence and computer vision are ensuring integrity without invading privacy.', category: 'Engineering', author: 'Sarah Jenkins', date: 'Oct 12, 2026', readTime: '7 min', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: '5 Tips for a Smooth Proctoring Experience', desc: 'Ensure your students have a stress-free exam experience with these best practices for online proctoring.', category: 'Tutorials', author: 'Michael Chang', date: 'Sep 28, 2026', readTime: '4 min', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Security First: End-to-End Encryption', desc: 'A deep dive into how we secure video feeds and student data across the Alice ecosystem.', category: 'Security', author: 'Elena Rodriguez', date: 'Sep 15, 2026', readTime: '6 min', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Scaling to 100K Concurrent Exams', desc: 'The technical challenges and architectural decisions behind scaling our real-time video processing.', category: 'Engineering', author: 'Aditya Singh', date: 'Aug 30, 2026', readTime: '9 min', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Student Privacy and GDPR Compliance', desc: 'Why data minimization and transparency are core to our mission of ethical exam proctoring.', category: 'Security', author: 'Laura Smith', date: 'Aug 12, 2026', readTime: '5 min', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Creating the Perfect Exam Rules', desc: "A teacher's guide to configuring sensitivity, time limits, and allowed materials in Alice.", category: 'Tutorials', author: 'Michael Chang', date: 'Jul 21, 2026', readTime: '4 min', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Blog — Alice Exam Proctor';
  }, []);

  const filtered = POSTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const showFeatured = activeCategory === 'all' && !searchQuery;

  return (
    <div style={{ minHeight: '100vh', background: '#080c10', color: '#e2e8f0', fontFamily: "'Inter','SF Pro Display',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .bl-navbar {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          background: rgba(8,12,16,0.85); border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 5%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .bl-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.85rem;
          padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); transition: all 0.2s ease;
        }
        .bl-back-btn:hover { color: #34d399; border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.05); }

        .bl-layout {
          max-width: 1200px; margin: 0 auto; padding: 48px 5% 100px;
          display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: start;
        }
        @media (max-width: 900px) { .bl-layout { grid-template-columns: 1fr; } .bl-sidebar { display: none; } }

        .bl-sidebar { position: sticky; top: 80px; }

        .bl-cat-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          color: rgba(255,255,255,0.4); font-size: 0.83rem;
          cursor: pointer; transition: all 0.2s;
          border: 1px solid transparent; margin-bottom: 4px;
          background: none; width: 100%; text-align: left;
        }
        .bl-cat-item:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.03); }
        .bl-cat-item.active { color: #34d399; background: rgba(52,211,153,0.06); border-color: rgba(52,211,153,0.18); }
        .bl-cat-count {
          margin-left: auto; font-size: 0.72rem; padding: 1px 8px;
          border-radius: 10px; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.25);
        }
        .bl-cat-item.active .bl-cat-count { background: rgba(52,211,153,0.1); color: rgba(52,211,153,0.7); }

        .bl-search {
          width: 100%; padding: 11px 14px 11px 42px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; color: #e2e8f0; font-size: 0.85rem;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.2s, background 0.2s; box-sizing: border-box;
        }
        .bl-search:focus { border-color: rgba(52,211,153,0.35); background: rgba(52,211,153,0.03); }
        .bl-search::placeholder { color: rgba(255,255,255,0.2); }

        .bl-featured {
          border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          display: grid; grid-template-columns: 1fr 1fr;
          margin-bottom: 48px; transition: border-color 0.3s, transform 0.3s;
          cursor: pointer;
        }
        .bl-featured:hover { border-color: rgba(52,211,153,0.25); transform: translateY(-3px); }
        .bl-featured-img { width: 100%; height: 100%; object-fit: cover; min-height: 320px; display: block; transition: transform 0.4s; }
        .bl-featured:hover .bl-featured-img { transform: scale(1.03); }
        @media (max-width: 700px) { .bl-featured { grid-template-columns: 1fr; } .bl-featured-img { min-height: 220px; } }

        .bl-card {
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          display: flex; flex-direction: column;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; cursor: pointer;
        }
        .bl-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
        .bl-card-img { width: 100%; height: 200px; object-fit: cover; display: block; transition: transform 0.4s; }
        .bl-card:hover .bl-card-img { transform: scale(1.04); }

        .bl-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600;
        }

        .bl-author-avatar {
          width: 28px; height: 28px; border-radius: '50%'; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
          background: rgba(52,211,153,0.1); color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
        }

        .bl-read-more {
          display: inline-flex; align-items: center; gap: 5px;
          color: rgba(255,255,255,0.3); font-size: 0.78rem;
          transition: color 0.2s;
        }
        .bl-card:hover .bl-read-more { color: #34d399; }

        .bl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

        .bl-empty {
          text-align: center; padding: 72px 24px;
          border-radius: 16px; border: 1px dashed rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.01);
        }
      `}</style>

      {/* Navbar */}
      <nav className="bl-navbar">
        <Link to="/" className="bl-back-btn">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} style={{ color: '#34d399' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Alice Blog</span>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/auth" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '56px 5% 44px', background: 'linear-gradient(180deg, rgba(52,211,153,0.03) 0%, transparent 100%)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20 }}>
          <Rss size={13} style={{ color: '#34d399' }} />
          <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>The Alice Blog</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 14px', background: 'linear-gradient(135deg, #e2e8f0, rgba(255,255,255,0.55))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Insights from Team Alice
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.75 }}>
          Product updates, engineering deep-dives, security research, and proctoring tutorials — all in one place.
        </p>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>{POSTS.length + 1} articles published</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>•</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>Updated regularly</span>
        </div>
      </div>

      {/* Layout */}
      <div className="bl-layout">

        {/* Sidebar */}
        <aside className="bl-sidebar">
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bl-search"
            />
          </div>

          {/* Categories */}
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Categories</div>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`bl-cat-item ${activeCategory === c.id ? 'active' : ''}`}
            >
              <c.icon size={13} />
              {c.label}
              <span className="bl-cat-count">{c.count}</span>
            </button>
          ))}

          {/* Quick Links */}
          <div style={{ marginTop: 32, padding: '18px', borderRadius: 12, background: 'rgba(52,211,153,0.03)', border: '1px solid rgba(52,211,153,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Links</div>
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Get Started Free', to: '/auth' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                {l.label}
                <ArrowUpRight size={12} style={{ opacity: 0.4 }} />
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main>
          {/* Mobile Search */}
          <div style={{ display: 'none', marginBottom: 24 }} className="bl-mobile-search">
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
              <input type="text" placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bl-search" />
            </div>
          </div>

          {/* Featured Post */}
          {showFeatured && (
            <div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Featured</div>
              <div className="bl-featured">
                <div style={{ overflow: 'hidden' }}>
                  <img src={FEATURED_POST.image} alt={FEATURED_POST.title} className="bl-featured-img" />
                </div>
                <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="bl-badge" style={{ background: `${CATEGORY_COLORS[FEATURED_POST.category]}15`, color: CATEGORY_COLORS[FEATURED_POST.category], border: `1px solid ${CATEGORY_COLORS[FEATURED_POST.category]}25` }}>
                      <Tag size={10} /> {FEATURED_POST.category}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>{FEATURED_POST.readTime}</span>
                  </div>
                  <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.02em', margin: 0 }}>{FEATURED_POST.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.87rem', lineHeight: 1.75, margin: 0 }}>{FEATURED_POST.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="bl-author-avatar">{FEATURED_POST.author[0]}</div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500 }}>{FEATURED_POST.author}</div>
                      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                        <Calendar size={10} /> {FEATURED_POST.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {searchQuery ? `Results for "${searchQuery}"` : activeCategory === 'all' ? 'Latest Articles' : activeCategory}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</div>
          </div>

          {/* Cards Grid */}
          {filtered.length > 0 ? (
            <div className="bl-grid">
              {filtered.map((post, i) => {
                const color = CATEGORY_COLORS[post.category] || '#34d399';
                return (
                  <div key={post.id} className="bl-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div style={{ overflow: 'hidden', height: 200 }}>
                      <img src={post.image} alt={post.title} className="bl-card-img" />
                    </div>
                    <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                        <span className="bl-badge" style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
                          <Tag size={9} />{post.category}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem' }}>{post.readTime}</span>
                      </div>
                      <h3 style={{ color: '#e2e8f0', fontSize: '1.02rem', fontWeight: 700, lineHeight: 1.4, marginBottom: 10, letterSpacing: '-0.01em' }}>{post.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: 18, flex: 1 }}>{post.desc}</p>
                      <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="bl-author-avatar" style={{ width: 26, height: 26, fontSize: '0.7rem' }}>{post.author[0]}</div>
                          <div>
                            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', fontWeight: 500 }}>{post.author}</div>
                            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Calendar size={9} />{post.date}
                            </div>
                          </div>
                        </div>
                        <span className="bl-read-more">Read <ArrowUpRight size={12} /></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bl-empty">
              <Search size={40} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 16px', display: 'block' }} />
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>No articles found</div>
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', marginBottom: 20 }}>Try a different search term or category.</div>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} style={{ padding: '9px 20px', borderRadius: 8, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: '0.83rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Clear filters
              </button>
            </div>
          )}

          {/* Newsletter CTA */}
          <div style={{ marginTop: 60, padding: '36px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(52,211,153,0.05), rgba(96,165,250,0.03))', border: '1px solid rgba(52,211,153,0.12)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 20, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 16 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              <span style={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Stay Updated</span>
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: '1.3rem', fontWeight: 700, marginBottom: 10 }}>Never miss an update</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.87rem', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
              Follow the Alice blog for the latest features, security updates, and proctoring insights.
            </p>
            <Link to="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 28px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.25)'; }}>
              Get started free <ArrowUpRight size={15} />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
