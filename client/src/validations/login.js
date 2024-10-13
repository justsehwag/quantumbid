import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email().required().label('E-mail'),
  password: yup.string().min(6).required().label('Password'),
});

export default schema;
