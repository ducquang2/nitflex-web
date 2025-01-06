export type Module = {
  path: string
  main: () => JSX.Element
}

export type Theme = 'lemonade' | 'coffee'

export type Pagination<T> = {
  page: number
  totalPages: number
  totalResults: number
  results: T[]
}

export type Movie = {
  id: number
  backdrop_path: string
  title: string
  original_title: string
  overview: string
  poster_path: string
  media_type: string
  adult: boolean
  original_language: string
  genre_ids: Array<number>
  popularity: number
  release_date: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type Genre = {
  ID: number
  Name: string
}

export type Collection = {
  ID: number
  Name: string
  poster_path: string
  backdrop_path: string
}

export type ProductionCompany = {
  ID: number
  Name: string
}

export type ProductionCountry = {
  iso_3166_1: string
  Name: string
}

export type SpokenLanguage = {
  iso_639_1: string
  Name: string
}

export type MovieInfo = {
  Adult: boolean
  Budget: number
  Genres: Genre[]
  Homepage: string
  ID: number
  Overview: string
  Popularity: number
  Revenue: number
  Runtime: number
  Status: string
  Tagline: string
  Title: string
  Video: boolean
  backdrop_path: string
  belongs_to_collection: Collection
  imdb_id: string
  original_language: string
  original_title: string
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  spoken_languages: SpokenLanguage[]
  vote_average: number
  vote_count: number
}

export type Cast = {
  cast_id: number
  Character: string
  credit_id: string
  ID: number
  Name: string
  Order: number
  profile_path: string
}

export type Crew = {
  credit_id: string
  Department: string
  ID: number
  Job: string
  Name: string
  profile_path: string
}

export type CastInfo = {
  id: number
  name: string
  overview: string
  adult: boolean
  biography: string
  birthday: string
  deathday: string
  gender: number
  imdb_id: string
  homepage: string
  also_known_as: Array<string>
  place_of_birth: string
  profile_path: string
}

export type Review = {
  ID: string
  Author: string
  Content: string
  URL: string
}
