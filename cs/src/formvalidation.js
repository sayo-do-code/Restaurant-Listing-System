export const validateName = (name) => {
    // Only allow alphabets and spaces
    const pattern = /^[A-Za-z\s]+$/;
    return pattern.test(name);
  };
  
  export const validateEmail = (email) => {
    // Standard email pattern
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };
  
  export const validatePhoneNumber = (phone) => {
    // Must start with "98" and have exactly 10 digits
    const pattern = /^98\d{8}$/;
    return pattern.test(phone);
  };
  