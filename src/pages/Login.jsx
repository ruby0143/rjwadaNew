import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../pages/Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, fs } from "../config/Config";
import { initializeAuthentication } from "../config/Config";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Rjwada_logo from "../images/rjwada_logo.svg";
import { FcGoogle } from "react-icons/fc";
import Terms from "../components/Terms";
// import Privacy from "../components/Privacy";

const Login = () => {
  const navigate = useNavigate();
  const [fullname, setfullname] = useState("");
  const [errmsg, seterrmsg] = useState("");
  const [success, setsuccess] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const handleSignup = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((obj) => {
        console.log(obj.user.uid);
        setsuccess("Login successfull.");
        localStorage.setItem("uid", obj.user.uid);
        setemail("");
        setpassword("");
        seterrmsg("");
        setTimeout(() => {
          setsuccess("");
          navigate("/");
        }, 1000);
      })
      .catch((error) => seterrmsg(error.message));
  };

  const handleSignupGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const userGoogle = result.user;
      console.log(userGoogle);
      localStorage.setItem("uid", userGoogle.uid);
      fs.collection("users")
        .doc(userGoogle.uid)
        .set({
          Fullname: userGoogle.displayName,
          Email: userGoogle.email,
          Password: "Signed with google",
        })
        .catch((error) => {
          seterrmsg(error.message);
        })
        .then(() => {
          setsuccess("Signup successfull.");
          setfullname("");
          setemail("");
          setpassword("");
          seterrmsg("");
          setTimeout(() => {
            setsuccess("");
            navigate("/");
          }, 1000);
        })
        .catch((error) => {
          seterrmsg(error.message);
        });
    });
  };
  // console.log(user.id)
  // Dialog box start
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Dialog box end
  return (
    <>
      <div className="login-wrapper">
        <div className="login">
          <div className="login-content">
            <span className="login-title">
              {/* Add logo here */}
              Welcome back!
            </span>
            {/* <span className="login-instructions">
              Welcome back, please Login to your account
            </span> */}

            {/* <div className="login-or">- OR -</div> */}
            <form className="login-form" onSubmit={handleSignup}>
              <label className="signup-label">
                <span>Email Address</span>
                <input
                  type="email"
                  name="mail"
                  className="login-miniform"
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </label>
              <label className="signup-label">
                <span>Password</span>
                <input
                  type="password"
                  name="Password"
                  className="login-miniform"
                  required
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </label>
              {/* <div className="login-aditional">
                <div className="login-checkbox-container">
                  <input type="checkbox" id="remember" />
                  <label for="remember">Remember me</label>
                </div>
                <a className="login-forgot-password">Forgot Password</a>
              </div> */}
              {success && (
                <>
                  <div className="success-msg">
                    <center
                      style={{
                        // backgroundColor: "#7DCE13",
                        margin: "auto",
                        padding: "5px",
                        borderRadius: "10px",
                        color: "#7DCE13",
                        fontWeight: "600",
                      }}
                    >
                      {success}
                    </center>
                  </div>
                </>
              )}
              {errmsg && (
                <>
                  <div
                    style={{
                      // backgroundColor: "red",
                      margin: "auto",
                      padding: "5px",
                      borderRadius: "10px",
                      color: "red",
                      fontWeight: "600s",
                    }}
                    className="success-msg"
                  >
                    <center>Please enter details carefully</center>
                  </div>
                </>
              )}
              <center>
                <div className="login-btn">
                  <center>
                    <button type="submit" className="login-btn-login">
                      Login
                    </button>
                  </center>
                  <div className="login-button" onClick={handleSignupGoogle}>
                    <button
                      className="login-google"
                      style={{
                        padding: "20px 0px",
                      }}
                    >
                      {/* googel icon */}
                      <FcGoogle
                        style={{
                          fontSize: "20px",
                          paddingRight: "5px",
                        }}
                      />
                      Sign in with Google
                    </button>
                  </div>
                </div>
              </center>

              <div className="signup-section" style={{ display: "flex" }}>
                Don't have an account?
                <Link to={"/signup"} className="login-signup">
                  Sign up
                </Link>
              </div>
              <div className="login-tyc-wrapper">
                <span style={{ marginRight: "5px" }}>
                  By signing up you agree to Rjwada's
                </span>
                <Terms />
                {/* <span style={{ marginLeft: "5px" }}>and</span> */}

                {/* <Privacy /> */}
              </div>
            </form>
            {/* {errmsg && (
              <>
                <div className="error-msg">
                  <br />
                  <br />
                  {errmsg}
                </div>
              </>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;