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

export const getUser = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
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

export const submitIESForm = async (formData) => {
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
    const response = await fetch(`${API_URL}/ies-forms`, options);

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

    if (response.ok) {
      window.alert("User has been upgraded to L5");
    }
  } catch (error) {
    console.error("Error upgrading user:", error);
    return { error: "Failed to connect to server" };
  }
};

// Add this to your existing api.js file

// Upload child document
// export const uploadChildDocument = async (documentData, file, token) => {
//   try {
//     const formData = new FormData();
//     formData.append("userId", documentData.user);
//     formData.append("documentType", documentData.documentType);
//     formData.append("file", file);

//     const response = await fetch(`${API_URL}/parents/upload_document`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Failed to upload document");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error uploading document:", error);
//     throw error;
//   }
// };

// Get all documents for a user
export const getUserDocuments = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/parents/documents/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { success: false, error: error.message };
  }
};

// Delete a document
export const deleteDocument = async (documentId, token) => {
  try {
    const response = await fetch(`${API_URL}/parents/documents/${documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete document");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, error: error.message };
  }
};

// Submit contact form
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit contact form");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

// Get all contacts (for admins)
export const getAllContacts = async (token) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: error.message };
  }
};

// Get contacts by branch
export const getContactsByBranch = async (branchId, token) => {
  try {
    const response = await fetch(`${API_URL}/contact/branch/${branchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch branch contacts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching branch contacts:", error);
    return { success: false, error: error.message };
  }
};

// Update contact status
export const updateContactStatus = async (contactId, status, token) => {
  try {
    const response = await fetch(`${API_URL}/contact/${contactId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update contact status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating contact status:", error);
    return { success: false, error: error.message };
  }
};

// Delete contact
export const deleteContact = async (contactId, token) => {
  try {
    const response = await fetch(`${API_URL}/contact/${contactId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { success: false, error: error.message };
  }
};

export const getEnrollmentFormsByUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/enrollment-forms/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch enrollment forms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching enrollment forms:", error);
    throw error;
  }
};

// Infant Feeding Plan API functions to add to your api.js file

// Submit infant feeding plan
export const submitInfantFeedingPlan = async (planData) => {
  try {
    // Configure request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(planData),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/infant-feeding-plans`, options);

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit infant feeding plan");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting infant feeding plan:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

// Get all infant feeding plans by current user
export const getInfantFeedingPlansByUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/infant-feeding-plans/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch infant feeding plans");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching infant feeding plans:", error);
    throw error;
  }
};

// Get infant feeding plans by branch
export const getInfantFeedingPlansByBranch = async (branchId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/infant-feeding-plans/branch/${branchId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch infant feeding plans for branch");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching infant feeding plans for branch:", error);
    throw error;
  }
};

// Get a single infant feeding plan by ID
export const getInfantFeedingPlanById = async (planId, token) => {
  try {
    const response = await fetch(`${API_URL}/infant-feeding-plans/${planId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch infant feeding plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching infant feeding plan:", error);
    throw error;
  }
};

// Update an infant feeding plan
export const updateInfantFeedingPlan = async (planId, planData, token) => {
  try {
    const response = await fetch(`${API_URL}/infant-feeding-plans/${planId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      throw new Error("Failed to update infant feeding plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating infant feeding plan:", error);
    throw error;
  }
};

// Update infant feeding plan status (for admin)
export const updateInfantFeedingPlanStatus = async (
  planId,
  statusData,
  token
) => {
  try {
    // Configure request options
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    };

    // Make the API call
    const response = await fetch(
      `${API_URL}/infant-feeding-plans/${planId}`,
      options
    );

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update infant feeding plan status"
      );
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error updating infant feeding plan status:", error);
    throw error;
  }
};

// Delete an infant feeding plan
export const deleteInfantFeedingPlan = async (planId, token) => {
  try {
    const response = await fetch(`${API_URL}/infant-feeding-plans/${planId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete infant feeding plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting infant feeding plan:", error);
    throw error;
  }
};

export const checkUserHasReviewed = async (token, user) => {
  try {
    const response = await fetch(`${API_URL}/reviews/getuser/${user}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch infant feeding plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching infant feeding plan:", error);
    throw error;
  }
};

export const updateJobApplication = async (
  applicationId,
  updateData,
  token
) => {
  try {
    const response = await fetch(
      `${API_URL}/job-applications/${applicationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update job application");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating job application:", error);
    throw error;
  }
};

export const createInfantFeedingPlan = async (planData) => {
  try {
    // Configure request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(planData),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/infant-feeding-plans`, options);

    // Parse JSON response
    const data = await response.json();

    console.log("hello");

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit infant feeding plan");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting infant feeding plan:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

export const createInfantAffidavit = async (planData) => {
  try {
    // Configure request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(planData),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/infant-affidavits`, options);

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit infant feeding plan");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting infant feeding plan:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

export const createSafeSleep = async (planData) => {
  try {
    // Configure request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(planData),
    };

    // Make the API call
    const response = await fetch(`${API_URL}/safe-sleep`, options);

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit infant feeding plan");
    }

    // Return the data
    return data;
  } catch (error) {
    console.error("Error submitting infant feeding plan:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};

const checkIESForm = async (user) => {
  try {
    const response = await fetch(`${API_URL}/ies-forms/${user}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const checkInfantFeedingPlan = async (user) => {
  try {
    const response = await fetch(`${API_URL}/infant-feeding-plans/${user}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const checkSafeSleep = async (user) => {
  try {
    const response = await fetch(`${API_URL}/safe-sleep/${user}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
const checkInfantAffidavit = async (user) => {
  try {
    const response = await fetch(`${API_URL}/infant-affidavits/${user}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const uploadChildDocument = async (documentData, token) => {
  try {
    const response = await fetch(`${API_URL}/parents/upload_document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(documentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload document");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
