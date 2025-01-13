import nitflexApiAxios from '@libs/axios/nitflex-api'

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export const handle_register = async (params: RegisterParams) => {
  const response = await nitflexApiAxios.post('/register', params)
  return response
}

export type LoginParams = {
  username: string
  password: string
}

export const handle_login = async (params: LoginParams) => {
  const response = await nitflexApiAxios.post('/login', params)
  return response
}

type forgotPasswordParams = {
  email: string
}

export const forgot_password_request = async (params: forgotPasswordParams) => {
  const { email } = params

  const response = await nitflexApiAxios.post('/reset-password', { email })

  return response.data
}

type resetPasswordParams = {
  password: string
  token: string
}

export const reset_password = async (params: resetPasswordParams) => {
  const { password, token } = params

  const response = await nitflexApiAxios.post(`/update-password?token=${token}`, { password })

  return response.data
}
