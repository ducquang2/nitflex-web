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
