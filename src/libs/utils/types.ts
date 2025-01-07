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

export type Genre = {
  ID: number
  Name: string
}

export type Collection = {
  Key: string
  Value: string
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
  BackdropPath: string
  Budget: number
  Categories: string[]
  Credits: {
    Id: string
    Cast: Cast[]
  }
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
  BelongsToCollection: Collection
  ImdbId: string
  OriginCountry: string[]
  OriginalLanguage: string
  OriginalTitle: string
  PosterPath: string
  ProductionCompanies: ProductionCompany[]
  ProductionCountries: ProductionCountry[]
  ReleaseDate: string
  SpokenLanguages: SpokenLanguage[]
  VoteAverage: number
  VoteCount: number
  TmdbId: number
}

export type Cast = {
  CastId: number
  Character: string
  CreditId: string
  Id: number
  Name: string
  Order: number
  ProfilePath: string
  Adult: boolean
  Gender: number
  KnownForDepartment: string
  OriginalName: string
  Popularity: string
}

export type CastInfo = {
  Birthday: string
  DeathDay: string
  Gender: number
  Id: string
  MovieCredit: { CastMovie: any[] }
  Name: string
  PlaceOfBirth: string
  Popularity: number
  ProfilePath: string
  TmdbId: string
}

export type Review = {
  ID: string
  Author: string
  Content: string
  URL: string
}
