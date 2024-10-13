const yup = require('yup');
const {
  validateFileType,
  validateFileSize,
} = require('../utils/utilityFunctions');

const get18YearsOldDate = () => {
  const years = 18;
  const today = new Date();

  today.setFullYear(today.getFullYear() - years);

  return today;
};

const validateRegister = async (payload) => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3)
      .max(32)
      .trim()
      .matches(/^[a-zA-Z ]{3,32}$/, {
        message:
          'Please provide valid name. Avoid numbers and special characters',
      })
      .required()
      .label('Name'),
    email: yup.string().email().required().label('E-mail'),
    mobile: yup
      .string()
      .trim()
      .matches(/^[6789]\d{9}$/, {
        message: 'Please provide a valid Indian mobile number!',
      })
      .required('Provide a mobile number!')
      .label('Mobile No.'),
    dateOfBirth: yup
      .date()
      .max(get18YearsOldDate(), 'You must be at least 18 years old.')
      .required('Please provide date of birth!')
      .typeError('Please provide a valid date!')
      .label('Date of Birth'),
    password: yup.string().min(6).required().label('Password'),
  });

  try {
    const data = await schema.validate(payload);

    return {
      isValid: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      isValid: false,
      error: {
        key: error.path,
        value: error.params.originalValue,
        message: error.message,
      },
    };
  }
};

const validateLogin = async (payload) => {
  const schema = yup.object().shape({
    email: yup.string().email().required().label('E-mail'),
    password: yup.string().min(6).required().label('Password'),
  });

  try {
    const data = await schema.validate(payload);

    return {
      isValid: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      isValid: false,
      error: {
        key: error.path,
        value: error.params.originalValue,
        message: error.message,
      },
    };
  }
};

const validateUserData = async (payload) => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3)
      .max(32)
      .trim()
      .matches(/^[a-zA-Z ]{3,32}$/, {
        message:
          'Please provide valid name. Avoid numbers and special characters',
      })
      .label('Name'),
    email: yup.string().email().label('E-mail'),
    mobile: yup
      .string()
      .trim()
      .matches(/^[6789]\d{9}$/, {
        message: 'Please provide a valid Indian mobile number!',
      })
      .label('Mobile No.'),
    dateOfBirth: yup
      .date()
      .max(get18YearsOldDate(), 'You must be at least 18 years old.')
      .typeError('Please provide a valid date!')
      .label('Date of Birth'),
    password: yup.string().min(6).label('Password'),
  });

  try {
    const data = await schema.validate(payload);

    return {
      isValid: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      isValid: false,
      error: {
        key: error.path,
        value: error.params.originalValue,
        message: error.message,
      },
    };
  }
};

const isValidUserAvatar = (avatar) => {
  const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
  const allowedSizeInBytes = 2 * 1024 * 1024; // 2MB is the file (image) size limit.
  const isValidType = validateFileType(avatar, allowedTypes);
  const isValidSize = validateFileSize(avatar, allowedSizeInBytes);

  let message = null;
  if (!isValidType) message = 'Please select valid image file type!';
  else if (!isValidSize) message = 'Image file size limit is 2MB!';

  return { isValid: !message, error: message };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUserData,
  isValidUserAvatar,
};
