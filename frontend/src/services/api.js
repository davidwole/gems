// API base URL
// export const API_URL = "http://localhost:5000/api"; // Or your API URL
export const API_URL = "https://gems-0q55.onrender.com/api"; // Or your API URL

export const connect = async () => {
  const response = await fetch(`${API_URL}/connect`);
  const data = await response.json();
  console.log(data.message);
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Check for suspension status
    if (response.status === 403 && data.msg.includes("suspended")) {
      return {
        error: data.msg,
        isSuspended: true,
      };
    }

    // Handle other errors
    if (!response.ok) {
      return { error: data.msg || "Login failed" };
    }

    return data;
  } catch (error) {
    return { error: "Network error occurred" };
  }
};

// Add authorization header to requests
export const authHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getBranches = async (token) => {
  try {
    const response = await fetch(`${API_URL}/branches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch branches");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching branches:", error);
    return null;
  }
};

export const getBranchById = async (branchId, token) => {
  try {
    const response = await fetch(`${API_URL}/branches/${branchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch branch");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching branch:", error);
    return null;
  }
};

export const getUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

export const createUser = async (userData, token) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to connect to server" };
  }
};

export const createBranch = async (branchData, token) => {
  try {
    const response = await fetch(`${API_URL}/branches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(branchData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating branch:", error);
    return { error: "Failed to connect to server" };
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to connect to server" };
  }
};

export const toggleUserSuspension = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/suspend`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error toggling user suspension:", error);
    return { error: "Failed to connect to server" };
  }
};

// Add these to your existing api.js file

// Get handbook info (metadata)
export const getHandbookInfo = async (branchId, type, token) => {
  try {
    const response = await fetch(
      `${API_URL}/handbooks/info/${branchId}/${type}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No handbook found, which is a valid state
      }
      throw new Error("Failed to fetch handbook info");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching handbook info:", error);
    return null;
  }
};

// Upload a handbook
export const uploadHandbook = async (branchId, type, file, token) => {
  try {
    const formData = new FormData();
    formData.append("handbook", file);

    const response = await fetch(`${API_URL}/handbooks/${branchId}/${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || "Failed to upload handbook");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading handbook:", error);
    throw error;
  }
};

// Delete a handbook
export const deleteHandbook = async (branchId, type, token) => {
  try {
    const response = await fetch(`${API_URL}/handbooks/${branchId}/${type}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete handbook");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting handbook:", error);
    throw error;
  }
};

export const registerParent = async (parentData) => {
  try {
    const response = await fetch(`${API_URL}/parents/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    return await response.json();
  } catch (error) {
    console.error("Parent registration error:", error);
    throw error;
  }
};

export const getHandbook = async (branchId, type, token) => {
  try {
    const response = await fetch(`${API_URL}/handbooks/${branchId}/${type}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch handbook");
    }

    return await response.blob();
  } catch (error) {
    console.error("Error fetching handbook:", error);
    throw error;
  }
};

export const submitJobApplication = async (applicationData, token) => {
  try {
    // API endpoint for job applications
    const endpoint = `${API_URL}/job-applications`;

    // Prepare headers with authentication token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Make the POST request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(applicationData),
    });

    // Parse the JSON response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit job application");
    }

    return data;
  } catch (error) {
    console.error("Error submitting job application:", error);
    throw error;
  }
};

export const submitEnrollmentForm = async (formData) => {
  try {
    // Configure request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store JWT in localStorage
      },
      body: JSON.stringify(formData),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/enrollment-forms`, options);

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit enrollment form");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

export const signEnrollmentForm = async (signature, id) => {
  try {
    // Configure request options
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store JWT in localStorage
      },
      body: JSON.stringify(signature),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/enrollment-forms/${id}`, options);

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit enrollment form");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

export const getJobApplicationsByBranch = async (branchId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/job-applications/branch/${branchId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { success: false, error: error.message };
  }
};
export const getApplication = async (applicationId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/job-applications/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching applications:", error);
    return { success: false, error: error.message };
  }
};

export const getReviews = async (token, branch) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, error: error.message };
  }
};

export const createReview = async (reviewData, token) => {
  try {
    // Configure request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/reviews/`, options);

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit enrollment form");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting enrollment form:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

export const deleteReview = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to connect to server" };
  }
};

export const editReview = async (id, body, token) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    console.error("Error editing review:", error);
    return { error: "Failed to connect to server" };
  }
};

export const upgradeToL6 = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/upgrade`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error upgrading user:", error);
    return { error: "Failed to connect to server" };
  }
};
