
export async function getCandidates() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('API URL is not defined');
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/candidates`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

export async function getCandidateById(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('API URL is not defined');
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/candidates/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch candidate: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching candidate with id ${id}:`, error);
    return null;
  }
}
