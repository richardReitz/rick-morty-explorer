import apiClient from './client'
import type { ApiResponse, Character } from '../types'

export async function getCharacters(
  page: number,
  name?: string
): Promise<ApiResponse<Character>> {
  const params: Record<string, string | number> = { page }
  if (name) params.name = name
  const { data } = await apiClient.get<ApiResponse<Character>>('/character', { params })
  return data
}

export async function getCharacter(id: number): Promise<Character> {
  const { data } = await apiClient.get<Character>(`/character/${id}`)
  return data
}
