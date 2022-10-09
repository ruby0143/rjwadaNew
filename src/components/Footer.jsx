import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Terms from "../components/Terms";
import "./Footer.css";
import { auth, fs } from "../config/Config";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Footer = () => {
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
              console.log(snapshot.data().Fullname);
            });
        } else {
          setuser(null);
        }
      });
    }, []);
    return user;
  }

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 550;
  // useEffect(()=>{
  //   setWidth(window.innerWidth);
  //   const handleResizeWindow = () => setWidth(window.innerWidth);
  // window.addEventListener("resize", handleResizeWindow);
  // return () => {
  //   window.removeEventListener("resize", handleResizeWindow);
  // },[]});

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  const user = Getcurrentuser();

  if (width < breakpoint) {
    return (
      <div>
        <link
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossOrigin="anonymous"
        />
        <hr
          style={{
            margin: "0px",
          }}
        />
        <div className="footer-wrapper">
          <div className="footer mobile-footer">
            <Accordion
              defaultExpanded={false}
              className="product-accordion-main"
            >
              <AccordionSummary
                id="panel1-header"
                className="product-accordion-header"
                expandIcon={<ExpandMoreIcon />}
              >
                <div className="accordion-heading">
                  <h2>About us</h2>
                </div>
              </AccordionSummary>
              <AccordionDetails className="product-accordion-detail">
                <p>
                  Rjwada is an augmented reality-based fashion-tech startup.
                  Founded by IITD students and mentored by IIMA professors. At
                  Rjwada, we are reinventing the e-commerce customer experience
                  by providing state-of-the-art 3D AR Try-on.
                </p>
                <ul className="some">
                  <li>
                    <a
                      href="https://twitter.com/rjwadalife"
                      target="_blank"
                      alt="twitter"
                    >
                      <i className="fa fa-twitter" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/rjwadalife"
                      target="_blank"
                    >
                      <i className="fa fa-instagram" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/company/rjwada/?originalSubdomain=in"
                    >
                      <i className="fa fa-linkedin" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded={false} className="sec quickLinks">
              <AccordionSummary
                id="panel1-header"
                className="product-accordion-header"
                expandIcon={<ExpandMoreIcon />}
              >
                <div className="accordion-heading">
                  <h2>Quick Links</h2>
                </div>
              </AccordionSummary>
              <AccordionDetails className="product-accordion-detail links-detail">
                <ul className="special-links">
                  <li>
                    <a
                      href="https://www.linkedin.com/company/rjwada/about/"
                      target="_blank"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/rjwada/jobs/"
                      target="_blank"
                    >
                      Career
                    </a>
                  </li>

                  <li>
                    <a href="mailto:contact@rjwada.com" target="_blank">
                      Contact
                    </a>
                  </li>
                  <li>
                    <Link
                      to={"/Termsncondition"}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      Terms and Condition
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/privacy"}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={false} className="sec contact">
              <AccordionSummary
                id="panel1-header"
                className="product-accordion-header"
                expandIcon={<ExpandMoreIcon />}
              >
                <div className="accordion-heading">
                  <h2>Contact Info</h2>
                </div>
              </AccordionSummary>
              <AccordionDetails className="product-accordion-detail">
                <ul className="info">
                  <li>
                    <span className="special-footer">
                      <i
                        className="fa fa-map-marker"
                        style={{ color: "black" }}
                        aria-hidden="true"
                      />
                    </span>
                    <a
                      href="https://www.google.co.in/maps/place/Research+and+Innovation+Park+IIT+DELHI+(+RNI+)/@28.5429542,77.1875624,195m/data=!3m1!1e3!4m5!3m4!1s0x0:0x48afdc51e54c8134!8m2!3d28.5433266!4d77.1874941?shorturl=1"
                      target="_blank"
                    >
                      <span>
                        Research and Innovation Park,
                        <br />
                        IIT Delhi, New Delhi
                        <br />
                        Delhi 110016
                      </span>
                    </a>
                  </li>

                  <li>
                    <span>
                      <i
                        className="fa fa-envelope"
                        style={{ color: "black" }}
                        aria-hidden="true"
                      />
                    </span>
                    <a href="mailto:contact@rjwada.com">
                      <span>contact@rjwada.com</span>
                    </a>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        <div className={user ? "copyrightText" : "copyrightText-logOut"}>
          <p>Copyright © 2022 Rjwada. All rights reserved</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <link
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
        crossOrigin="anonymous"
      />
      <hr
        style={{
          margin: "0px",
        }}
      />
      <div className="whole-footer">
        <div className="footer-wrapper">
          <div className="footer">
            <div className="ft-container">
              <div className="sec about">
                <h2>About us</h2>
                <p>
                  Rjwada is an augmented reality-based fashion-tech startup.
                  Founded by IITD students and mentored by IIMA professors. At
                  Rjwada, we are reinventing the e-commerce customer experience
                  by providing state-of-the-art 3D AR Try-on.
                </p>
                <ul className="some">
                  <li>
                    <a
                      href="https://twitter.com/rjwadalife"
                      target="_blank"
                      alt="twitter"
                    >
                      <i className="fa fa-twitter" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/rjwadalife"
                      target="_blank"
                    >
                      <i className="fa fa-instagram" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/company/rjwada/?originalSubdomain=in"
                    >
                      <i className="fa fa-linkedin" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="special-tabs">
                <div className="sec quickLinks">
                  <h2>Quick Links</h2>
                  <ul className="special-links">
                    <li>
                      <a
                        href="https://www.linkedin.com/company/rjwada/about/"
                        target="_blank"
                      >
                        About
                      </a>
                    </li>
                    {/* <li>
                  <a href="#">Team</a>
                </li> */}
                    <li>
                      <a
                        href="https://www.linkedin.com/company/rjwada/jobs/"
                        target="_blank"
                      >
                        Career
                      </a>
                    </li>
                    {/* <li>
                  <a href="#">Blog</a>
                </li> */}
                    {/* <li>
                <a href="#">Terms &amp; conditions</a>
              </li> */}
                    <li>
                      <a href="mailto:contact@rjwada.com" target="_blank">
                        Contact
                      </a>
                    </li>
                    <li>
                      <Link
                        to={"/Termsncondition"}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        Terms and Condition
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/privacy"}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="sec contact">
                  <h2>Contact Info</h2>
                  <ul className="info">
                    <li>
                      <span className="special-footer">
                        <i
                          className="fa fa-map-marker"
                          style={{ color: "black" }}
                          aria-hidden="true"
                        />
                      </span>
                      <a
                        href="https://www.google.co.in/maps/place/Research+and+Innovation+Park+IIT+DELHI+(+RNI+)/@28.5429542,77.1875624,195m/data=!3m1!1e3!4m5!3m4!1s0x0:0x48afdc51e54c8134!8m2!3d28.5433266!4d77.1874941?shorturl=1"
                        target="_blank"
                      >
                        <span>
                          Research and Innovation Park,
                          <br />
                          IIT Delhi, New Delhi
                          <br />
                          Delhi 110016
                        </span>
                      </a>
                    </li>
                    <li>
                      <span>
                        <i
                          className="fa fa-envelope"
                          style={{ color: "black" }}
                          aria-hidden="true"
                        />
                      </span>

                      {/* <a href="mailto:contact@rjwada.com">contact@rjwada.com</a> */}
                      <a href="mailto:contact@rjwada.com">
                        <span>contact@rjwada.com</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={user ? "copyrightText" : "copyrightText-logOut"}>
          <p>Copyright © 2022 Rjwada. All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
