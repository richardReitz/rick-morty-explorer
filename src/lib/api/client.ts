import axios from 'axios'
import type { ApiResponse } from '../types'

const apiClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10000,
})

const EMPTY_RESPONSE: ApiResponse<never> = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

export function emptyOnNotFound<T>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return EMPTY_RESPONSE as ApiResponse<T>
  }
  throw error
}

export default apiClient
