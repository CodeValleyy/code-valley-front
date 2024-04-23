export async function fetchData(language: string, code: string) {
  try {
    const response = await fetch('https://34.74.112.135/execute', {
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
    return data.result
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
