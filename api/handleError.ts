export const handleError = (error: any) => {
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return { message: 'An unexpected error occurred' };
};
