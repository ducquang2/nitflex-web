import nitflexApiAxios from '@libs/axios/nitflex-api'
import { MovieInfo, Pagination, Review } from '@libs/utils/types'

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

  const responeMovies = response.data.data

  return {
    results: responeMovies.Results,
    page: responeMovies.Page,
    totalPages: responeMovies.total_pages,
    totalResults: responeMovies.total_results,
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

type getMovieReviewParams = {
  id: string
}

export const get_movie_reviews = async (params: getMovieReviewParams) => {
  const { id } = params
  if (id) {
    const response = await nitflexApiAxios.get(`/reviews/${id}`)

    const responeReviews = response.data.data

    return {
      page: responeReviews.Page,
      totalPages: responeReviews.total_pages,
      results: responeReviews.Results,
      totalResults: responeReviews.total_results,
    } as Pagination<Review>
  }
}
