import { JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { useAuth } from './hooks/useAuth'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { Label } from '@renderer/components/ui/label'

interface LoginFormInputs {
  username: string
  password: string
}

interface LoginResponse {
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

function Login(): JSX.Element {
  const { register, handleSubmit } = useForm<LoginFormInputs>()
  const { login } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginFormInputs) => {
      console.log('Enviando credenciales:', credentials)
      const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
      return data // Asumimos que devuelve { token: "..." }
    },
    onSuccess: (data) => {
      console.log('Login exitoso, token recibido:', data)
      login(data.accessToken || 'token-generico')
      navigate('/')
    },
    onError: (error: Error) => {
      alert(error.message)
    }
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    mutation.mutate(data)
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
          <Label htmlFor="username" className="pl-1">
            Contraseña:
          </Label>
          <Input type="password" id="password" {...register('password', { required: true })} />
        </div>
        <Button className="mt-4" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Iniciando sesión...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}

export default Login
