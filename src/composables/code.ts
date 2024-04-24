export async function fetchData(language: string, code: string) {
  try {
    const response = await fetch('http://34.74.112.135/execute', {
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
    console.log(data)
    return data.output
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
