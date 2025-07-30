export const handleOtpChange = (index, value, otp, setOtp) => {
  if (value.length <= 1) {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  }
};
