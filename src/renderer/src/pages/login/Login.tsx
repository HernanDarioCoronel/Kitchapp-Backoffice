import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { useAuth } from './hooks/useAuth'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { Label } from '@renderer/components/ui/label'

const SAVED_USERNAME_KEY = 'savedUsername'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginFormInputs extends LoginCredentials {
  rememberUsername: boolean
}

interface LoginResponse {
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

function Login(): JSX.Element {
  const savedUsername = localStorage.getItem(SAVED_USERNAME_KEY) ?? ''

  const { register, handleSubmit } = useForm<LoginFormInputs>({
    defaultValues: {
      username: savedUsername,
      rememberUsername: savedUsername !== ''
    }
  })
  const { login } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      login(data.accessToken || 'token-generico', data.refreshToken, data.expiresIn)
      navigate('/')
    },
    onError: (error: Error) => {
      alert(error.message)
    }
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = ({ rememberUsername, ...credentials }) => {
    if (rememberUsername) {
      localStorage.setItem(SAVED_USERNAME_KEY, credentials.username)
    } else {
      localStorage.removeItem(SAVED_USERNAME_KEY)
    }
    mutation.mutate(credentials)
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5 p-5 border border-foreground rounded-lg"
      >
        <h2>Iniciar Sesión</h2>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="username" className="pl-1">
            Usuario:
          </Label>
          <Input type="text" id="username" {...register('username', { required: true })} />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="password" className="pl-1">
            Contraseña:
          </Label>
          <Input type="password" id="password" {...register('password', { required: true })} />
        </div>
        <div className="flex items-center gap-x-2">
          <input type="checkbox" id="rememberUsername" {...register('rememberUsername')} />
          <Label htmlFor="rememberUsername" className="cursor-pointer font-normal">
            Recordar usuario
          </Label>
        </div>
        <Button className="mt-4" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Iniciando sesión...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}

export default Login
