import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
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
}

function InputIcon({ children }) {
  return <span style={S.icon}>{children}</span>
}

function pwStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^a-zA-Z\d]/.test(pw)) s++
  return s
}

const PW_COLORS = ['#30363d', '#f85149', '#e3b341', '#2ea043', '#3fb950']
const PW_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']

const RegisterForm = ({ onToggle }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' })
  const [showPw, setShowPw] = useState(false)
  const [showCPw, setShowCPw] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await googleLogin(tokenResponse.access_token, form.role)
        toast.success(`Welcome, ${user.name}`)
        navigate(user.role === 'student' ? '/student' : '/teacher')
      } catch {
        toast.error('Google sign up failed')
      }
    },
    onError: () => toast.error('Google sign up failed'),
  })

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!acceptTerms) e.terms = 'You must accept the terms'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { confirmPassword, ...data } = form
      const user = await register(data)
      toast.success('Account created successfully')
      navigate(user.role === 'student' ? '/student' : '/teacher')
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      setErrors({ submit: msg })
    } finally {
      setLoading(false)
    }
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#2ea043'; e.target.style.boxShadow = '0 0 0 3px rgba(46,160,67,0.15)' }
  const blurStyle = (e, err) => { e.target.style.borderColor = err ? '#f85149' : '#30363d'; e.target.style.boxShadow = 'none' }

  const strength = pwStrength(form.password)

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Full name */}
      <div>
        <label style={S.label}>Full name</label>
        <div style={S.inputWrap}>
          <InputIcon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></InputIcon>
          <input type="text" value={form.name} placeholder="Your full name" style={S.input(errors.name)}
            onChange={e => set('name', e.target.value)} onFocus={focusStyle} onBlur={e => blurStyle(e, errors.name)} />
        </div>
        {errors.name && <p style={S.errText}>{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label style={S.label}>Email address</label>
        <div style={S.inputWrap}>
          <InputIcon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></InputIcon>
          <input type="email" value={form.email} placeholder="you@example.com" style={S.input(errors.email)}
            onChange={e => set('email', e.target.value)} onFocus={focusStyle} onBlur={e => blurStyle(e, errors.email)} />
        </div>
        {errors.email && <p style={S.errText}>{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label style={S.label}>Password</label>
        <div style={S.inputWrap}>
          <InputIcon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></InputIcon>
          <input type={showPw ? 'text' : 'password'} value={form.password} placeholder="••••••••"
            style={{ ...S.input(errors.password), paddingRight: 38 }}
            onChange={e => set('password', e.target.value)} onFocus={focusStyle} onBlur={e => blurStyle(e, errors.password)} />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', display: 'flex', padding: 2 }}>
            {showPw
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
        {errors.password && <p style={S.errText}>{errors.password}</p>}
        {/* Strength bar */}
        {form.password && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1,2,3,4].map(l => (
                <div key={l} style={{ flex: 1, height: 3, borderRadius: 2, background: l <= strength ? PW_COLORS[strength] : '#21262d', transition: 'background 0.2s' }} />
              ))}
            </div>
            <span style={{ color: PW_COLORS[strength], fontSize: '0.72rem', fontWeight: 600 }}>{PW_LABELS[strength]}</span>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label style={S.label}>Confirm password</label>
        <div style={S.inputWrap}>
          <InputIcon><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></InputIcon>
          <input type={showCPw ? 'text' : 'password'} value={form.confirmPassword} placeholder="••••••••"
            style={{ ...S.input(errors.confirmPassword), paddingRight: 38 }}
            onChange={e => set('confirmPassword', e.target.value)} onFocus={focusStyle} onBlur={e => blurStyle(e, errors.confirmPassword)} />
          <button type="button" onClick={() => setShowCPw(v => !v)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', display: 'flex', padding: 2 }}>
            {showCPw
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
          {/* match indicator */}
          {form.confirmPassword && (
            <span style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)' }}>
              {form.password === form.confirmPassword
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
            </span>
          )}
        </div>
        {errors.confirmPassword && <p style={S.errText}>{errors.confirmPassword}</p>}
      </div>

      {/* Role selector */}
      <div>
        <label style={S.label}>I am a</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { val: 'student', label: 'Student', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
            { val: 'teacher', label: 'Teacher', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
          ].map(r => {
            const active = form.role === r.val
            return (
              <button key={r.val} type="button" onClick={() => set('role', r.val)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px', borderRadius: 6, border: `1px solid ${active ? '#2ea043' : '#30363d'}`, background: active ? 'rgba(46,160,67,0.1)' : '#0d1117', color: active ? '#3fb950' : '#8b949e', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                {r.icon} {r.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Terms */}
      <div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={acceptTerms} onChange={e => { setAcceptTerms(e.target.checked); setErrors(p => ({ ...p, terms: '' })) }}
            style={{ width: 14, height: 14, marginTop: 2, accentColor: '#2ea043', cursor: 'pointer', flexShrink: 0 }} />
          <span style={{ color: '#8b949e', fontSize: '0.8rem', lineHeight: 1.5 }}>
            I agree to the{' '}
            <button type="button" style={{ background: 'none', border: 'none', color: '#2ea043', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Terms of Service</button>
            {' '}and{' '}
            <button type="button" style={{ background: 'none', border: 'none', color: '#2ea043', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Privacy Policy</button>
          </span>
        </label>
        {errors.terms && <p style={S.errText}>{errors.terms}</p>}
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div style={{ padding: '10px 14px', background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, color: '#f85149', fontSize: '0.82rem' }}>
          {errors.submit}
        </div>
      )}

      {/* Create account button */}
      <button type="submit" disabled={loading}
        style={{ width: '100%', padding: '10px', background: '#2ea043', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.8 : 1 }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3fb950' }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2ea043' }}
      >
        {loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      {/* Google Sign Up */}
      <button type="button" onClick={() => handleGoogleRegister()}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b949e'; e.currentTarget.style.background = '#161b22' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#30363d'; e.currentTarget.style.background = '#0d1117' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      {/* Toggle */}
      <div style={{ textAlign: 'center', paddingTop: 14, borderTop: '1px solid #21262d' }}>
        <span style={{ color: '#8b949e', fontSize: '0.82rem' }}>Already have an account? </span>
        <button type="button" onClick={onToggle}
          style={{ background: 'none', border: 'none', color: '#2ea043', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign in
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
