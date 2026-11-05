import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/services/endpoints/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { ROUTES } from '@/constants/routes'

export function useLoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = useState('')

  const submit = async (email: string, password: string) => {
    setError('')

    try {
      // `unwrapResult` pattern — throws on RTK Query errors so we
      // can handle them in the catch block cleanly.
      const response = await login({ email, password }).unwrap()

      if (response.success && response.data) {
        const { token, refreshToken, data: user } = response.data

        dispatch(setCredentials({ token, refreshToken, user }))
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    } catch (err: unknown) {
      // RTK Query serializes HTTP errors as { status, data }
      const errorData = (err as { data?: { message?: string } })?.data
      setError(errorData?.message ?? 'Invalid email or password. Please try again.')
    }
  }

  return { submit, isLoading, error }
}
