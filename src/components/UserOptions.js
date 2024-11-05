import React, { useState } from 'react';
import './UserOptions.css'; // Ensure this CSS file is included

const UserOptions = () => {
  const [isLogin, setIsLogin] = useState(true); // Default to showing the login form

  const toggleForms = () => {
    setIsLogin(!isLogin); // Toggle between login and signup forms
  };

  return (
    <section className="user">
      <div className="user_options-container">
        <div className="user_options-text">
          {isLogin ? (
            <div className="user_options-registered">
              <h2 className="user_registered-title">Have an account?</h2>
              <p className="user_registered-text">
                Sign in to access your account.
              </p>
              <button className="user_registered-login" onClick={toggleForms}>
                Switch to Sign Up
              </button>
            </div>
          ) : (
            <div className="user_options-unregistered">
              <h2 className="user_unregistered-title">Don't have an account?</h2>
              <p className="user_unregistered-text">
                Create an account to get started.
              </p>
              <button className="user_unregistered-signup" onClick={toggleForms}>
                Switch to Login
              </button>
            </div>
          )}
        </div>
        
        <div className={`user_options-forms ${isLogin ? 'show' : 'hide'}`}>
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </section>
  );
};

const LoginForm = () => (
  <div className="user_forms-login">
    <h2 className="forms_title">Login</h2>
    <form className="forms_form">
      <fieldset className="forms_fieldset">
        <div className="forms_field">
          <input type="email" placeholder="Email" className="forms_field-input" required autoFocus />
        </div>
        <div className="forms_field">
          <input type="password" placeholder="Password" className="forms_field-input" required />
        </div>
      </fieldset>
      <div className="forms_buttons">
        <button type="button" className="forms_buttons-forgot">Forgot password?</button>
        <input type="submit" value="Log In" className="forms_buttons-action" />
      </div>
    </form>
  </div>
);

const SignupForm = () => (
  <div className="user_forms-signup">
    <h2 className="forms_title">Sign Up</h2>
    <form className="forms_form">
      <fieldset className="forms_fieldset">
        <div className="forms_field">
          <input type="text" placeholder="Full Name" className="forms_field-input" required />
        </div>
        <div className="forms_field">
          <input type="email" placeholder="Email" className="forms_field-input" required />
        </div>
        <div className="forms_field">
          <input type="password" placeholder="Password" className="forms_field-input" required />
        </div>
      </fieldset>
      <div className="forms_buttons">
        <input type="submit" value="Sign Up" className="forms_buttons-action" />
      </div>
    </form>
  </div>
);

export default UserOptions;
