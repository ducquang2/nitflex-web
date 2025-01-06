import nitflexApiAxios from '@libs/axios/nitflex-api'

export const get_watch_list = async () => {
  const response = await nitflexApiAxios.get('/watchlist/')

  return response.data
}

export const get_ratings_user = async () => {
  const response = await nitflexApiAxios.get('/ratings/')

  return response.data
}

export const get_favorite_movies = async () => {
  const response = await nitflexApiAxios.get('/favorite/')

  return response.data
}

type addToWatchListParams = {
  movieId: string
}

export const add_to_watch_list = async (params: addToWatchListParams) => {
  const { movieId } = params

  const response = await nitflexApiAxios.post('/watchlist/', { movieId })

  return response.data
}

type addRatingParams = {
  movieId: string
  rating: number
}

export const add_rating = async (params: addRatingParams) => {
  const { movieId, rating } = params

  const response = await nitflexApiAxios.post('/ratings/', { movieId, rating })

  return response.data
}

type addFavoriteParams = {
  movieId: string
}

export const add_favorite = async (params: addFavoriteParams) => {
  const { movieId } = params

  const response = await nitflexApiAxios.post('/favorite/', { movieId })

  return response.data
}

export const remove_from_watch_list = async (params: addToWatchListParams) => {
  const { movieId } = params

  const response = await nitflexApiAxios.delete('/watchlist/', { data: { movieId } })

  return response.data
}

export const remove_favorite = async (params: addFavoriteParams) => {
  const { movieId } = params

  const response = await nitflexApiAxios.delete('/favorite/', { data: { movieId } })

  return response.data
}
