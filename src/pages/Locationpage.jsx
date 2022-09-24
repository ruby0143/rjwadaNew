import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Toplist from "../components/Toplist";
import "../pages/Locationpage.css";
import { auth, fs } from "../config/Config";
import { useNavigate } from "react-router-dom";

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
              console.log(snapshot.data().Fullname);
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
      {/* <h2 className="addlocation-heading">
        <center>Add a new location</center>
      </h2> */}
      <div className="addlocation-wrapper">
        <div className="addlocation-image"></div>
        <div className="addlocation-form-wrapper">
          {/* Form */}
          <form className="addloc-form" onSubmit={handleaddress}>
            {/* * stated as required for all */}
            <div className="form-group">
              <label htmlFor="">
                Full Name <br />
                <input
                  required
                  type="text"
                  className="addloc-input"
                  placeholder={localStorage.getItem("name")}
                  onChange={(e) => setname(e.target.value)}
                />
              </label>
            </div>

            <div className="form-group">
              <div className="addloc-row">
                <div className="addloc-column">
                  <label htmlFor="">
                    Mobile Number <br />
                    <input
                      required
                      type="text"
                      className="addloc-input"
                      placeholder={localStorage.getItem("mobile")}
                      onChange={(e) => setmobile(e.target.value)}
                    />
                  </label>
                </div>
                {/* <div class="addloc-column">
                  <label htmlFor="">
                    Alternate Mobile Number <br />
                    <input required type="text" className="addloc-input" />
                  </label>
                </div> */}
              </div>
            </div>
            <div className="form-group">
              <div className="addloc-row">
                <div className="addloc-column">
                  <label htmlFor="">
                    Country <br />
                    <input
                      required
                      type="text"
                      placeholder={localStorage.getItem("country")}
                      className="addloc-input"
                      onChange={(e) => setcountry(e.target.value)}
                    />
                  </label>
                </div>
                <div className="addloc-column">
                  <label htmlFor="">
                    State <br />
                    <input
                      required
                      type="text"
                      className="addloc-input"
                      placeholder={localStorage.getItem("state")}
                      onChange={(e) => setstate(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="">
                Street <br />
                <textarea
                  type="text"
                  className="addloc-input textarea"
                  id="add-longtext"
                  rows="3"
                  placeholder={localStorage.getItem("street")}
                  onChange={(e) => setstreet(e.target.value)}
                ></textarea>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="">
                Landmark <br />
                <textarea
                  type="text"
                  className="addloc-input textarea"
                  id="add-longtext"
                  placeholder={localStorage.getItem("landmark")}
                  rows="3"
                  onChange={(e) => setlandmark(e.target.value)}
                ></textarea>
              </label>
            </div>
            <div className="form-group">
              <div className="addloc-row">
                <div className="addloc-column">
                  <label htmlFor="">
                    City <br />
                    <input
                      required
                      type="text"
                      className="addloc-input"
                      placeholder={localStorage.getItem("city")}
                      onChange={(e) => setcity(e.target.value)}
                    />
                  </label>
                </div>
                <div className="addloc-column">
                  <label htmlFor="">
                    Pincode <br />
                    <input
                      required
                      type="text"
                      className="addloc-input"
                      placeholder={localStorage.getItem("pincode")}
                      onChange={(e) => setpincode(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* <div className="form-group">
              <input required type="checkbox" />
              <label htmlFor="" id="checkbox-label">
                Make this as my default Address
              </label>
            </div>
            <div className="addloc-address-input">
              <label htmlFor=""></label>
            </div>
            <div className="addloc-addtype-wrapper">
              <label htmlFor="">
                Address Type
                <br />
              </label>
              <select class="addloc-select">
                <option value="none" selected disabled hidden>
                  Select
                </option>
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div> */}

            <button
              className="addloc-btn"
              type="submit"
              style={{ cursor: "pointer" }}
            >
              Add Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
