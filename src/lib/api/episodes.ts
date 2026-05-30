import apiClient, { emptyOnNotFound } from './client'
import type { ApiResponse, Episode } from '../types'

export async function getEpisodes(
  page: number,
  name?: string
): Promise<ApiResponse<Episode>> {
  const params: Record<string, string | number> = { page }
  if (name) params.name = name
  return apiClient
    .get<ApiResponse<Episode>>('/episode', { params })
    .then((r) => r.data)
    .catch(emptyOnNotFound<Episode>)
}

export async function getEpisode(id: number): Promise<Episode> {
  const { data } = await apiClient.get<Episode>(`/episode/${id}`)
  return data
}
