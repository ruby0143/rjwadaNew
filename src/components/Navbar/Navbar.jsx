import { DeskTopNavbar } from "./DesktopNavbar";
import { MobileNavbar } from "./MobileNavbar";
import { Link } from "react-router-dom";
import { auth } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import Rjwada_logo from "../../images/rjwada_logo.svg";
import { BsEmojiNeutralFill } from "react-icons/bs";
import "./Navbar.css";

export const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const handlelogout = () => {
    auth.signOut().then(() => {
      navigate("/");
    });
  };
  return (
    <>
      <div className="navbar-wrapper">
        <div className="nav-left-items-container">
          <div className="nav-left-item nav-left-item-logo">
            <Link to="/">
              <img
                src={Rjwada_logo}
                alt="Rjwada👑"
                width="40px"
                height="40px"
                marginLeft="10px"
              />
            </Link>
          </div>
          {user ? (
            <div className="nav-left-item nav-left-user-item">Hi, {user}</div>
          ) : (
            ""
          )}
        </div>

        <div className="nav-right-items-container">
          {user && <DeskTopNavbar />}
          <div className="nav-right-items-btn-container">
            {user && (
              <>
                <button
                  className="nav-right-item btn-outline"
                  style={{
                    padding: "5px 10px",
                    border: "1px solid black",
                    borderRadius: "2px 10px",
                    marginRight: "10px",
                  }}
                  onClick={handlelogout}
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login">
                  <button
                    className="nav-right-item btn-outline"
                    style={{
                      padding: "5px 10px",
                      border: "1px solid black",
                      borderRadius: "2px 10px",
                      marginRight: "10px",
                    }}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    className="nav-right-item btn-outline"
                    style={{
                      padding: "5px 10px",
                      border: "1px solid black",
                      borderRadius: "2px 10px",
                      marginRight: "10px",
                    }}
                  >
                    Signup
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {user && <MobileNavbar />}
    </>
  );
};
