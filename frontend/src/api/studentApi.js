/**
 * Resolves the backend base URL dynamically:
 * - When deployed on Render or provided via VITE_API_BASE_URL: uses the remote URL
 * - In local development (when unset): uses relative path '' so Vite's dev proxy forwards to localhost:8080
 */
function getApiRoot() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    const withoutProto = clean.replace(/^https?:\/\//i, '');
    if (!withoutProto.includes('.') && !withoutProto.includes('localhost')) {
      clean = `https://${withoutProto}.onrender.com`;
    } else if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }
  return '';
}

const BASE_URL = `${getApiRoot()}/manuntag/students`;

/**
 * Handle API responses and extract JSON data or error messages.
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText;
    try {
      const parsed = JSON.parse(errorText);
      message = parsed.message || parsed.error || errorText;
    } catch {
      // not JSON formatted error, use text as is
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

export const studentApi = {
  /**
   * Fetch all students
   */
  async getAll() {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Fetch a single student by ID
   */
  async getById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  /**
   * Create a new student
   * @param {{ firstname: string, lastname: string, course: string, section: string }} student
   */
  async create(student) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(student),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing student
   * @param {number|string} id
   * @param {{ firstname: string, lastname: string, course: string, section: string }} student
   */
  async update(id, student) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(student),
    });
    return handleResponse(response);
  },

  /**
   * Delete a student by ID
   * @param {number|string} id
   */
  async delete(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
