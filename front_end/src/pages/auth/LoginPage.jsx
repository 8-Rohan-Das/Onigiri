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

            <div className="floating-label-group">
              <input
                type="email"
                id="email"
                className="input-custom"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
                disabled={isLoading}
                onFocus={clearError}
              />
              <label htmlFor="email">Email Address</label>
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
            </div>

            <div className="floating-label-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-custom"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  disabled={isLoading}
                  onFocus={clearError}
                />
                <label htmlFor="password">Password</label>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
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