// formValidation.js
import { useState } from "react";

/**
 * Validates a field value and returns an error message if invalid
 * @param {string} name - Field name
 * @param {string} value - Field value
 * @param {Object} options - Additional validation options
 * @returns {string} Error message or empty string if valid
 */
export const validateField = (name, value, options = {}) => {
  const { required = true, skipSpaceValidation = false } = options;

  let error = "";

  // Skip validation for password field by default
  if (name === "password" && !options.validatePassword) {
    // For password fields, we usually just check they're not empty
    if (required && value === "") {
      return "Password is required";
    }
    return "";
  }

  // Skip validation for optional fields
  if (!required && (value === "" || value === null || value === undefined)) {
    return "";
  }

  // Check for empty or whitespace-only content
  if (value.trim() === "") {
    error = "Field cannot be empty or contain only spaces";
  }
  // Check if the string starts with a space (if space validation is enabled)
  else if (!skipSpaceValidation && value.startsWith(" ")) {
    error = "Field cannot start with a space";
  }

  return error;
};

/**
 * Validates an entire form data object and returns errors
 * @param {Object} data - Form data object
 * @param {Object} validationConfig - Configuration for validation
 * @returns {Object} Object containing error messages for each invalid field
 */
export const validateForm = (data, validationConfig = {}) => {
  const errors = {};
  const {
    skipFields = [],
    requiredFields = Object.keys(data),
    customValidators = {},
  } = validationConfig;

  // Process each field in the form data
  Object.entries(data).forEach(([key, value]) => {
    // Skip validation for specified fields
    if (skipFields.includes(key)) {
      return;
    }

    // Apply custom validator if available
    if (customValidators[key]) {
      const customError = customValidators[key](value, data);
      if (customError) {
        errors[key] = customError;
        return;
      }
    }

    // Standard validation
    const isRequired = requiredFields.includes(key);
    if (typeof value === "string") {
      const error = validateField(key, value, { required: isRequired });
      if (error) {
        errors[key] = error;
      }
    }
  });

  return errors;
};

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationOptions - Validation options
 * @returns {Array} Array containing form state, handlers, and validation state
 */
export const useFormValidation = (initialValues, validationOptions = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field as user types
    const error = validateField(name, value, validationOptions[name]);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Check if form can be submitted
  const isFormValid = () => {
    // If there are any form errors, the form is invalid
    if (Object.values(formErrors).some((error) => error !== "")) {
      return false;
    }

    // Validate all fields
    const errors = validateForm(formData, validationOptions);
    return Object.keys(errors).length === 0;
  };

  // Validate entire form (typically called before submission)
  const validateAllFields = () => {
    const errors = validateForm(formData, validationOptions);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return [
    formData,
    setFormData,
    {
      handleChange,
      formErrors,
      setFormErrors,
      isFormValid,
      validateAllFields,
      isSubmitting,
      setIsSubmitting,
    },
  ];
};
