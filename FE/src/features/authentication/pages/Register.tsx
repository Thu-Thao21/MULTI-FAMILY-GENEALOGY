import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    // Background xanh đậm bao phủ toàn màn hình
    <div className="min-h-screen bg-[#1a2538] flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;