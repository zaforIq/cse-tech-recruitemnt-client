
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

export async function verifyAccess(email, password) {
  try {
    const response = await fetch(`/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying access:', error);
    return { success: false, message: 'Server error connection failed' };
  }
}

export async function verifyCandidateIdentity(studentId, email) {
  try {
    const response = await fetch(`/api/auth/verify-candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying candidate:', error);
    return { success: false, message: 'Server error connection failed' };
  }
}

export async function setCandidatePassword(studentId, email, newPassword) {
  try {
    const response = await fetch(`/api/auth/set-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, email, newPassword }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting password:', error);
    return { success: false, message: 'Server error connection failed' };
  }
}

export async function updateCandidateAssessment(id, data) {
  try {
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update assessment');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating candidate assessment for ${id}:`, error);
    throw error;
  }
}
