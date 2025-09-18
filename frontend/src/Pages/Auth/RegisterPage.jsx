import React from "react";
import AuthForm from "../../Components/Form/AuthForm";
import { registerUser } from "../../Services/AuthService";
import trainBg from "../../assets/train-bg.jpg";
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const handleRegister = async (data) => {
    try {
      console.log(data)
      const res = await registerUser(data);
      alert(res.message);
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen relative">
      <img src={trainBg} alt="Railway background" className="absolute w-full h-full object-cover z-0" />
      <div className="relative z-10 flex items-center justify-center h-full flex-col">
        <AuthForm type="register" onSubmit={handleRegister} />
        {/* Switch link */}
        <p className="mt-4 text-sm text-gray-800 bg-white/80 backdrop-blur-md px-4 py-2 rounded-md shadow-md text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors duration-300"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
