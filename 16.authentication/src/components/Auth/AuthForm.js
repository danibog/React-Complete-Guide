import { useEffect, useRef, useState } from "react";

import classes from "./AuthForm.module.css";
import { initializeToken, login, logout } from "../../store/authslice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let url;

    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTDnpVOGWV5gP41YUdQK3UDJsH8GSRATw";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBTDnpVOGWV5gP41YUdQK3UDJsH8GSRATw";
    }
    setIsLoading(true);
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!";
            if (data?.error?.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        dispatch(
          login({
            token: data.idToken,
            expirationTime: expirationTime.toISOString(),
          })
        );

        history.replace("/");
      })
      .catch((errorMessage) => {
        alert(errorMessage);
      });
  };

  useEffect(() => {
    const { remainingTime } = initializeToken();

    setTimeout(() => {
      console.log(remainingTime);
      dispatch(logout());
    }, remainingTime);
  }, [dispatch]);
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request ...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
