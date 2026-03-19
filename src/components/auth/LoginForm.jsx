import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const S = {
  label: { display: 'block', color: '#8b949e', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, letterSpacing: 0.2 },
  inputWrap: { position: 'relative' },
  icon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#484f58', pointerEvents: 'none', display: 'flex', alignItems: 'center' },
  input: (err) => ({
    width: '100%', background: '#0d1117', border: `1px solid ${err ? '#f85149' : '#30363d'}`,
    borderRadius: 6, color: '#e6edf3', fontSize: '0.875rem', fontFamily: 'inherit',
    padding: '9px 12px 9px 38px', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  }),
  errText: { color: '#f85149', fontSize: '0.75rem', marginTop: 5 },
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' },
  dividerLine: { flex: 1, height: 1, background: '#21262d' },
  dividerText: { color: '#484f58', fontSize: '0.75rem', whiteSpace: 'nowrap' },
}

function InputIcon({ children }) {
  return <span style={S.icon}>{children}</span>
}

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Minimum 6 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success('Signed in successfully')
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'student') navigate('/student')
      else navigate('/teacher')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Sign in failed'
      toast.error(msg)
      setErrors({ submit: msg })
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    setEmail(role === 'student' ? 'student1@example.com' : 'teacher1@example.com')
    setPassword('password123')
    setErrors({})
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#2ea043'; e.target.style.boxShadow = '0 0 0 3px rgba(46,160,67,0.15)' }
  const blurStyle = (e, err) => { e.target.style.borderColor = err ? '#f85149' : '#30363d'; e.target.style.boxShadow = 'none' }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Email */}
      <div>
        <label style={S.label}>Email address</label>
        <div style={S.inputWrap}>
          <InputIcon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </InputIcon>
          <input
            type="email" value={email} placeholder="you@example.com"
            style={S.input(errors.email)}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            onFocus={focusStyle} onBlur={e => blurStyle(e, errors.email)}
          />
        </div>
        {errors.email && <p style={S.errText}>{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label style={S.label}>Password</label>
        <div style={S.inputWrap}>
          <InputIcon>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </InputIcon>
          <input
            type={showPw ? 'text' : 'password'} value={password} placeholder="••••••••"
            style={{ ...S.input(errors.password), paddingRight: 38 }}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            onFocus={focusStyle} onBlur={e => blurStyle(e, errors.password)}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}>
            {showPw
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
        {errors.password && <p style={S.errText}>{errors.password}</p>}
      </div>

      {/* Remember + Forgot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
            style={{ width: 14, height: 14, accentColor: '#2ea043', cursor: 'pointer' }} />
          <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>Remember me</span>
        </label>
        <button type="button" style={{ background: 'none', border: 'none', color: '#2ea043', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          Forgot password?
        </button>
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div style={{ padding: '10px 14px', background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, color: '#f85149', fontSize: '0.82rem' }}>
          {errors.submit}
        </div>
      )}

      {/* Sign in button */}
      <button type="submit" disabled={loading}
        style={{ width: '100%', padding: '10px', background: loading ? '#238636' : '#2ea043', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s, box-shadow 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.8 : 1 }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3fb950' }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2ea043' }}
      >
        {loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      {/* Demo divider */}
      <div style={S.divider}>
        <div style={S.dividerLine} />
        <span style={S.dividerText}>Quick demo access</span>
        <div style={S.dividerLine} />
      </div>

      {/* Demo buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { role: 'student', label: 'Student', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
          { role: 'teacher', label: 'Teacher', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
        ].map(d => (
          <button key={d.role} type="button" onClick={() => fillDemo(d.role)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#484f58'; e.currentTarget.style.color = '#e6edf3' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.color = '#8b949e' }}
          >
            {d.icon} {d.label}
          </button>
        ))}
      </div>

      {/* Toggle */}
      <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid #21262d' }}>
        <span style={{ color: '#8b949e', fontSize: '0.82rem' }}>Don't have an account? </span>
        <button type="button" onClick={onToggle}
          style={{ background: 'none', border: 'none', color: '#2ea043', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Create account
        </button>
      </div>
    </form>
  )
}

export default LoginForm
