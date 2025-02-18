import React, { useState, useCallback } from 'react';
import { Coffee } from 'lucide-react';
import LoginForm from './Loginform';
import SignupForm from './SignupForm';
import cafeImage from '../../assets/cafe.jpeg'; // Adjust the path based on your project structure

const MemoizedLoginForm = React.memo(LoginForm);
const MemoizedSignupForm = React.memo(SignupForm);

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = useCallback(() => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  }, []);

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${cafeImage})` }}
    >
      <div className="w-full max-w-md space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="rounded-lg bg-teal-500 p-2">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">CAFETERIA CONNECT</span>
        </div>

        {/* Forms Container */}
        <div className="w-full">
          {isLogin ? <MemoizedLoginForm /> : <MemoizedSignupForm />}
        </div>

        {/* Toggle Link */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleForm}
            className="text-sm text-teal-600 hover:text-teal-500 font-medium transition-colors"
          >
            {isLogin ? 'Not a user? Sign up' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;