export interface Origin {
  name: string
  url: string
}

export interface Location {
  name: string
  url: string
}

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown'

export interface Character {
  id: number
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type: string
  gender: CharacterGender
  origin: Origin
  location: Location
  image: string
  episode: string[]
  url: string
  created: string
}

export interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface LocationItem {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}

export interface ApiInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface ApiResponse<T> {
  info: ApiInfo
  results: T[]
}

export interface FavoriteItem {
  id: number
  type: 'character' | 'episode' | 'location'
  name: string
  image?: string
}
