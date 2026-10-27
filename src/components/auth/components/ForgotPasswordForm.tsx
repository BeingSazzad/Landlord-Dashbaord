import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  Lock,
  ShieldCheck,
  Mail,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Step = 'email' | 'otp' | 'reset' | 'success'

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('admin@landlordhq.co.uk')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(45)

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [step, resendTimer])

  // Handle Step 1: Submit Email
  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !email.includes('@')) {
      setError('Please provide a valid administrator email address.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      setResendTimer(45)
    }, 600)
  }

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-advance focus to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pastedData) return
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ''
    }
    setOtp(newOtp)
    const focusIdx = Math.min(pastedData.length, 5)
    otpInputsRef.current[focusIdx]?.focus()
  }

  // Handle Step 2: Submit OTP
  const handleOtpSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const fullOtp = otp.join('')
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of your verification code.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('reset')
    }, 600)
  }

  // Handle Step 3: Reset Password
  const handleResetSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 700)
  }

  return (
    <div className="login-split">
      {/* Left Branding Side with Image & Gradient Overlay */}
      <aside className="relative hidden w-[48%] flex-col justify-between overflow-hidden p-10 xl:p-14 text-white lg:flex">
        {/* Background Property Image */}
        <img
          src="/login-bg.jpg"
          alt="UK Modern Residential Architecture"
          className="absolute inset-0 h-full w-full object-cover object-center scale-105"
        />

        {/* Deep Sapphire Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/80 to-brand-900/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1.5px]" />
        <div className="absolute inset-0 bg-black/25" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-lg font-extrabold tracking-tight">Landlord HQ</p>
              <p className="text-[11px] font-bold tracking-widest text-blue-200 uppercase">
                ADMIN PORTAL
              </p>
            </div>
          </div>
        </div>

        {/* Center / Middle Content */}
        <div className="relative z-10 my-auto max-w-lg py-12">
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] text-white tracking-tight">
            Security &amp; Account Recovery
          </h1>

          <p className="mt-5 text-base xl:text-lg leading-relaxed text-blue-100/90 font-medium">
            Multi-factor verification protocol to safeguard administrative access and tenancy records.
          </p>
        </div>

        {/* Footer Security Badges */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-white/15 text-xs text-blue-200/80">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Restricted to authorized administrators only</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-300/70">
            <Lock className="h-3 w-3" />
            <span>256-bit TLS Encrypted</span>
          </div>
        </div>
      </aside>

      {/* Right Form Card Side */}
      <div className="login-form-side">
        <div className="login-form-card">
          {/* STEP 1: Enter Email */}
          {step === 'email' && (
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot password?</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                No problem. Enter your admin email and we'll send a 6-digit OTP verification code.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleEmailSubmit}>
                <Input
                  name="email"
                  type="email"
                  label="Registered Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@landlordhq.co.uk"
                  required
                />

                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                ) : null}

                <div className="rounded-xl border border-brand-100 bg-brand-50/70 px-3.5 py-2.5 text-xs text-brand-800">
                  <span className="font-semibold">Demo Hint:</span> Use <code>admin@landlordhq.co.uk</code> to proceed.
                </div>

                <Button type="submit" fullWidth loading={loading}>
                  Send Verification Code
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: Enter 6-Digit OTP */}
          {step === 'otp' && (
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
                <KeyRound className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Enter OTP Code</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                We sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleOtpSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2.5">
                    6-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="h-12 w-11 sm:w-12 text-center text-xl font-bold text-slate-900 rounded-xl border border-slate-200 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                      />
                    ))}
                  </div>
                </div>

                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                ) : null}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {resendTimer > 0 ? (
                      `Resend code in 00:${resendTimer < 10 ? `0${resendTimer}` : resendTimer}`
                    ) : (
                      <button
                        type="button"
                        onClick={() => setResendTimer(45)}
                        className="font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" /> Resend OTP
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="font-medium text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    Change email
                  </button>
                </div>

                <div className="rounded-xl border border-brand-100 bg-brand-50/70 px-3.5 py-2.5 text-xs text-brand-800">
                  <span className="font-semibold">Demo Code:</span> Enter any 6 numbers (e.g. <code>482910</code>)
                </div>

                <Button type="submit" fullWidth loading={loading}>
                  Verify OTP Code
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel and Return to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 'reset' && (
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Set New Password</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Create a new secure password for administrator account <span className="font-semibold text-slate-700">{email}</span>.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleResetSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>

                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                ) : null}

                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${newPassword && newPassword === confirmPassword ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>Passwords match</span>
                  </div>
                </div>

                <Button type="submit" fullWidth loading={loading}>
                  Reset Password
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel and Return to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* STEP 4: Success confirmation */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Password Reset Successfully!
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                Your administrator credentials have been securely updated. You can now log in with your new password.
              </p>

              <div className="mt-8">
                <Button fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                  Proceed to Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
