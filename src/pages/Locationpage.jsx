import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Toplist from "../components/Toplist";
import "../pages/Locationpage.css";
import { auth, fs } from "../config/Config";
import { useNavigate } from "react-router-dom";
import Footer from './../components/Footer';
// import { Helmet } from "react-helmet-async";

const LocationPage = () => {
  const navigate = useNavigate();
  const [userid, setuserid] = useState();
  function Getcurrentuser() {
    const [user, setuser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setuser(snapshot.data().Fullname);
              setuserid(user.uid);
              console.log(user.uid);
              console.log(snapshot.data());
            });
          } else {
            setuser(null);
          }
      });
    }, []);
    return user;
  }
  const user = Getcurrentuser();

  const [name, setname] = useState("");
  const [mobile, setmobile] = useState("");
  const [country, setcountry] = useState("");
  const [street, setstreet] = useState("");
  const [landmark, setlandmark] = useState("");
  const [state, setstate] = useState("");
  const [city, setcity] = useState("");
  const [pincode, setpincode] = useState("");
  const [errmsg, seterrmsg] = useState("");
  const [success, setsuccess] = useState("");

  const handleaddress = (e) => {
    e.preventDefault();
    fs.collection("user_address")
      .doc(userid)
      .set({
        Name: name,
        Mobile: mobile,
        Country: country,
        Street: street,
        State: state,
        Landmark: landmark,
        City: city,
        Pincode: pincode,
      })
      .then(() => {
        localStorage.setItem("street", street);
        localStorage.setItem("landmark", landmark);
        localStorage.setItem("city", city);
        localStorage.setItem("pincode", pincode);
        localStorage.setItem("country", country);
        localStorage.setItem("state", state);
        localStorage.setItem("name", name);
        localStorage.setItem("mobile", mobile);
        setname("");
        setmobile("");
        setcountry("");
        setstreet("");
        setlandmark("");
        setstate("");
        setcity("");
        setpincode("");
        seterrmsg("");
        setTimeout(() => {
          setsuccess("details added succesfully");
          navigate("/cart");
        }, 1000);
      })
      .catch((error) => seterrmsg(error.message));
    console.log(errmsg);
  };

  return (
    <>
      {/* <Helmet>
        <title>Profile</title>
        <meta name="description" content="This is a Profile page" />
        <link rel="canonical" href="/locationpage" />
      </Helmet> */}
      <div>
        <h1
          style={{
            width: "90%",
            margin: "auto",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          {success}
        </h1>
        <div className="addlocation-wrapper">
          <div className="addlocation-form-wrapper">
            {/* Form */}
            <form className="addloc-form" onSubmit={handleaddress}>
              <h2 className="address-head">Your Address</h2>
              <div className="flex-form">
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    placeholder={!name ? "Full Name" : localStorage.getItem("name")}
                    onChange={(e) => setname(e.target.value)}
                    value={user}
                  />
                </div>

                <div className="form-group">
                  <input
                    required
                    type="number"
                    className="addloc-input"
                    placeholder={!mobile ? "Mobile Number" : localStorage.getItem("mobile")}
                    onChange={(e) => setmobile(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group textarea-group">
                <textarea
                  required
                  type="text"
                  placeholder={!street ? "Street Address" : localStorage.getItem("street")}
                  className="addloc-input extend"
                  onChange={(e) => setstreet(e.target.value)}
                  rows="4"
                />
              </div>
              <div className="form-group textarea-group">
                <textarea
                  required
                  type="text"
                  className="addloc-input extend"
                  placeholder={!landmark ? "Landmark" : localStorage.getItem("landmark")}
                  onChange={(e) => setlandmark(e.target.value)}
                  rows="4"
                />
              </div>
              <div className="flex-form">
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    placeholder={!city ? "City" : localStorage.getItem("city")}
                    onChange={(e) => setstreet(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    placeholder={!state ? "State" : localStorage.getItem("state")}
                    onChange={(e) => setlandmark(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-form">
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    placeholder={!country ? "Country" : localStorage.getItem("city")}
                    onChange={(e) => setcity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    required
                    type="number"
                    className="addloc-input"
                    placeholder={!pincode ? "Pincode" : localStorage.getItem("pincode")}
                    onChange={(e) => setpincode(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="addloc-btn"
                type="submit"
                style={{ cursor: "pointer" }}
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default LocationPage;
