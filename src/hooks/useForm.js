import { useState, useEffect, useCallback } from "react";
import FormValidator from "../utils/FormValidator";

/**
 * useForm - A custom hook for managing form state and validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation schema for form fields
 * @param {Function} onSubmit - Function to call on form submission
 * @param {Object} options - Additional options
 * @returns {Object} Form state and handlers
 */
const useForm = (
  initialValues = {},
  validationSchema = {},
  onSubmit = () => {},
  options = {}
) => {
  // Default options
  const defaultOptions = {
    validateOnChange: false,
    validateOnBlur: true,
    validateOnSubmit: true,
    resetOnSubmit: false
  };
  
  const formOptions = { ...defaultOptions, ...options };
  
  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Validate the entire form
  const validateForm = useCallback(() => {
    const result = FormValidator.validateForm(values, validationSchema);
    setErrors(result.errors);
    setIsValid(result.isValid);
    return result.isValid;
  }, [values, validationSchema]);
  
  // Validate a single field
  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return true;
    
    const result = FormValidator.validateField(value, validationSchema[name]);
    setErrors(prev => ({
      ...prev,
      [name]: result.isValid ? undefined : result.errorMessage
    }));
    
    return result.isValid;
  }, [validationSchema]);
  
  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    setIsDirty(true);
    
    if (formOptions.validateOnChange) {
      validateField(name, inputValue);
    }
  }, [formOptions.validateOnChange, validateField]);
  
  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (formOptions.validateOnBlur) {
      validateField(name, values[name]);
    }
  }, [formOptions.validateOnBlur, validateField, values]);
  
  // Set a specific field value
  const setFieldValue = useCallback((name, value, shouldValidate = formOptions.validateOnChange) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsDirty(true);
    
    if (shouldValidate) {
      validateField(name, value);
    }
  }, [formOptions.validateOnChange, validateField]);
  
  // Set a specific field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);
  
  // Set a field as touched
  const setFieldTouched = useCallback((name, isTouched = true, shouldValidate = formOptions.validateOnBlur) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
    
    if (isTouched && shouldValidate) {
      validateField(name, values[name]);
    }
  }, [formOptions.validateOnBlur, validateField, values]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate form if needed
    let formIsValid = true;
    if (formOptions.validateOnSubmit) {
      formIsValid = validateForm();
    }
    
    if (!formIsValid) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      
      if (formOptions.resetOnSubmit) {
        resetForm();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formOptions.validateOnSubmit, formOptions.resetOnSubmit, validateForm, onSubmit, values, validationSchema]);
  
  // Reset the form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);
  
  // Update form values when initialValues change
  useEffect(() => {
    if (!isDirty) {
      setValues(initialValues);
    }
  }, [initialValues, isDirty]);
  
  // Return form state and handlers
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm
  };
};

export default useForm;
