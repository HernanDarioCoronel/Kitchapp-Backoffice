import { JSX } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from './hooks/useAuth'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { Label } from '@renderer/components/ui/label'

interface LoginFormInputs {
  username: string
  password: string
}

function Login(): JSX.Element {
  const { register, handleSubmit } = useForm<LoginFormInputs>()
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginFormInputs) => {
      console.log('Enviando credenciales:', credentials)
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas o error en el servidor')
      }

      return response.json() // Asumimos que devuelve { token: "..." }
    },
    onSuccess: (data) => {
      login(data.token || 'token-generico')
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
