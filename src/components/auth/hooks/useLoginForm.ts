import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/services/endpoints/authApi'
import { setCredentials } from '@/components/auth/store/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { ROUTES } from '@/constants/routes'

export function useLoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = useState('')

  const submit = async (email: string, password: string) => {
    setError('')
    const result = await login({ email, password })
    if ('data' in result && result.data) {
      dispatch(setCredentials({ token: result.data.token, user: result.data.user }))
      navigate(ROUTES.DASHBOARD)
      return
    }
    setError('Invalid email or password')
  }

  return { submit, isLoading, error }
}
