import * as yup from 'yup';

const get18YearsOldDate = () => {
  const years = 18;
  const today = new Date();

  today.setFullYear(today.getFullYear() - years);

  return today;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3)
    .max(32)
    .trim()
    .matches(/^[a-zA-Z ]{3,32}$/, {
      message: 'Please provide valid name. Avoid numbers and special characters',
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match!')
    .required('Please re-enter your password.')
    .label('Confirm Password'),
});

export default schema;
