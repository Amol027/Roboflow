import React, { useState } from 'react';
import ForgotPasswordStep from '../Components/ForgotPasswordStep';
import OtpVerificationStep from '../pages/OtpVerificationStep';
import ResetPasswordStep from '../pages/ResetPasswordStep';

const PasswordResetFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');

  return (
    <>
      {currentStep === 1 && (
        <ForgotPasswordStep
          email={email}
          setEmail={setEmail}
          onNext={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 2 && (
        <OtpVerificationStep
          email={email}
          otp={otp}
          setOtp={setOtp}
          onNext={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 3 && (
        <ResetPasswordStep
          email={email}
          otp={otp}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onReset={() => {
            alert('Password reset successfully!');
            setCurrentStep(1);
            setEmail('');
            setOtp(['', '', '', '', '', '']);
            setNewPassword('');
          }}
        />
      )}
    </>
  );
};

export default PasswordResetFlow;