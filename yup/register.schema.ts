import * as Yup from 'yup';

export const registerSchema = Yup.object({
  username: Yup.string().required('Please fill in your username '),
  firstName: Yup.string().required('First name required '),
  lastName: Yup.string().required('Last name required'),
  email: Yup.string().email('A valid email is required').required('Email required '),
  password: Yup.string().required('Password required'),
});
