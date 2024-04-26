import type { ExecuteCodeRequest, ExecuteCodeResponse } from "@/types";

export async function fetchData(requestDto: ExecuteCodeRequest): Promise<string> {
  const apiUrl = import.meta.env.VITE_APP_DYNO_CODE_URL;
  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }
  const endpoint = 'execute';
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestDto)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData: ExecuteCodeResponse = await response.json();

    if (responseData.error && responseData.error !== '') {
      throw new Error(responseData.error);
    }

    return responseData.output;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
