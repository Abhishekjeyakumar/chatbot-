import { useState } from "react";

import {
  signUp,
  login,
} from "../service/auth";

import "./AuthPage.css";

export default function AuthPage({
  setIsAuthenticated,
}) {

  const [isLogin, setIsLogin] =
    useState(true);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

    const [showPassword, setShowPassword] =
    useState(false);

  async function handleAuth() {

    try {

      setLoading(true);

      if (isLogin) {

        await login(email, password);

      } else {

        await signUp(
          name,
          email,
          password
        );
      }

      setIsAuthenticated(true);

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="auth-container">

      <div
        className={`auth-box ${
          isLogin ? "" : "active"
        }`}
      >

        {/* LOGIN */}

        <div className="form-section login-section">

          <h1>Welcome Back</h1>

          <p>
            Login to continue chatting
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <div className="password-container">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    className="auth-input"
  />

  <button
    type="button"
    className="show-password-btn"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
  >
    {showPassword
      ? "Hide"
      : "Show"}
  </button>

</div>

          <button
            className="auth-btn"
            onClick={handleAuth}
          >
            {loading
              ? "Loading..."
              : "Login"}
          </button>

        </div>

        {/* SIGNUP */}

        <div className="form-section signup-section">

          <h1>Create Account</h1>

          <p>
            Join AskMe AI today 🚀
          </p>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="auth-btn"
            onClick={handleAuth}
          >
            {loading
              ? "Loading..."
              : "Create Account"}
          </button>

        </div>

        {/* OVERLAY */}

        <div className="overlay-container">

          <div className="overlay">

            <div className="overlay-panel overlay-left">

              <h1>Hello Friend 👋</h1>

              <p>
                Already have an account?
              </p>

              <button
                className="ghost-btn"
                onClick={() =>
                  setIsLogin(true)
                }
              >
                Login
              </button>

            </div>

            <div className="overlay-panel overlay-right">

              <h1>New Here? ✨</h1>

              <p>
                Create account and continue
              </p>

              <button
                className="ghost-btn"
                onClick={() =>
                  setIsLogin(false)
                }
              >
                Sign Up
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}