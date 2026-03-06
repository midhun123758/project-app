import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const {
    user,
    login,
    register,
    sendOtp,
    verifyOtp,
    resetPassword,
    logout,
  } = useContext(AuthContext);
 console.log(user)
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [forgot, setForgot] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleForgotChange = (e) =>
    setForgot({ ...forgot, [e.target.name]: e.target.value });

  // ---------------- LOGIN / REGISTER ----------------
  const handleSubmit = async () => {
    if (isSignup) {
      await register(form.username, form.email, form.password);
      setIsSignup(false);
    } else {
      const data = await login(form.email,form.password);
      if (data.is_staff ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      console.log(data)
    }
    
  };

  // ---------------- LOGGED IN ----------------
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-black text-white rounded">
          <h2 className="text-2xl mb-4">Welcome {user.username}</h2>
          <button onClick={logout} className="bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ---------------- FORGOT PASSWORD ----------------
  if (isForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white shadow rounded">
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

          {step === 1 && (
            <>
              <input
                name="email"
                placeholder="Email"
                className="border p-2 w-full mb-3"
                onChange={handleForgotChange}
              />
              <button
                className="bg-black text-white w-full p-2"
                onClick={async () => {
                  await sendOtp(forgot.email);
                  setStep(2);
                }}
              >
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                name="otp"
                placeholder="Enter OTP"
                className="border p-2 w-full mb-3"
                onChange={handleForgotChange}
              />
              <button
                className="bg-black text-white w-full p-2"
                onClick={async () => {
                  await verifyOtp(forgot.email, forgot.otp);
                  setStep(3);
                }}
              >
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                className="border p-2 w-full mb-3"
                onChange={handleForgotChange}
              />
              <button
                className="bg-black text-white w-full p-2"
                onClick={async () => {
                  await resetPassword(forgot.email, forgot.password);
                  setIsForgot(false);
                  setStep(1);
                }}
              >
                Reset Password
              </button>
            </>
          )}

          <button
            className="text-blue-600 underline mt-4 text-sm"
            onClick={() => setIsForgot(false)}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN / SIGNUP ----------------
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup && (
          <input
            name="username"
            placeholder="Username"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
          />
        )}

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white w-full p-2"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        {!isSignup && (
          <p
            className="text-blue-600 text-sm mt-2 cursor-pointer"
            onClick={() => setIsForgot(true)}
          >
            Forgot password?
          </p>
        )}

        <p className="text-sm mt-3 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
