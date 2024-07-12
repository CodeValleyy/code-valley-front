import { createAxiosInstance } from '@/config/axiosInstance'
import type { ExecuteCodeResponse } from '@/types'

export async function fetchData(requestDto: FormData): Promise<ExecuteCodeResponse> {
  const endpoint = 'execute'
  const axiosInstance2 = createAxiosInstance()

  try {
    const response = await axiosInstance2.post(`/code/${endpoint}`, requestDto, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.status !== 201) {
      throw new Error('Network response was not ok')
    }

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
