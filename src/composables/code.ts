export async function fetchData(language: string, code: string) {
  try {
    const apiUrl = import.meta.env.VITE_APP_DYNO_CODE_URL
    if (!apiUrl) {
      throw new Error('API URL is not defined'); 
    }
    const endpoint = 'execute';
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language, code })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    if (data.error !== '') throw data.error
    return data.output
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
