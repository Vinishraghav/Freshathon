/**
 * FormValidator - A utility for form validation
 * 
 * This utility provides validation rules and functions for form inputs.
 */

// Validation rules
const rules = {
  // Text validation
  required: (value) => ({
    valid: value !== undefined && value !== null && value.toString().trim() !== '',
    message: 'This field is required'
  }),
  
  minLength: (value, min) => ({
    valid: value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  
  maxLength: (value, max) => ({
    valid: value.length <= max,
    message: `Must be no more than ${max} characters`
  }),
  
  // Email validation
  email: (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return {
      valid: regex.test(value),
      message: 'Please enter a valid email address'
    };
  },
  
  // Password validation
  password: (value) => {
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const valid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    
    let message = 'Password must:';
    if (!hasMinLength) message += ' be at least 8 characters;';
    if (!hasUppercase) message += ' have at least one uppercase letter;';
    if (!hasLowercase) message += ' have at least one lowercase letter;';
    if (!hasNumber) message += ' have at least one number;';
    if (!hasSpecialChar) message += ' have at least one special character;';
    
    return {
      valid,
      message: valid ? '' : message
    };
  },
  
  // Password confirmation validation
  passwordMatch: (value, confirmValue) => ({
    valid: value === confirmValue,
    message: 'Passwords do not match'
  }),
  
  // URL validation
  url: (value) => {
    let url;
    try {
      url = new URL(value);
    } catch (_) {
      return {
        valid: false,
        message: 'Please enter a valid URL'
      };
    }
    
    return {
      valid: url.protocol === 'http:' || url.protocol === 'https:',
      message: 'Please enter a valid URL starting with http:// or https://'
    };
  },
  
  // Number validation
  number: (value) => ({
    valid: !isNaN(Number(value)),
    message: 'Please enter a valid number'
  }),
  
  min: (value, min) => ({
    valid: Number(value) >= min,
    message: `Must be at least ${min}`
  }),
  
  max: (value, max) => ({
    valid: Number(value) <= max,
    message: `Must be no more than ${max}`
  }),
  
  // Date validation
  date: (value) => {
    const date = new Date(value);
    return {
      valid: !isNaN(date.getTime()),
      message: 'Please enter a valid date'
    };
  },
  
  futureDate: (value) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      valid: !isNaN(date.getTime()) && date >= today,
      message: 'Date must be in the future'
    };
  },
  
  pastDate: (value) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      valid: !isNaN(date.getTime()) && date < today,
      message: 'Date must be in the past'
    };
  },
  
  // Phone validation
  phone: (value) => {
    // Basic phone validation - can be customized for specific formats
    const regex = /^\+?[0-9]{10,15}$/;
    return {
      valid: regex.test(value.replace(/[\s()-]/g, '')),
      message: 'Please enter a valid phone number'
    };
  },
  
  // Custom validation with regex
  pattern: (value, pattern) => {
    const regex = new RegExp(pattern);
    return {
      valid: regex.test(value),
      message: 'Please enter a valid value'
    };
  },
  
  // File validation
  fileType: (file, allowedTypes) => {
    if (!file) {
      return {
        valid: true,
        message: ''
      };
    }
    
    const types = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
    return {
      valid: types.includes(file.type),
      message: `File must be one of the following types: ${types.join(', ')}`
    };
  },
  
  fileSize: (file, maxSizeInBytes) => {
    if (!file) {
      return {
        valid: true,
        message: ''
      };
    }
    
    return {
      valid: file.size <= maxSizeInBytes,
      message: `File size must be less than ${Math.round(maxSizeInBytes / 1024 / 1024 * 100) / 100} MB`
    };
  }
};

/**
 * Validate a single field with multiple rules
 * @param {any} value - The value to validate
 * @param {Array} fieldRules - Array of rule objects with name and params
 * @returns {Object} Validation result with isValid and errorMessage
 */
const validateField = (value, fieldRules) => {
  for (const ruleObj of fieldRules) {
    const { rule, params } = ruleObj;
    
    // Skip validation if value is empty and rule is not 'required'
    if (rule !== 'required' && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    const validationFn = rules[rule];
    if (!validationFn) {
      console.warn(`Validation rule '${rule}' not found`);
      continue;
    }
    
    const result = validationFn(value, params);
    if (!result.valid) {
      return {
        isValid: false,
        errorMessage: result.message
      };
    }
  }
  
  return {
    isValid: true,
    errorMessage: ''
  };
};

/**
 * Validate a form with multiple fields
 * @param {Object} formData - Form data object with field values
 * @param {Object} validationSchema - Schema defining validation rules for each field
 * @returns {Object} Validation results with errors and isValid
 */
const validateForm = (formData, validationSchema) => {
  const errors = {};
  let isValid = true;
  
  for (const field in validationSchema) {
    const value = formData[field];
    const fieldRules = validationSchema[field];
    
    const result = validateField(value, fieldRules);
    if (!result.isValid) {
      errors[field] = result.errorMessage;
      isValid = false;
    }
  }
  
  return {
    errors,
    isValid
  };
};

/**
 * Get CSS classes for form control based on validation state
 * @param {boolean} touched - Whether the field has been touched
 * @param {boolean} isValid - Whether the field is valid
 * @param {string} baseClass - Base CSS class
 * @returns {string} CSS classes
 */
const getControlClass = (touched, isValid, baseClass = 'form-control') => {
  if (!touched) return baseClass;
  return isValid ? `${baseClass} is-valid` : `${baseClass} is-invalid`;
};

// Export validation functions and rules
export default {
  rules,
  validateField,
  validateForm,
  getControlClass
};
