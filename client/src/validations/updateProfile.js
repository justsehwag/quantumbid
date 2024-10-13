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
});

export default schema;
