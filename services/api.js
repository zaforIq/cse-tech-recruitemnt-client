
export async function getCandidates() {
  // calls the built-in API route
  try {
    const response = await fetch(`/api/candidates`, {
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
  try {
    const response = await fetch(`/api/candidates/${id}`, {
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

export async function verifyAccess(id) {
  try {
    const response = await fetch(`/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying access:', error);
    return { success: false, message: 'Server error connection failed' };
  }
}
