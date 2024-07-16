export function isValidFullName(text: string) {
  const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/

  if (!text) {
    return {
      status: false,
      message: 'Full name cannot be empty.',
    }
  } else if (!nameRegex.test(text)) {
    return {
      status: false,
      message: 'Please enter a valid full name.',
    }
  } else {
    return {
      status: true,
      message: 'Full name is valid.',
    }
  }
}

export function isValidPhoneNumber(text: string) {
  const phoneRegex = /^[0-9]{8,15}$/

  if (!text) {
    return {
      status: false,
      message: 'Phone number cannot be empty.',
    }
  } else if (!phoneRegex.test(text)) {
    return {
      status: false,
      message: 'Please enter a valid phone number.',
    }
  } else {
    return {
      status: true,
      message: 'Phone number is valid.',
    }
  }
}

export function isValidUserName(text: string) {
  // Check if the text meets the criteria for a valid username
  const alphanumericRegex = /^[a-zA-Z0-9]+$/
  const minLength = 4
  const maxLength = 50

  if (!text) {
    return {
      status: false,
      message: 'Username cannot be empty.',
    }
  } else if (text.length < minLength || text.length > maxLength) {
    return {
      status: false,
      message: `Username must be between ${minLength} and ${maxLength} characters long.`,
    }
  } else if (!alphanumericRegex.test(text)) {
    return {
      status: false,
      message: 'Username can only contain alphanumeric characters.',
    }
  } else {
    return {
      status: true,
      message: 'Username is valid.',
    }
  }
}

// Validate OTP input. it is a 6 digit number
export function isValidOTP(text: string) {
  const otpRegex = /^[0-9]{6}$/

  if (!text) {
    return {
      status: false,
      message: 'Please enter a valid OTP.',
    }
  } else if (!otpRegex.test(text)) {
    return {
      status: false,
      message: 'Please enter a valid OTP.',
    }
  } else {
    return {
      status: true,
      message: 'OTP is valid.',
    }
  }
}

export function isValidEmail(text: string) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  if (!text) {
    return {
      status: false,
      message: 'Email cannot be empty.',
    }
  } else if (!emailRegex.test(text)) {
    return {
      status: false,
      message: 'Please enter a valid email.',
    }
  } else {
    return {
      status: true,
      message: 'Email is valid.',
    }
  }
}
