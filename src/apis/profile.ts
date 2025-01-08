import nitflexApiAxios from '@libs/axios/nitflex-api'

export const get_watch_list = async () => {
  const response = await nitflexApiAxios.get('/watchlist/')
  console.log(response)

  return response.data
}

export const get_user_ratings = async () => {
  const response = await nitflexApiAxios.get('/ratings/')

  return response.data
}

export const get_favorite_movies = async () => {
  const response = await nitflexApiAxios.get('/favorite/')

  return response.data
}

type addToWatchListParams = {
  movie_id: string
}

export const add_to_watch_list = async (params: addToWatchListParams) => {
  const { movie_id } = params

  const response = await nitflexApiAxios.post('/watchlist/', { movie_id })

  return response.data
}

type addRatingParams = {
  movie_id: string
  rating: number
}

export const add_rating = async (params: addRatingParams) => {
  const { movie_id, rating } = params

  const response = await nitflexApiAxios.post('/ratings/', { movie_id, rating })

  return response.data
}

type addFavoriteParams = {
  movie_id: string
}

export const add_favorite = async (params: addFavoriteParams) => {
  const { movie_id } = params

  const response = await nitflexApiAxios.post('/favorite/', { movie_id })

  return response.data
}

export const remove_from_watch_list = async (params: addToWatchListParams) => {
  const { movie_id } = params

  const response = await nitflexApiAxios.delete('/watchlist/', { data: { movie_id } })

  return response.data
}

export const remove_favorite = async (params: addFavoriteParams) => {
  const { movie_id } = params

  const response = await nitflexApiAxios.delete('/favorite/', { data: { movie_id } })

  return response.data
}
