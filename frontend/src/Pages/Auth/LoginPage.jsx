import React from "react";
import AuthForm from "../../Components/Form/AuthForm";
import { loginUser } from "../../Services/AuthService";
// import trainVideo from "../assets/railway.mp4";
import trainBg from "../../assets/train-bg.jpg"
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate()
  const handleLogin = async (data) => {
    try {
      const res = await loginUser(data);
      // redirect to dashboard or store token

      if (res.success) {
        // Extract role (res.admin / res.operator / res.sectionController)
        const user = res.admin || res.operator || res.sectionController;

        if (!user) throw new Error("No user returned from backend");

        // Redirect based on role
        switch (user.role) {
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "Operator":
            navigate("/operator/dashboard");
            break;
          case "SectionController":
            navigate("/section-controller/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="h-screen relative">
      <img src={trainBg} className="absolute w-full h-full object-cover z-0">
      </img>
      <div className="relative z-10 flex items-center justify-center h-full flex-col">
        <AuthForm type="login" onSubmit={handleLogin} />
        {/* Switch link */}
        {/* Switch link */}
        <p className="mt-4 text-sm text-gray-800 bg-white/80 backdrop-blur-md px-4 py-2 rounded-md shadow-md text-center">
          Already have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors duration-300"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
