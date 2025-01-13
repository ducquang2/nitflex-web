import nitflexApiAxios from '@libs/axios/nitflex-api'
import { Genre, MovieInfo, Pagination, Review } from '@libs/utils/types'
import axios from 'axios'

type getMoviesParams = {
  query?: string
  page?: number
  genres?: number
  min_rating?: number
  max_rating?: number
  release_date_gte?: string
  release_date_lte?: string
  actors?: string
}

const GEMINI = import.meta.env.VITE_GEMINI

export const get_movies = async (params: getMoviesParams) => {
  const { query, page, genres, min_rating, max_rating, release_date_gte, release_date_lte, actors } = params

  const searchParams = new URLSearchParams()

  if (query) searchParams.append('query', query)
  if (genres) searchParams.append('genres', genres.toString())
  if (min_rating) searchParams.append('min_rating', min_rating.toString())
  if (max_rating) searchParams.append('max_rating', max_rating.toString())
  if (release_date_gte) searchParams.append('release_date_gte', release_date_gte)
  if (release_date_lte) searchParams.append('release_date_lte', release_date_lte)
  if (actors) searchParams.append('actors', actors)
  if (page) searchParams.append('page', page.toString())

  const response = await nitflexApiAxios.get(`/movies?${searchParams.toString()}`)

  return {
    results: response.data.data,
    page: response.data.Page || 0,
    totalPages: response.data.total_pages || 0,
    totalResults: response.data.total_results || 0,
  } as Pagination<MovieInfo>
}

type getMovieParams = {
  id: string
}

export const get_movie = async (params: getMovieParams) => {
  const { id } = params
  if (id) {
    const response = await nitflexApiAxios.get(`/movies/${id}`)

    const responeMovie = response.data.data as MovieInfo

    return responeMovie
  }
}

type getTrendingMoviesParams = {
  time_window: 'day' | 'week'
}

export const get_trending_movies = async (params: getTrendingMoviesParams) => {
  const { time_window } = params
  const response = await nitflexApiAxios.get(`/movies/trending?time_window=${time_window}`)

  const responeMovies = response.data.data as MovieInfo[]

  return responeMovies
}

export const get_popular_movies = async () => {
  const response = await nitflexApiAxios.get('/movies/popular')

  const responeMovies = response.data.data as MovieInfo[]

  return responeMovies
}

export const get_upcoming_movies = async () => {
  const response = await nitflexApiAxios.get('/movies/upcoming')

  const responeMovies = response.data.data

  return {
    results: responeMovies.Results,
    page: responeMovies.Page || 0,
    totalPages: responeMovies.total_pages || 0,
    totalResults: responeMovies.total_results || 0,
  } as Pagination<MovieInfo>
}

type getMovieReviewParams = {
  id: string
}

export const get_movie_reviews = async (params: getMovieReviewParams) => {
  const { id } = params
  if (id) {
    const response = await nitflexApiAxios.get(`/reviews/${id}`)

    const responeReviews = response.data.data

    return responeReviews as Review[]
  }
}

type addReviewParams = {
  movie_id: string
  content: string
}

export const add_review = async (params: addReviewParams) => {
  const { movie_id, content } = params

  const response = await nitflexApiAxios.post(`/reviews/`, { movie_id, content })

  return response.data
}

export const get_llm_movies = async (params: getMoviesParams) => {
  const { query } = params

  try {
    const movieIdsResponse = await axios.get('https://awd-llm.azurewebsites.net/retriever/', {
      params: { llm_api_key: GEMINI, collection_name: 'movies', query, amount: 6 },
    })

    const movieIds = movieIdsResponse.data.data.result

    if (!movieIds || movieIds.length === 0) {
      return { results: [], page: 0, totalPages: 0, totalResults: 0 }
    }

    const moviesResponse = await nitflexApiAxios.get(`/movies/list?ids=${movieIds.join(',')}`)

    return {
      results: moviesResponse.data.data,
      page: moviesResponse.data.Page || 0,
      totalPages: moviesResponse.data.total_pages || 0,
      totalResults: moviesResponse.data.total_results || 0,
    } as Pagination<MovieInfo>
  } catch (error) {
    console.error('Error fetching LLM movies:', error)
    return { results: [], page: 0, totalPages: 0, totalResults: 0 }
  }
}

export const get_genres = async () => {
  const response = await nitflexApiAxios.get('/genres')

  return response.data.data as Genre[]
}

type getTrailersParams = {
  id: string
}
export const get_trailers = async (params: getTrailersParams) => {
  const { id } = params
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: { Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_ACCESS_TOKEN },
  })

  return response.data.results
}
