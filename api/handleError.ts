export const handleError = (error: any) => {
  console.log(error.message);
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return { message: "An unexpected error occurred" };
};
