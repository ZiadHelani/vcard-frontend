// Validation rules for forms throughout the application

// Basic validation rules
export const validationRules = {
  // Required field validation
  required: (fieldName = 'Field') => [(v) => !!v || `${fieldName} is required`],

  // Email validation
  email: [
    (v) => !!v || 'Email is required',
    (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
    (v) => (v && v.length <= 255) || 'Email must be less than 255 characters',
  ],

  // Password validation
  password: [
    (v) => !!v || 'Password is required',
    (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
    (v) => (v && v.length <= 255) || 'Password must be less than 255 characters',
    (v) => /(?=.*[a-z])/.test(v) || 'Password must contain at least one lowercase letter',
    (v) => /(?=.*[A-Z])/.test(v) || 'Password must contain at least one uppercase letter',
    (v) => /(?=.*\d)/.test(v) || 'Password must contain at least one number',
  ],

  // Simple password (less strict for login)
  simplePassword: [
    (v) => !!v || 'Password is required',
    (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
  ],

  // Password confirmation
  passwordConfirmation: (password) => [
    (v) => !!v || 'Password confirmation is required',
    (v) => v === password || 'Passwords do not match',
  ],

  // Name validation
  name: [
    (v) => !!v || 'Name is required',
    (v) => (v && v.length >= 2) || 'Name must be at least 2 characters',
    (v) => (v && v.length <= 100) || 'Name must be less than 100 characters',
    (v) =>
      /^[a-zA-Z\s'-]+$/.test(v) ||
      'Name can only contain letters, spaces, hyphens, and apostrophes',
  ],

  // Phone number validation
  phone: [
    (v) => !!v || 'Phone number is required',
    (v) => /^(\+)?[0-9\s\-()]{7,}$/.test(v) || 'Enter a valid phone number',
    (v) => (v && v.length <= 20) || 'Phone number must be less than 20 characters',
  ],

  // Optional phone (not required)
  phoneOptional: [
    (v) => !v || /^(\+)?[0-9\s\-()]{7,}$/.test(v) || 'Enter a valid phone number',
    (v) => !v || (v && v.length <= 20) || 'Phone number must be less than 20 characters',
  ],

  // URL validation
  url: [
    (v) => !!v || 'URL is required',
    (v) => {
      try {
        new URL(v)
        return true
      } catch {
        return 'Enter a valid URL'
      }
    },
  ],

  // Optional URL
  urlOptional: [
    (v) => {
      if (!v) return true
      try {
        new URL(v)
        return true
      } catch {
        return 'Enter a valid URL'
      }
    },
  ],

  // Text length validation
  maxLength: (max) => [(v) => !v || v.length <= max || `Must be ${max} characters or less`],

  minLength: (min) => [(v) => !v || v.length >= min || `Must be at least ${min} characters`],

  // Number validation
  number: [(v) => !!v || 'Number is required', (v) => !isNaN(v) || 'Must be a valid number'],

  // Positive number
  positiveNumber: [
    (v) => !!v || 'Number is required',
    (v) => !isNaN(v) || 'Must be a valid number',
    (v) => parseFloat(v) > 0 || 'Must be a positive number',
  ],

  // Integer validation
  integer: [
    (v) => !!v || 'Number is required',
    (v) => Number.isInteger(Number(v)) || 'Must be a whole number',
  ],

  // Age validation
  age: [
    (v) => !!v || 'Age is required',
    (v) => !isNaN(v) || 'Age must be a number',
    (v) => (v >= 13 && v <= 120) || 'Age must be between 13 and 120',
  ],

  // Date validation
  date: [(v) => !!v || 'Date is required', (v) => !isNaN(Date.parse(v)) || 'Enter a valid date'],

  // Future date validation
  futureDate: [
    (v) => !!v || 'Date is required',
    (v) => !isNaN(Date.parse(v)) || 'Enter a valid date',
    (v) => new Date(v) > new Date() || 'Date must be in the future',
  ],

  // Past date validation
  pastDate: [
    (v) => !!v || 'Date is required',
    (v) => !isNaN(Date.parse(v)) || 'Enter a valid date',
    (v) => new Date(v) < new Date() || 'Date must be in the past',
  ],

  // File validation
  file: [(v) => !!v || 'File is required'],

  // Image file validation
  imageFile: [
    (v) => !!v || 'Image is required',
    (v) => {
      if (!v || !v.type) return 'Invalid file'
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      return allowedTypes.includes(v.type) || 'File must be an image (JPEG, PNG, GIF, or WebP)'
    },
    (v) => {
      if (!v || !v.size) return true
      const maxSize = 5 * 1024 * 1024 // 5MB
      return v.size <= maxSize || 'Image must be less than 5MB'
    },
  ],

  // Color validation (hex)
  color: [
    (v) => !!v || 'Color is required',
    (v) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || 'Enter a valid hex color',
  ],

  // Card title validation
  cardTitle: [
    (v) => !!v || 'Card title is required',
    (v) => (v && v.length >= 3) || 'Card title must be at least 3 characters',
    (v) => (v && v.length <= 100) || 'Card title must be less than 100 characters',
  ],

  // Bio/description validation
  bio: [
    (v) => !!v || 'Bio is required',
    (v) => (v && v.length >= 10) || 'Bio must be at least 10 characters',
    (v) => (v && v.length <= 500) || 'Bio must be less than 500 characters',
  ],

  // Optional bio
  bioOptional: [
    (v) => !v || (v && v.length >= 10) || 'Bio must be at least 10 characters',
    (v) => !v || (v && v.length <= 500) || 'Bio must be less than 500 characters',
  ],

  // Message validation (for contact forms)
  message: [
    (v) => !!v || 'Message is required',
    (v) => (v && v.length >= 10) || 'Message must be at least 10 characters',
    (v) => (v && v.length <= 1000) || 'Message must be less than 1000 characters',
  ],

  // Subject validation
  subject: [
    (v) => !!v || 'Subject is required',
    (v) => (v && v.length >= 3) || 'Subject must be at least 3 characters',
    (v) => (v && v.length <= 200) || 'Subject must be less than 200 characters',
  ],

  // Company name validation
  company: [
    (v) => !!v || 'Company name is required',
    (v) => (v && v.length >= 2) || 'Company name must be at least 2 characters',
    (v) => (v && v.length <= 100) || 'Company name must be less than 100 characters',
  ],

  // Optional company
  companyOptional: [
    (v) => !v || (v && v.length >= 2) || 'Company name must be at least 2 characters',
    (v) => !v || (v && v.length <= 100) || 'Company name must be less than 100 characters',
  ],

  // Job title validation
  jobTitle: [
    (v) => !!v || 'Job title is required',
    (v) => (v && v.length >= 2) || 'Job title must be at least 2 characters',
    (v) => (v && v.length <= 100) || 'Job title must be less than 100 characters',
  ],

  // Optional job title
  jobTitleOptional: [
    (v) => !v || (v && v.length >= 2) || 'Job title must be at least 2 characters',
    (v) => !v || (v && v.length <= 100) || 'Job title must be less than 100 characters',
  ],
  // OTP validation
  otp: [(v) => !!v || 'OTP is required', (v) => /^\d{4}$/.test(v) || 'OTP must be 4 digits'],
}

// Utility functions for validation
export const validationUtils = {
  // Check if email is valid
  isValidEmail: (email) => {
    return /.+@.+\..+/.test(email)
  },

  // Check if password is strong
  isStrongPassword: (password) => {
    return (
      password &&
      password.length >= 8 &&
      /(?=.*[a-z])/.test(password) &&
      /(?=.*[A-Z])/.test(password) &&
      /(?=.*\d)/.test(password)
    )
  },

  // Check if URL is valid
  isValidUrl: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Check if phone number is valid
  isValidPhone: (phone) => {
    return /^(\+)?[0-9\s\-()]{7,}$/.test(phone)
  },

  // Sanitize input (remove extra spaces, etc.)
  sanitizeInput: (input) => {
    return input ? input.trim().replace(/\s+/g, ' ') : ''
  },

  // Format phone number
  formatPhone: (phone) => {
    return phone ? phone.replace(/\D/g, '') : ''
  },
}

// Common validation combinations for forms
export const formValidations = {
  // Login form
  login: {
    email: validationRules.email,
    password: validationRules.simplePassword,
  },

  // Registration form
  register: {
    name: validationRules.name,
    email: validationRules.email,
    password: validationRules.password,
    passwordConfirmation: (password) => validationRules.passwordConfirmation(password),
  },

  // Profile form
  profile: {
    name: validationRules.name,
    email: validationRules.email,
    phone: validationRules.phoneOptional,
    bio: validationRules.bioOptional,
    company: validationRules.companyOptional,
    jobTitle: validationRules.jobTitleOptional,
  },

  // Card creation form
  cardCreation: {
    title: validationRules.cardTitle,
    bio: validationRules.bio,
    name: validationRules.name,
    email: validationRules.email,
    phone: validationRules.phoneOptional,
    website: validationRules.urlOptional,
  },

  // Contact form
  contact: {
    name: validationRules.name,
    email: validationRules.email,
    phone: validationRules.phoneOptional,
    subject: validationRules.subject,
    message: validationRules.message,
  },
}

export default validationRules
