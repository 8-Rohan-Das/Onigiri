import React, { useState, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import logo from "../../assets/logo.png";
import { useLogin } from "../../hooks/useLogin";
import { useForgotPassword } from "../../hooks/useForgotPassword";

import SplashScreen from "../../components/SplashScreen";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);

  useLayoutEffect(() => {
    document.body.classList.remove("dark-mode");

    return () => {
      if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
      }
    };
  }, []);

  const {
    formData,
    passwordStrength,
    error,
    isLoading,
    showPassword,
    handleChange,
    handleSocialLogin,
    login, // Use login function instead of handleSubmit to control flow
    togglePasswordVisibility,
    clearError,
    setFormData,
    updateMockCredentials
  } = useLogin();

  const [resetSuccessMessage, setResetSuccessMessage] = useState("");

  const handleResetSuccess = (email, newPassword) => {
    setFormData(prev => ({
      ...prev,
      email,
      password: ""
    }));

    setResetSuccessMessage(
      "Password reset successfully. Please login with your new password."
    );

    setTimeout(() => setResetSuccessMessage(""), 5000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await login();
    if (success) {
      setShowSplash(true);
      setTimeout(() => {
        navigate('/home');
      }, 2500); // 2.5 seconds for the high-end loading animation
    }
  };

  const {
    isOpen,
    step,
    isLoading: isForgotLoading,
    error: forgotError,
    successMessage,
    formData: forgotData,
    openModal,
    closeModal,
    handleChange: handleForgotChange,
    handleSendOtp,
    handleResetPassword
  } = useForgotPassword({ onResetSuccess: handleResetSuccess });

  if (showSplash) {
    return <SplashScreen message="Preparing your personalized dashboard..." />;
  }

  return (
    <div className="login-wrapper">

      {/* LEFT SIDE */}
      <div className="welcome-section">

        <div className="logo-container">
          <img src={logo} alt="Onigiri Logo" className="logo-image" />
          <div className="logo-text">
            <div className="brand-name">ONIGIRI</div>
            <div className="brand-slogan">Hunger has met its match</div>
          </div>
        </div>

        <div className="top-nav">
          <div className="top-action-buttons">
            <Link to="/login" className="top-action-btn active">Login</Link>
            <Link to="/signup" className="top-action-btn">Sign Up</Link>
          </div>
        </div>

        <div className="welcome-text">
          <h1>Welcome Back!</h1>
          <p>Delicious food is just a login away</p>
        </div>

        <div className="food-images">
          <div className="matrix-bg"></div>
          <div className="matrix-rain">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="matrix-column" key={i}>
                <span className="matrix-emoji">🍕</span>
                <span className="matrix-emoji">🍔</span>
                <span className="matrix-emoji">🌮</span>
                <span className="matrix-emoji">🍜</span>
                <span className="matrix-emoji">🥗</span>
              </div>
            ))}
          </div>
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-section">

        <div className="login-form">

          <h2 className="title">Login</h2>
          <p className="subtitle">Enter your credentials to access your account</p>

          <form onSubmit={handleFormSubmit}>

            {error && <div className="error-box">{error}</div>}
            {resetSuccessMessage && <div className="success-box">{resetSuccessMessage}</div>}

            <div className="form-group">
              <input
                type="email"
                className="input-custom"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                onFocus={clearError}
              />
            </div>

            <div className="form-group">

              <div className="password-input-wrapper">

                <input
                  type={showPassword ? "text" : "password"}
                  className="input-custom"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  onFocus={clearError}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>

              </div>

            </div>

            <div className="form-options">

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleChange}
                />
                Keep me logged in
              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={openModal}
              >
                Forgot password?
              </button>

            </div>

            <button className="btn-login" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="divider"><span>OR</span></div>

          <div className="social-login">

            <button
              className="social-btn"
              onClick={() => handleSocialLogin("Facebook")}
            >
              Facebook
            </button>

            <button
              className="social-btn"
              onClick={() => handleSocialLogin("Google")}
            >
              Google
            </button>

          </div>

          <div className="signup-text">
            Don't have an account?
            <Link to="/signup" className="signup"> Sign Up</Link>
          </div>

        </div>

      </div>


      {/* MODAL */}

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">

            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>

            <h2 className="modal-title">
              {step === 1 ? "Reset Password" : "Create New Password"}
            </h2>

            {forgotError && <div className="error-message-modal">{forgotError}</div>}
            {successMessage && <div className="success-message-modal">{successMessage}</div>}

            {step === 1 ? (

              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  name="email"
                  className="input-custom"
                  placeholder="Enter your email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  required
                />
                <button className="btn-login">
                  {isForgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>

            ) : (

              <form onSubmit={handleResetPassword}>

                <input
                  type="text"
                  name="otp"
                  className="input-custom"
                  placeholder="Enter OTP"
                  value={forgotData.otp}
                  onChange={handleForgotChange}
                  required
                />

                <input
                  type="password"
                  name="newPassword"
                  className="input-custom"
                  placeholder="New Password"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  className="input-custom"
                  placeholder="Confirm Password"
                  value={forgotData.confirmPassword}
                  onChange={handleForgotChange}
                  required
                />

                <button className="btn-login">
                  {isForgotLoading ? "Resetting..." : "Reset Password"}
                </button>

              </form>

            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;