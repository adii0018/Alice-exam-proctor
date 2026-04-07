import { useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Computer Science Student',
    avatar: 'PS',
    color: '#3fb950',
    text: 'Alice caught a student trying to use a second device. The real-time alert was instant — I had no idea proctoring could be this seamless.',
  },
  {
    name: 'James Okafor',
    role: 'University Recruiter',
    avatar: 'JO',
    color: '#58a6ff',
    text: 'We run 500+ technical assessments a month. Alice gave us the confidence that every result reflects genuine ability, not Google.',
  },
  {
    name: 'Dr. Meera Nair',
    role: 'Professor, IIT Delhi',
    avatar: 'MN',
    color: '#bc8cff',
    text: 'The gaze tracking is remarkably accurate. Students know they\'re being monitored fairly, which actually reduces anxiety.',
  },
  {
    name: 'Carlos Mendez',
    role: 'HR Tech Lead',
    avatar: 'CM',
    color: '#ffa657',
    text: 'Integrated Alice into our hiring pipeline in a day. The violation reports are detailed enough to make defensible decisions.',
  },
  {
    name: 'Aisha Patel',
    role: 'Online Exam Candidate',
    avatar: 'AP',
    color: '#3fb950',
    text: 'Knowing the exam was proctored fairly made me feel my hard work actually mattered. No more worrying about others cheating.',
  },
  {
    name: 'Tom Eriksson',
    role: 'EdTech Product Manager',
    avatar: 'TE',
    color: '#58a6ff',
    text: 'We evaluated 6 proctoring tools. Alice had the lowest false-positive rate and the cleanest API. Easy choice.',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'Certification Body Director',
    avatar: 'FA',
    color: '#bc8cff',
    text: 'Our certification exams now carry real weight. Employers trust our badges because they know Alice was watching.',
  },
  {
    name: 'Rohan Verma',
    role: 'Software Engineering Student',
    avatar: 'RV',
    color: '#ffa657',
    text: 'The setup took under 2 minutes. Camera check, rules modal, and I was in. Honestly the smoothest exam experience I\'ve had.',
  },
  {
    name: 'Linda Zhao',
    role: 'Academic Integrity Officer',
    avatar: 'LZ',
    color: '#3fb950',
    text: 'Alice\'s behavioral analysis flagged patterns we\'d never have caught manually. It\'s like having a vigilant TA in every session.',
  },
  {
    name: 'Marcus Webb',
    role: 'Coding Bootcamp Instructor',
    avatar: 'MW',
    color: '#58a6ff',
    text: 'Students stopped complaining about unfair grading once we switched to Alice. The integrity score speaks for itself.',
  },
]

const ROW1 = TESTIMONIALS.slice(0, 5)
const ROW2 = TESTIMONIALS.slice(5, 10)

function Avatar({ initials, color }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: `${color}22`,
      border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color, fontWeight: 700, fontSize: '0.78rem',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#ffa657" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t }) {
  return (
    <div className="tcard" style={{
      background: 'rgba(22,27,34,0.85)',
      border: '1px solid #30363d',
      borderRadius: 12,
      padding: '20px 22px',
      width: 300,
      flexShrink: 0,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      cursor: 'default',
    }}>
      <StarRating />
      <p style={{ color: '#c9d1d9', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 16 }}>
        "{t.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar initials={t.avatar} color={t.color} />
        <div>
          <div style={{ color: '#e6edf3', fontWeight: 600, fontSize: '0.82rem' }}>{t.name}</div>
          <div style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: 1 }}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function ScrollRow({ items, direction = 'left', speed = 35 }) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const posRef = useRef(0)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)

  // duplicate for seamless loop
  const doubled = [...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const cardW = 300 + 16 // card width + gap
    const halfW = cardW * items.length

    // right-to-left starts at 0, left-to-right starts at -halfW
    if (direction === 'right') posRef.current = 0
    else posRef.current = halfW

    function step(ts) {
      if (lastTimeRef.current === null) lastTimeRef.current = ts
      const dt = ts - lastTimeRef.current
      lastTimeRef.current = ts

      if (!pausedRef.current) {
        const delta = (speed * dt) / 1000
        if (direction === 'right') {
          // scrolls right-to-left: offset increases, wraps at halfW
          posRef.current += delta
          if (posRef.current >= halfW) posRef.current -= halfW
          track.style.transform = `translateX(${-posRef.current}px)`
        } else {
          // scrolls left-to-right: offset decreases, wraps at 0
          posRef.current -= delta
          if (posRef.current <= 0) posRef.current += halfW
          track.style.transform = `translateX(${-posRef.current}px)`
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [direction, speed, items.length])

  return (
    <div
      style={{ overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 16,
          willChange: 'transform',
          width: 'max-content',
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section style={{
      padding: '96px 0',
      borderTop: '1px solid #21262d',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        .tcard:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: #484f58;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(63,185,80,0.1);
        }
        @media (max-width: 768px) {
          .testimonials-row2 { display: none !important; }
        }
      `}</style>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 24px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(46,160,67,0.1)', border: '1px solid rgba(46,160,67,0.3)',
          color: '#3fb950', fontSize: '0.78rem', fontWeight: 600,
          padding: '4px 12px', borderRadius: 20, letterSpacing: '0.5px',
          textTransform: 'uppercase', marginBottom: 16,
        }}>
          Testimonials
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          fontWeight: 800, color: '#e6edf3',
          letterSpacing: -0.5, marginBottom: 14,
        }}>
          Trusted by educators and recruiters
        </h2>
        <p style={{ color: '#8b949e', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
          See what students, teachers, and hiring teams say about exam integrity with Alice.
        </p>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
        <ScrollRow items={ROW1} direction="right" speed={38} />
        <div className="testimonials-row2">
          <ScrollRow items={ROW2} direction="left" speed={32} />
        </div>
      </div>

      {/* Edge fade overlays */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 120, height: '100%',
        background: 'linear-gradient(to right, #0d1117 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 120, height: '100%',
        background: 'linear-gradient(to left, #0d1117 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
    </section>
  )
}
