import React from "react";
import { Link } from "react-router-dom";
import Terms from "../components/Terms";
import "./Footer.css";

const Footer = () => {
  return (
    <div>
      <link
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
        crossOrigin="anonymous"
      />
      <div className="footer-wrapper">
        <div className="footer">
          <div className="ft-container">
            <div className="sec about">
              <h2>About us</h2>
              <p>
                Rjwada is an augmented reality-based fashion-tech startup.
                Founded by IITD students and mentored by IIMA professors at
                Rjwada, we are reinventing the e-commerce customer experience by
                providing state-of-the-art 3D AR Try-on.
              </p>
              <ul className="some">
                <li>
                  <a href="https://twitter.com/rjwadalife" target="_blank">
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
                  <a target="_blank" href="https://www.linkedin.com/company/rjwada/?originalSubdomain=in">
                    <i className="fa fa-linkedin" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="sec quickLinks">
              <h2>Quick Links</h2>
              <ul>
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
                  <span>
                    <i
                      className="fa fa-map-marker"
                      style={{ color: "black" }}
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    Research and Innovation Park IIT Delhi, New Delhi
                    <br />
                    IIT Delhi, New Delhi
                    <br />
                    Delhi 110016
                  </span>
                </li>
                {/* <li>
                  <span>
                    <i
                      className="fa fa-phone"
                      style={{ color: "black", marginTop: "20px" }}
                      aria-hidden="true"
                    />
                  </span>
                  <p>
                    <a href="tel:4542594575">+91 987654321</a>
                  </p>
                </li> */}
                <li>
                  <span>
                    <i
                      className="fa fa-envelope"
                      style={{ color: "black", marginTop: "20px" }}
                      aria-hidden="true"
                    />
                  </span>
                  <p>
                    {/* <a href="mailto:contact@rjwada.com">contact@rjwada.com</a> */}
                    <a href="mailto:contact@rjwada.com">contact@rjwada.com</a>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyrightText">
        <p>Copyright © 2022 Rjwada. All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
