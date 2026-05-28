import apiClient from './client'
import type { ApiResponse, LocationItem } from '../types'

export async function getLocations(
  page: number,
  name?: string
): Promise<ApiResponse<LocationItem>> {
  const params: Record<string, string | number> = { page }
  if (name) params.name = name
  const { data } = await apiClient.get<ApiResponse<LocationItem>>('/location', { params })
  return data
}

export async function getLocation(id: number): Promise<LocationItem> {
  const { data } = await apiClient.get<LocationItem>(`/location/${id}`)
  return data
}
