export type Module = {
  path: string
  main: any
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
