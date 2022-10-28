import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Toplist from "../components/Toplist";
import "../pages/Locationpage.css";
import { auth, fs } from "../config/Config";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-custom-alert';



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

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(localStorage ? JSON.parse(localStorage.getItem("mobile")) : "");
  const [street, setStreet] = useState(localStorage ? JSON.parse(localStorage.getItem("street")) : "")
  const [landmark, setLandmark] = useState(localStorage ? JSON.parse(localStorage.getItem("landmark")) : "");
  const [city, setCity] = useState(localStorage ? JSON.parse(localStorage.getItem("city")) : "")
  const [state, setState] = useState(localStorage ? JSON.parse(localStorage.getItem("state")) : "");
  const [country, setCountry] = useState(localStorage ? JSON.parse(localStorage.getItem("country")) : "");
  const [pincode, setPincode] = useState(localStorage ? JSON.parse(localStorage.getItem("pincode")) : "");
  const [errmsg, seterrmsg] = useState("");
  const [success, setsuccess] = useState("");
 
  

  useEffect(()=>{
    localStorage.setItem("street", JSON.stringify(street));
        localStorage.setItem("landmark", JSON.stringify(landmark));
        localStorage.setItem("city", JSON.stringify(city));
        localStorage.setItem("pincode", JSON.stringify(pincode));
        localStorage.setItem("country", JSON.stringify(country));
        localStorage.setItem("state", JSON.stringify(state));
        localStorage.setItem("name", JSON.stringify(name));
        localStorage.setItem("mobile", JSON.stringify(mobile));
  }, [street, landmark, country, pincode, state, mobile, name, city])

  const alertSuccess = () => toast.success('Your address is changed ✔');
  const alertWarning = () => toast.warning('Mobile number and pincode must be valid');
  

  const handleaddress = (e) => {
    if(mobile.length===10 && pincode.length===6){
      e.preventDefault();
      setTimeout(() => {
       setsuccess("details added succesfully");
       navigate("/cart")
    }, 1000);
    alertSuccess()
      console.log(errmsg);
    } 
    else{
      alertWarning()
    }
    }
  

  return (
    <>
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
                    // placeholder={!name ? "Full Name" : localStorage.getItem("name")}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={user}
                  />
                </div>

                <div className="form-group">
                  <input
                    required
                    type="number"
                    className="addloc-input"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e)=>setMobile(e.target.value)}
                  />
    
     
                </div>
              </div>
              <div className="form-group textarea-group">
                <textarea
                  required
                  type="text"
                  // placeholder={localStorage.getItem("street")}
                  placeholder="Street"
                  className="addloc-input extend"
                  onChange={(e) => setStreet(e.target.value)}
                  rows="4"
                  value={street}
                />
              </div>
              <div className="form-group textarea-group">
                <textarea
                  required
                  type="text"
                  className="addloc-input extend"
                  // placeholder={!landmark ? "Landmark" : localStorage.getItem("landmark")}
                  placeholder="Landmark"
                  onChange={(e) => setLandmark(e.target.value)}
                  rows="4"
                  value={landmark}
                />
              </div>
              <div className="flex-form">
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    // placeholder={!city ? "City" : localStorage.getItem("city")}
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                  />
                </div>
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    // placeholder={!state ? "State" : localStorage.getItem("state")}
                    placeholder="State"
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                  />
                </div>
              </div>
              <div className="flex-form">
                <div className="form-group">
                  <input
                    required
                    type="text"
                    className="addloc-input"
                    // placeholder={!country ? "Country" : localStorage.getItem("Country")}
                    placeholder="Country"
                    onChange={(e) => setCountry(e.target.value)}
                    value={country}
                  />
                </div>
                <div className="form-group">
                  <input
                    required
                    type="number"
                    className="addloc-input"
                    // placeholder={!pincode ? "Pincode" : localStorage.getItem("pincode")}
                    placeholder="Pincode"
                    onChange={(e) => setPincode(e.target.value)}
                    value={pincode}
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
    </>
  );
};

export default LocationPage;
