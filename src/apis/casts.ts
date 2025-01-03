import nitflexApiAxios from '@libs/axios/nitflex-api'

type getCastsParams = {
  movieId: string
}

export const get_casts = async (params: getCastsParams) => {
  const { movieId } = params
  if (!movieId) return

  const response = await nitflexApiAxios.get(`/casts?movie_id=${movieId}`)

  const responeCasts = response.data

  return responeCasts
}

type getCastParams = {
  id: string
}
export const get_cast = async (params: getCastParams) => {
  const { id } = params
  if (!id) return

  const response = await nitflexApiAxios.get(`/casts/${id}`)

  const responeCast = response.data

  return responeCast
}
