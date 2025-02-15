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
  Id: number
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
  Id: number
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
  Biography: string
  Birthday: string
  DeathDay: string
  Gender: number
  Id: string
  MovieCredit: { CastMovie: MovieInfo[] }
  Name: string
  PlaceOfBirth: string
  Popularity: number
  ProfilePath: string
  TmdbId: string
}

export type Review = {
  Id: string
  Author: string
  Content: string
  URL: string
}

export type User = {
  CreatedAt: string
  Email: string
  FavoriteList: number[]
  Id: string
  UpdatedAt: string
  Username: string
  Watchlist: number[]
}

export type Rating = {
  UserId: string
  MovieId: string
  Rating: number
  Movie: MovieInfo
}

export type Trailer = {
  Id: string
  Link: string
  Title: string
  Description: string
}
