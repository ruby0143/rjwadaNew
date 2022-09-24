

import React from "react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import Toplist from "../components/Toplist";
import { Link, useParams } from "react-router-dom";
import "./ParticularProduct.css";
import Razorpay from "../components/Razorpay";
import { auth, fs, storage, initializeAuthentication } from "../config/Config";
import { useNavigate } from "react-router-dom";
import { senddata } from "../components/send";
import { BsCircleFill } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../components/Footer";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import { AiOutlineInfoCircle } from "react-icons/ai";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";

const ParticularProduct = ({ addToCart, addToWhishlist }) => {
  const navigate = useNavigate();

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
            });
        } else {
          setuser(null);
        }
      });
    }, []);
    return user;
  }

  const user = Getcurrentuser();

  const { id } = useParams();

  const [data, setData] = useState(null);
  console.log(data);
  useEffect(() => {
    fetch("http://api.rjwada.com/items/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualdata) => {
        setData(actualdata.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const [selectedsize, setselectedsize] = useState("");
  const [name, setname] = useState("Product name");
  const [size, setsize] = useState("");
  const [image, setimage] = useState([]);
  const [images, setimages] = useState([]);
  const [categoryId, setcategoryId] = useState("");
  const [productId, setproductId] = useState("");
  const [price, setprice] = useState("Product price");
  const [description, setdescription] = useState("Product description");
  const [datas, setdata] = useState({});
  const [banner, setbanner] = useState("Product img");
  const [color, setColor] = useState({});
  const [discount, setDiscount] = useState("");
  const [features, setFeatures] = useState("");

  useEffect(() => {
    data &&
      data.map((data) =>
        data.id == id
          ? (setdata({ data, selectedsize }),
            setname(data.name),
            setimage(data.images[0]),
            setimages(data.images),
            setsize(data.sizes),
            setcategoryId(data.category_id),
            setproductId(data.id),
            setprice(data.price),
            setdescription(data.description),
            setbanner(data.banner),
            setColor(data.colours),
            setDiscount(data.discount),
            setFeatures(data.features))
          : null
      );
  }, [data]);
  console.log(datas);
  datas["categoryId"] = categoryId;
  console.log(selectedsize);

  let quantity = 1;

  let tosend = {};
  tosend["userid_id"] = localStorage.getItem("uid");
  tosend["name"] = name;
  tosend["quantity"] = quantity;
  tosend["size"] = selectedsize;
  tosend["categoryId"] = categoryId;
  tosend["product_id"] = productId;
  tosend["productPrice"] = price;
  tosend["description"] = description;
  tosend["banner"] = banner;
  tosend["color"] = color;

  useEffect(() => {
    if (localStorage.getItem("paymentdone") === true) {
      console.log("paymentdone");
      senddata(tosend);
      localStorage.setItem("paymentdone", false);
    } else {
      localStorage.setItem("paymentdone", false);
    }
  }, []);
  const [clicked, setClicked] = useState(false);

  async function sendImg(endpoint, base64_str, prod_id, user_id) {
    let headersList = {
      "Access-Control-Allow-Origin": "*",
    };

    console.log(base64_str.split("data:image/jpeg;base64,")[1]);

    let bodyContent = new FormData();
    bodyContent.append(
      "base64_str",
      base64_str.split("data:image/jpeg;base64,")[1]
    );
    console.log(returnedEndpoint);
    let uun = Date.now() * Math.random();
    bodyContent.append("filename", `${prod_id}*${user_id}*${uun}`);

    let response = fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: bodyContent,
      headers: headersList,
    });

    console.log("done");
    response.then((a) => {
      console.log(a);
      getImageURL(`${prod_id}*${user_id}*${uun}`);
    });
  }

  var storage = firebase.storage();

  var storageRef = storage.ref();

  // var storageRefImgs = storageRef.child("images");

  const [MLimage, setMLimage] = useState("");
  function getImageURL(imageName) {
    // "imageName" is the (<str>) full name of image with extensions.
    // It's just the name, do not pass anything else with it.
    // Example: getImageURL("00133_00.jpg");

    storageRef
      .child(`images/${imageName}`)
      .getDownloadURL()
      .then((url) => {
        // This is the actual URL (encrypted by Google).
        // Use it however you want to.
        console.log("final image url", url);
        setMLimage(url);
        // setimagetoview(url)
        return url;
      });
  }

  initializeAuthentication();
  const [returnedEndpoint, setreturnedEndpoint] = useState("");
  const getEndpoint = () => {
    // This function returns endpoint that is to be called by Fetch request.
    console.log("function called");
    var dbRef = firebase.database().ref().child("URL");
    dbRef.on("value", (snap) => {
      var endpoint = snap.val()["URL"] + "/upload";
      // console.log('this is endpoint - ', endpoint);
      // console.log('this is endpoint - ', endpoint);
      setreturnedEndpoint(endpoint);
      return endpoint;
    });
  };
  console.log(returnedEndpoint);

  console.log(size);

  const [base64, setbase64] = useState("");
  const [readers, setreaders] = useState({});
  function loadfile(images) {
    getEndpoint();
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById("output");
      setreaders(reader);
      output.src = readers.result;
      var res = readers.result;
      setbase64(res);
      return res;
    };
    reader.readAsDataURL(images);
  }
  console.log(base64);
  console.log(readers.result);

  const [sizenotselected, setsizenotselected] = useState(false);
  const [imagetoview, setimagetoview] = useState("");
  const [uploadedimage, setuploadedimage] = useState("");

  console.log(uploadedimage);

  return (
    <div>
      {/* <Toplist /> */}
      <div className="part-product-wrapper">
        <div className="section-one">
          <div className="product-image-section">
            <div className="vertical-slider">
              <div
                onClick={() => {
                  setimagetoview(
                    "url(" +
                      "http://api.rjwada.com/assets/" +
                      `${images[0]}` +
                      ")"
                  );
                }}
                className="vertical-slider-item"
                style={{
                  backgroundImage:
                    "url(" +
                    "http://api.rjwada.com/assets/" +
                    `${images[0]}` +
                    ")",
                }}
              ></div>
              <div
                onClick={() => {
                  setimagetoview(
                    "url(" +
                      "http://api.rjwada.com/assets/" +
                      `${images[1]}` +
                      ")"
                  );
                }}
                className="vertical-slider-item"
                style={{
                  backgroundImage:
                    "url(" +
                    "http://api.rjwada.com/assets/" +
                    `${images[1]}` +
                    ")",
                }}
              ></div>
              <div
                onClick={() => {
                  setimagetoview(
                    "url(" +
                      "http://api.rjwada.com/assets/" +
                      `${images[2]}` +
                      ")"
                  );
                }}
                className="vertical-slider-item"
                style={{
                  backgroundImage:
                    "url(" +
                    "http://api.rjwada.com/assets/" +
                    `${images[2]}` +
                    ")",
                }}
              ></div>
              {MLimage ? (
                <div
                  onClick={() => {
                    setimagetoview("url(" + MLimage + ")");
                  }}
                  className="vertical-slider-item"
                  style={{
                    backgroundImage: "url(" + MLimage + ")",
                  }}
                ></div>
              ) : (
                <div
                  onClick={() => {
                    setimagetoview("url(" + uploadedimage + ")");
                  }}
                  className="vertical-slider-item"
                  style={{
                    backgroundImage: "url(" + uploadedimage + ")",
                  }}
                ></div>
              )}
              <div
                // onClick={()=>{setimagetoview("url(" +
                // "http://api.rjwada.com/assets/" +
                // `${images[2]}` +
                // ")")}}
                className="vertical-slider-item"
                style={{
                  backgroundImage: "url(" + { uploadedimage } + ")",
                }}
              ></div>
              {/* <img src={require(images[0])} alt="" /> */}
            </div>

            <div>
              <div className="product-image-slider">
                {/* image fetch start */}
                {imagetoview ? (
                  <div
                    className="particular-productimage"
                    style={{
                      backgroundImage: imagetoview,
                    }}
                  ></div>
                ) : (
                  <div
                    className="particular-productimage"
                    style={{
                      backgroundImage:
                        "url(" +
                        "http://api.rjwada.com/assets/" +
                        `${images[0]}` +
                        ")",
                    }}
                  ></div>
                )}
                {/* <img
                height={600}
                // weight={1000}
                className="particular-productimage"
                src={`http://api.rjwada.com/assets/${image}`}
                alt=""
              /> */}
                {/* Image fetch end */}
              </div>

              {/* TRY ON */}
              <div className="try-section">
                {/* {MLimage ? (
                  <div
                    className="particular-productimage"
                    style={{
                      height: "550px",
                      width: "550px",
                      backgroundImage: "url(" + `${MLimage}` + ")",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                ) : (
                  <div style={{ marginTop: "-1000px" }}></div>
                )} */}

                <div className="tryon-lower-sec">
                  <div className="uploadbtn">
                    <input
                      id="imagefile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        loadfile(e.target.files[0]);
                        setuploadedimage(
                          URL.createObjectURL(e.target.files[0])
                        );
                      }}
                      // onChange={(e) => setuploadedimage(e.target.files[0])}
                      className="custom-file-input"
                      title=""
                      style={{
                        content: "Upload",
                      }}
                    />
                  </div>

                  <button
                    onClick={() =>
                      sendImg(
                        returnedEndpoint,
                        readers.result,
                        `${productId}`,
                        localStorage.getItem("uid")
                      )
                    }
                    style={{
                      background: "#B2EEEE",
                      border: "1px solid rgba(0, 0, 0, 0.137)",
                      borderRadius: "15px",
                      padding: "10px 30px",
                      fontWeight: "300",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    Tryon
                  </button>
                </div>
                <div class="button-content">
                  <AiOutlineInfoCircle style={{ marginRight: "5px" }} />
                  To use Try-On feature, click on Upload button, then click on
                  Tryon button
                </div>
              </div>
              {/* TRY ON */}
            </div>
          </div>

          <div className="product-detail-section">
            <div className="product-details-wrapper">
              <div className="product-manufac">Stubborn Factory</div>
              <div className="product-detail-header">
                <div className="product-detail-heading">{name}</div>
                {/* <div className="product-category-text">{description}</div> */}
              </div>
              <div className="product-category-text"></div>
              <div className="product-size-header">
                {" "}
                <br />
                <div className="product-size-heading">
                  <h3>Sizes</h3>
                </div>
                {/* <div className="product-size-chart-text">Size Chart</div> */}
                <div className="product-size-boxes">
                  {size[0] ? (
                    <button
                      className="product-size-item"
                      onClick={() => {
                        localStorage.setItem("size", size[0]);
                        setselectedsize(size[0]);
                      }}
                    >
                      {size[0]}
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      style={{ backgroundColor: "#D0D0D0" }}
                      className="product-size-item"
                      onClick={() => setselectedsize(size[0])}
                    >
                      S
                    </button>
                  )}
                  {size[1] ? (
                    <button
                      className="product-size-item"
                      onClick={() => {
                        localStorage.setItem("size", size[1]);
                        setselectedsize(size[1]);
                      }}
                    >
                      {size[1]}
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      style={{ backgroundColor: "#D0D0D0" }}
                      className="product-size-item"
                      onClick={() => setselectedsize(size[1])}
                    >
                      M
                    </button>
                  )}
                  {size[2] ? (
                    <button
                      className="product-size-item"
                      onClick={() => {
                        localStorage.setItem("size", size[2]);
                        setselectedsize(size[2]);
                      }}
                    >
                      {size[2]}
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      style={{ backgroundColor: "#D0D0D0" }}
                      className="product-size-item"
                      onClick={() => setselectedsize(size[2])}
                    >
                      L
                    </button>
                  )}
                  {size[3] ? (
                    <button
                      className="product-size-item"
                      onClick={() => {
                        localStorage.setItem("size", size[3]);
                        setselectedsize(size[3]);
                      }}
                    >
                      {size[3]}
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      style={{ backgroundColor: "#D0D0D0" }}
                      className="product-size-item"
                      onClick={() => setselectedsize(size[3])}
                    >
                      XL
                    </button>
                  )}
                  {size[4] ? (
                    <button
                      className="product-size-item"
                      onClick={() => {
                        localStorage.setItem("size", size[4]);
                        setselectedsize(size[4]);
                      }}
                    >
                      {size[4]}
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      style={{ backgroundColor: "#D0D0D0" }}
                      className="product-size-item"
                      onClick={() => setselectedsize(size[4])}
                    >
                      XXL
                    </button>
                  )}
                </div>
                <br />
              </div>
              {selectedsize == "S" ||
              selectedsize == "M" ||
              selectedsize == "L" ||
              selectedsize == "XL" ||
              selectedsize == "XXL" ? null : (
                <h3
                style={{
                  marginTop: "-8px",
                  marginLeft: "5px",
                  color: "red",
                  fontFamily:"Montserrat",
                }}
              >
                *Please select a size
              </h3>
              )}
              {sizenotselected ? null : console.log("Size selection needed")}
              <div className="size-lower-text">
                {/* Size Not Available? */}
                {/* <span className="product-notify">Notify Me</span> */}
              </div>
              {/* <div className="product-rating-section">
                <div className="star-rating">
                  <StarIcon style={{ color: "#FFAA15" }} />
                  <StarIcon style={{ color: "#FFAA15" }} />
                  <StarIcon style={{ color: "#FFAA15" }} />
                  <StarIcon style={{ color: "#FFAA15" }} />
                  <StarIcon style={{ color: "#FFAA15" }} />
                </div>
                <div className="text-rating">
                  <pre> 17 Rating and 28 Reviews</pre>
                </div>
              </div> */}
              <div className="product-price-section">
                <div className="product-price-text">₹ {price}</div>
                <div className="product-strike-price">₹ {discount}</div>
                {/* <div className="product-discount">50%</div> */}
              </div>
              <div className="tax-text">Price inclusive of all taxes</div>
              <div className="product-color-section">
                <div className="product-color-text">Colors:</div>
                <div className="product-color">
                  {/* Color add */}

                  {color[0] && (
                    <BsCircleFill
                      style={{
                        color: `${color[0]}`,
                        border: "1px solid black",
                        borderRadius: "30px",
                        margin: "9px",
                        fontSize: "20px",
                      }}
                    />
                  )}
                  {color[1] && (
                    <BsCircleFill
                      style={{
                        color: `${color[1]}`,
                        border: "1px solid black",
                        borderRadius: "30px",
                        margin: "9px",
                        fontSize: "20px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="product-btn-section">
                <div className="">
                  {!user || localStorage.getItem("city") === null ? (
                    <>
                      {!user ? (
                        <button
                          className="product-button-cart"
                          onClick={() => navigate("/login")}
                        >
                          Buy Now
                        </button>
                      ) : (
                        <button
                          className="product-button-cart"
                          onClick={() => navigate("/profile")}
                        >
                          Buy Now
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {!selectedsize ? (
                        <button
                          className="product-button-cart"
                          // onClick={() => navigate("/profile")}
                          disabled={true}
                        >
                          Buy Now
                        </button>
                      ) : (
                        <Razorpay
                          btnText="Buy Now"
                          className="product-button "
                          totalCartPrice={price}
                          dataToSend={tosend}
                        />
                      )}
                    </>
                  )}
                </div>
                <button
                  className="product-button-cart"
                  onClick={() => {
                    if (!selectedsize) {
                      setsizenotselected(false);
                    } else {
                      setTimeout(() => {
                        setsizenotselected(true);
                        console.log("size?", { selectedsize });
                        console.log("datas.data", datas.data);
                        addToCart(datas.data, selectedsize);
                        navigate("/cart");
                      }, 1000);
                    }
                  }}
                >
                  Add to cart
                </button>
                {/* <button
                  className="product-button-cart"
                  onClick={() => {
                    if (!selectedsize) {
                      setsizenotselected(false);
                    } else {
                      setTimeout(() => {
                        setsizenotselected(true);
                        console.log("size?", { selectedsize });
                        console.log("datas.data", datas.data);
                        addToWhishlist(datas.data, selectedsize);
                        navigate("/whishlist");
                      }, 1000);
                    }
                  }}
                >
                  Add to wishlist
                </button> */}
                <div
                  className="product-favourite-icon"
                  style={{
                    position: "relative",
                    bottom: "4.2rem",
                  }}
                  onClick={() => {
                    if (!selectedsize) {
                      setsizenotselected(false);
                      setClicked(false);
                    } else {
                      setClicked(true);
                    }
                  }}
                >
                  {clicked ? (
                    <BsHeartFill
                      style={{
                        fontSize: "28px",
                        cursor: "pointer",
                        color: "#B2EEEE",
                      }}
                    />
                  ) : (
                    <BsHeart
                      style={{
                        fontSize: "28px",
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => {
                        if (!selectedsize) {
                          setsizenotselected(false);
                        } else {
                          setTimeout(() => {
                            setsizenotselected(true);
                            console.log("size?", { selectedsize });
                            console.log("datas.data", datas.data);
                            addToWhishlist(datas.data, selectedsize);
                            navigate("/whishlist");
                          }, 1000);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              {/* <div className="quantity-section">
                <div className="quantity-text">Quantity</div>
                <input className="quantity-input-box" type="-" />
              </div>
              <div className="deliver-to-text">Deliver to</div>
              <div className="deliver-add-section">
                <input
                  type="text"
                  name=""
                  id=""
                  className="pincode-input"
                  placeholder="Enter Delivery Pincode"
                />
                <button className="pincode-check-btn">Check</button>
              </div> */}
            </div>

            {/* <div className="product-color-menu">
              <div className="product-color-item">
                <img src="" alt="color_img" />
              </div>
              <div className="product-color-item">
                <img src="" alt="color_img" />
              </div>
              <div className="product-color-item">
                <img src="" alt="color_img" />
              </div>
              <div className="product-color-item">
                <img src="" alt="color_img" />
              </div>
              <div className="product-color-item">
                <img src="" alt="color_img" />
              </div>
              <div className="product-color-item">
                <img src="" alt="color_img" />
              </div>
            </div> */}
            <div className="product-accordion">
              {/* <Accordion
                defaultExpanded={true}
                className="product-accordion-main"
              >
                <AccordionSummary
                  id="panel1-header"
                  className="product-accordion-header"
                  expandIcon={<ExpandMoreIcon />}
                  defaultExpanded={true}
                >
                  <div className="accordion-heading">Product Details</div>
                </AccordionSummary>
                <AccordionDetails className="product-accordion-detail">
                  <div className="product-detail-list">
                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Type :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Polo Neck</p>
                      </div>
                    </div>

                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Sleeve :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Long Sleeve</p>
                      </div>
                    </div>
                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Fit :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Regular</p>
                      </div>
                    </div>

                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Fabric :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Cotton Blend</p>
                      </div>
                    </div>
                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Pack of :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>1</p>
                      </div>
                    </div>

                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Neck Type :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Polo Neck</p>
                      </div>
                    </div>
                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Ideal For :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Unisex</p>
                      </div>
                    </div>

                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Size :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>S</p>
                      </div>
                    </div>
                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Pattern :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Solid</p>
                      </div>
                    </div>

                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Suitable For :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>Western Wear</p>
                      </div>
                    </div>
                    <div class="product-detail-row">
                      <div class="product-detail-column">
                        <p>Reversible :</p>
                      </div>
                      <div class="product-detail-column">
                        <p>No</p>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion> */}

              <Accordion
                defaultExpanded={false}
                className="product-accordion-main"
              >
                <AccordionSummary
                  id="panel1-header"
                  className="product-accordion-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className="accordion-heading">Product Features</div>
                </AccordionSummary>
                <AccordionDetails className="product-accordion-detail">
                  {features}
                </AccordionDetails>
              </Accordion>

              <Accordion
                defaultExpanded={false}
                className="product-accordion-main"
              >
                <AccordionSummary
                  id="panel1-header"
                  className="product-accordion-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className="accordion-heading">Product Description</div>
                </AccordionSummary>
                <AccordionDetails className="product-accordion-detail">
                  {description}
                </AccordionDetails>
              </Accordion>
              <Accordion
                defaultExpanded={false}
                className="product-accordion-main"
              >
                <AccordionSummary
                  id="panel1-header"
                  className="product-accordion-header"
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className="accordion-heading">Refund and Returns</div>
                </AccordionSummary>
                <AccordionDetails className="product-accordion-detail">
                  Returning a product on Rjwada is simple; all you have to do is
                  take a screenshot of the mail you got from Razorpay; a clear
                  picture of the product & it's packaging. Combine these images
                  and mail that to support@rjwada.com along with the reason of
                  return. A genuine reason for return and refund would be
                  considered. After review we'll get back to you via your email
                  or phone number you provided in profile section. You can
                  update these in profile section. You'll receive your refund
                  within 4 working days.
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
        {/* <div className="section-two">
          <div className="product-row-wrapper">
            <div className="product-row-heading">
              You might be interested in
            </div>
            <div className="product-row">
              <div className="product-card-comp">
                <ProductCard/>
              </div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
            </div>
          </div>
          <div className="product-row-wrapper">
            <div className="product-row-heading">Similar Products</div>
            <div className="product-row">
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
            </div>
          </div>
          <div className="product-row-wrapper">
            <div className="product-row-heading">Recently Viewed</div>
            <div className="product-row">
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
            </div>
          </div>
          <div className="product-row-wrapper">
            <div className="product-row-heading">
              Customers who bought this item also bought
            </div>
            <div className="product-row">
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
              <div className="product-card-comp">  <ProductCard/></div>
            </div>
          </div>
        </div> */}
        <Footer />
      </div>
    </div>
  );
};

export default ParticularProduct;























// import React from "react";
// import Navbar from "../components/Navbar";
// import { useState, useEffect } from "react";
// import Toplist from "../components/Toplist";
// import { Link, useParams } from "react-router-dom";
// import "./ParticularProduct.css";
// import Razorpay from "../components/Razorpay";
// import { auth, fs, storage, initializeAuthentication } from "../config/Config";
// import { useNavigate } from "react-router-dom";
// import { senddata } from "../components/send";
// import { BsCircleFill } from "react-icons/bs";
// import { BsHeartFill } from "react-icons/bs";
// import { BsHeart } from "react-icons/bs";
// import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Footer from "../components/Footer";
// import Carousel from "react-material-ui-carousel";
// import { Paper, Button } from "@mui/material";
// import { AiOutlineInfoCircle } from "react-icons/ai";

// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import "firebase/compat/storage";
// import "firebase/compat/database";

// const ParticularProduct = ({ addToCart, addToWhishlist }) => {
//   const navigate = useNavigate();

//   function Getcurrentuser() {
//     const [user, setuser] = useState(null);
//     useEffect(() => {
//       auth.onAuthStateChanged((user) => {
//         if (user) {
//           fs.collection("users")
//             .doc(user.uid)
//             .get()
//             .then((snapshot) => {
//               setuser(snapshot.data().Fullname);
//             });
//         } else {
//           setuser(null);
//         }
//       });
//     }, []);
//     return user;
//   }

//   const user = Getcurrentuser();

//   const { id } = useParams();

//   const [data, setData] = useState(null);
//   console.log(data);
//   useEffect(() => {
//     fetch("http://api.rjwada.com/items/products")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(
//             `This is an HTTP error: The status is ${response.status}`
//           );
//         }
//         return response.json();
//       })
//       .then((actualdata) => {
//         setData(actualdata.data);
//       })
//       .catch((err) => {
//         console.log(err.message);
//       });
//   }, []);

//   const [selectedsize, setselectedsize] = useState("");
//   const [name, setname] = useState("Product name");
//   const [size, setsize] = useState("");
//   const [image, setimage] = useState([]);
//   const [images, setimages] = useState([]);
//   const [categoryId, setcategoryId] = useState("");
//   const [productId, setproductId] = useState("");
//   const [price, setprice] = useState("Product price");
//   const [description, setdescription] = useState("Product description");
//   const [datas, setdata] = useState({});
//   const [banner, setbanner] = useState("Product img");
//   const [color, setColor] = useState({});
//   const [discount, setDiscount] = useState("");
//   const [features, setFeatures] = useState("");

//   useEffect(() => {
//     data &&
//       data.map((data) =>
//         data.id == id
//           ? (setdata({ data, selectedsize }),
//             setname(data.name),
//             setimage(data.images[0]),
//             setimages(data.images),
//             setsize(data.sizes),
//             setcategoryId(data.category_id),
//             setproductId(data.id),
//             setprice(data.price),
//             setdescription(data.description),
//             setbanner(data.banner),
//             setColor(data.colours),
//             setDiscount(data.discount),
//             setFeatures(data.features))
//           : null
//       );
//   }, [data]);
//   console.log(datas);
//   datas["categoryId"] = categoryId;
//   console.log(selectedsize);

//   let quantity = 1;

//   let tosend = {};
//   tosend["userid_id"] = localStorage.getItem("uid");
//   tosend["name"] = name;
//   tosend["quantity"] = quantity;
//   tosend["size"] = selectedsize;
//   tosend["categoryId"] = categoryId;
//   tosend["product_id"] = productId;
//   tosend["productPrice"] = price;
//   tosend["description"] = description;
//   tosend["banner"] = banner;
//   tosend["color"] = color;

//   useEffect(() => {
//     if (localStorage.getItem("paymentdone") === true) {
//       console.log("paymentdone");
//       senddata(tosend);
//       localStorage.setItem("paymentdone", false);
//     } else {
//       localStorage.setItem("paymentdone", false);
//     }
//   }, []);
//   const [clicked, setClicked] = useState(false);

//   async function sendImg(endpoint, base64_str, prod_id, user_id) {
//     let headersList = {
//       "Access-Control-Allow-Origin": "*",
//     };

//     console.log(base64_str.split("data:image/jpeg;base64,")[1]);

//     let bodyContent = new FormData();
//     bodyContent.append(
//       "base64_str",
//       base64_str.split("data:image/jpeg;base64,")[1]
//     );
//     console.log(returnedEndpoint);
//     let uun = Date.now() * Math.random();
//     bodyContent.append("filename", `${prod_id}*${user_id}*${uun}`);

//     let response = fetch(endpoint, {
//       method: "POST",
//       mode: "no-cors",
//       body: bodyContent,
//       headers: headersList,
//     });

//     console.log("done");
//     response.then((a) => {
//       console.log(a);
//       getImageURL(`${prod_id}*${user_id}*${uun}`);
//     });
//   }

//   var storage = firebase.storage();

//   var storageRef = storage.ref();

//   // var storageRefImgs = storageRef.child("images");

//   const [MLimage, setMLimage] = useState("");
//   function getImageURL(imageName) {
//     // "imageName" is the (<str>) full name of image with extensions.
//     // It's just the name, do not pass anything else with it.
//     // Example: getImageURL("00133_00.jpg");

//     storageRef
//       .child(`images/${imageName}`)
//       .getDownloadURL()
//       .then((url) => {
//         // This is the actual URL (encrypted by Google).
//         // Use it however you want to.
//         console.log("final image url", url);
//         setMLimage(url);
//         // setimagetoview(url)
//         return url;
//       });
//   }

//   initializeAuthentication();
//   const [returnedEndpoint, setreturnedEndpoint] = useState("");
//   const getEndpoint = () => {
//     // This function returns endpoint that is to be called by Fetch request.
//     console.log("function called");
//     var dbRef = firebase.database().ref().child("URL");
//     dbRef.on("value", (snap) => {
//       var endpoint = snap.val()["URL"] + "/upload";
//       // console.log('this is endpoint - ', endpoint);
//       // console.log('this is endpoint - ', endpoint);
//       setreturnedEndpoint(endpoint);
//       return endpoint;
//     });
//   };
//   console.log(returnedEndpoint);

//   console.log(size);

//   const [base64, setbase64] = useState("");
//   const [readers, setreaders] = useState({});
//   function loadfile(images) {
//     getEndpoint();
//     var reader = new FileReader();
//     reader.onload = function () {
//       var output = document.getElementById("output");
//       setreaders(reader);
//       output.src = readers.result;
//       var res = readers.result;
//       setbase64(res);
//       return res;
//     };
//     reader.readAsDataURL(images);
//   }
//   console.log(base64);
//   console.log(readers.result);

//   const [sizenotselected, setsizenotselected] = useState(false);
//   const [imagetoview, setimagetoview] = useState("");
//   const [uploadedimage, setuploadedimage] = useState("");

//   console.log(uploadedimage);

//   return (
//     <div>
//       {/* <Toplist /> */}
//       <div className="part-product-wrapper">
//         <div className="section-one">
//           <div className="product-image-section">
//             <div className="vertical-slider">
//               <div
//                 onClick={() => {
//                   setimagetoview(
//                     "url(" +
//                       "http://api.rjwada.com/assets/" +
//                       `${images[0]}` +
//                       ")"
//                   );
//                 }}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage:
//                     "url(" +
//                     "http://api.rjwada.com/assets/" +
//                     `${images[0]}` +
//                     ")",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>
//               <div
//                 onClick={() => {
//                   setimagetoview(
//                     "url(" +
//                       "http://api.rjwada.com/assets/" +
//                       `${images[1]}` +
//                       ")"
//                   );
//                 }}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage:
//                     "url(" +
//                     "http://api.rjwada.com/assets/" +
//                     `${images[1]}` +
//                     ")",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>
//               <div
//                 onClick={() => {
//                   setimagetoview(
//                     "url(" +
//                       "http://api.rjwada.com/assets/" +
//                       `${images[2]}` +
//                       ")"
//                   );
//                 }}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage:
//                     "url(" +
//                     "http://api.rjwada.com/assets/" +
//                     `${images[2]}` +
//                     ")",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>
//               {MLimage ? (
//                 <div
//                   onClick={() => {
//                     setimagetoview("url(" + MLimage + ")");
//                   }}
//                   className="vertical-slider-item"
//                   style={{
//                     backgroundImage: "url(" + MLimage + ")",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                   }}
//                 ></div>
//               ) : (
//                 <div
//                   onClick={() => {
//                     setimagetoview("url(" + uploadedimage + ")");
//                   }}
//                   className="vertical-slider-item"
//                   style={{
//                     backgroundImage: "url(" + uploadedimage + ")",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                   }}
//                 ></div>
//               )}
//               <div
//                 // onClick={()=>{setimagetoview("url(" +
//                 // "http://api.rjwada.com/assets/" +
//                 // `${images[2]}` +
//                 // ")")}}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage: "url(" + { uploadedimage } + ")",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               ></div>
//               {/* <img src={require(images[0])} alt="" /> */}
//             </div>

//             <div>
//               <div
//                 className="product-image-slider"
//                 style={{ overflow: "hidden", height: "600px" }}
//               >
//                 {/* image fetch start */}
//                 {imagetoview ? (
//                   <div
//                     className="particular-productimage"
//                     style={{
//                       height: "550px",
//                       width: "550px",
//                       backgroundImage: imagetoview,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                   ></div>
//                 ) : (
//                   <div
//                     className="particular-productimage"
//                     style={{
//                       height: "550px",
//                       width: "550px",
//                       backgroundImage:
//                         "url(" +
//                         "http://api.rjwada.com/assets/" +
//                         `${images[0]}` +
//                         ")",
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                   ></div>
//                 )}
//                 {/* <img
//                 height={600}
//                 // weight={1000}
//                 className="particular-productimage"
//                 src={`http://api.rjwada.com/assets/${image}`}
//                 alt=""
//               /> */}
//                 {/* Image fetch end */}
//               </div>

//               {/* TRY ON */}
//               <div
//                 className="try-section"
//                 style={{
//                   // border: "1px solid red",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-evenly",
//                   alignItems: "center",
//                 }}
//               >
//                 {/* {MLimage ? (
//                   <div
//                     className="particular-productimage"
//                     style={{
//                       height: "550px",
//                       width: "550px",
//                       backgroundImage: "url(" + `${MLimage}` + ")",
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                   ></div>
//                 ) : (
//                   <div style={{ marginTop: "-1000px" }}></div>
//                 )} */}

//                 <div
//                   className="tryon-lower-sec"
//                   style={{
//                     display: "flex",
//                     width: "500px",
//                     justifyContent: "space-between",
//                     padding: "10px 0px",
//                     // border: "1px solid red",
//                   }}
//                 >
//                   <div
//                     className="uploadbtn"
//                     style={{
//                       // border: "1px solid #ccc",
//                       cursor: "pointer",
//                       width: "150px",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <input
//                       id="imagefile"
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         loadfile(e.target.files[0]);
//                         setuploadedimage(
//                           URL.createObjectURL(e.target.files[0])
//                         );
//                       }}
//                       // onChange={(e) => setuploadedimage(e.target.files[0])}
//                       className="custom-file-input"
//                       title=""
//                       style={{
//                         content: "Upload",
//                       }}
//                     />
//                   </div>

//                   <button
//                     onClick={() =>
//                       sendImg(
//                         returnedEndpoint,
//                         readers.result,
//                         `${productId}`,
//                         localStorage.getItem("uid")
//                       )
//                     }
//                     style={{
//                       background: "#B2EEEE",
//                       border: "1px solid rgba(0, 0, 0, 0.137)",
//                       borderRadius: "15px",
//                       padding: "10px 30px",
//                       fontWeight: "300",
//                       fontSize: "18px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Tryon
//                   </button>
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "center" }}>
//                   <AiOutlineInfoCircle style={{ marginRight: "5px" }} />
//                   To use Try-On feature, click on Upload button, then click on
//                   Tryon button
//                 </div>
//               </div>
//               {/* TRY ON */}
//             </div>
//           </div>

//           <div className="product-detail-section">
//             <div className="product-details-wrapper">
//               <div className="product-manufac">Stubborn Factory</div>
//               <div className="product-detail-header">
//                 <div className="product-detail-heading">{name}</div>
//                 {/* <div className="product-category-text">{description}</div> */}
//               </div>
//               <div className="product-category-text"></div>
//               <div className="product-size-header">
//                 {" "}
//                 <br />
//                 <div className="product-size-heading">
//                   <h3>Sizes</h3>
//                 </div>
//                 {/* <div className="product-size-chart-text">Size Chart</div> */}
//                 <div className="product-size-boxes">
//                   {size[0] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[0]);
//                         setselectedsize(size[0]);
//                       }}
//                     >
//                       {size[0]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[0])}
//                     >
//                       S
//                     </button>
//                   )}
//                   {size[1] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[1]);
//                         setselectedsize(size[1]);
//                       }}
//                     >
//                       {size[1]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[1])}
//                     >
//                       M
//                     </button>
//                   )}
//                   {size[2] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[2]);
//                         setselectedsize(size[2]);
//                       }}
//                     >
//                       {size[2]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[2])}
//                     >
//                       L
//                     </button>
//                   )}
//                   {size[3] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[3]);
//                         setselectedsize(size[3]);
//                       }}
//                     >
//                       {size[3]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[3])}
//                     >
//                       XL
//                     </button>
//                   )}
//                   {size[4] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[4]);
//                         setselectedsize(size[4]);
//                       }}
//                     >
//                       {size[4]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[4])}
//                     >
//                       XXL
//                     </button>
//                   )}
//                 </div>
//                 <br />
//               </div>
//               {selectedsize == "S" ||
//               selectedsize == "M" ||
//               selectedsize == "L" ||
//               selectedsize == "XL" ||
//               selectedsize == "XXL" ? null : (
//                 <h3
//                   style={{
//                     marginTop: "-20px",
//                     marginLeft: "5px",
//                     color: "red",
//                   }}
//                 >
//                   *Please select a size
//                 </h3>
//               )}
//               {sizenotselected ? null : console.log("Size selection needed")}
//               <div className="size-lower-text">
//                 {/* Size Not Available? */}
//                 {/* <span className="product-notify">Notify Me</span> */}
//               </div>
//               {/* <div className="product-rating-section">
//                 <div className="star-rating">
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                 </div>
//                 <div className="text-rating">
//                   <pre> 17 Rating and 28 Reviews</pre>
//                 </div>
//               </div> */}
//               <div className="product-price-section">
//                 <div className="product-price-text">₹ {price}</div>
//                 <div className="product-strike-price">₹ {discount}</div>
//                 {/* <div className="product-discount">50%</div> */}
//               </div>
//               <div className="tax-text">Price inclusive of all taxes</div>
//               <div className="product-color-section">
//                 <div className="product-color-text">Colors:</div>
//                 <div className="product-color">
//                   {/* Color add */}

//                   {color[0] && (
//                     <BsCircleFill
//                       style={{
//                         color: `${color[0]}`,
//                         border: "1px solid black",
//                         borderRadius: "30px",
//                         margin: "9px",
//                         fontSize: "20px",
//                       }}
//                     />
//                   )}
//                   {color[1] && (
//                     <BsCircleFill
//                       style={{
//                         color: `${color[1]}`,
//                         border: "1px solid black",
//                         borderRadius: "30px",
//                         margin: "9px",
//                         fontSize: "20px",
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//               <div className="product-btn-section">
//                 <div className="">
//                   {!user || localStorage.getItem("city") === null ? (
//                     <>
//                       {!user ? (
//                         <button
//                           className="product-button-cart"
//                           onClick={() => navigate("/login")}
//                         >
//                           Buy Now
//                         </button>
//                       ) : (
//                         <button
//                           className="product-button-cart"
//                           onClick={() => navigate("/profile")}
//                         >
//                           Buy Now
//                         </button>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       {!selectedsize ? (
//                         <button
//                           className="product-button-cart"
//                           // onClick={() => navigate("/profile")}
//                           disabled={true}
//                         >
//                           Buy Now
//                         </button>
//                       ) : (
//                         <Razorpay
//                           btnText="Buy Now"
//                           className="product-button "
//                           totalCartPrice={price}
//                           dataToSend={tosend}
//                         />
//                       )}
//                     </>
//                   )}
//                 </div>
//                 <button
//                   className="product-button-cart"
//                   onClick={() => {
//                     if (!selectedsize) {
//                       setsizenotselected(false);
//                     } else {
//                       setTimeout(() => {
//                         setsizenotselected(true);
//                         console.log("size?", { selectedsize });
//                         console.log("datas.data", datas.data);
//                         addToCart(datas.data, selectedsize);
//                         navigate("/cart");
//                       }, 1000);
//                     }
//                   }}
//                 >
//                   Add to cart
//                 </button>
//                 {/* <button
//                   className="product-button-cart"
//                   onClick={() => {
//                     if (!selectedsize) {
//                       setsizenotselected(false);
//                     } else {
//                       setTimeout(() => {
//                         setsizenotselected(true);
//                         console.log("size?", { selectedsize });
//                         console.log("datas.data", datas.data);
//                         addToWhishlist(datas.data, selectedsize);
//                         navigate("/whishlist");
//                       }, 1000);
//                     }
//                   }}
//                 >
//                   Add to wishlist
//                 </button> */}
//                 <div
//                   className="product-favourite-icon"
//                   style={{
//                     position: "relative",
//                     bottom: "4.2rem",
//                   }}
//                   onClick={() => {
//                     if (!selectedsize) {
//                       setsizenotselected(false);
//                       setClicked(false);
//                     } else {
//                       setClicked(true);
//                     }
//                   }}
//                 >
//                   {clicked ? (
//                     <BsHeartFill
//                       style={{
//                         fontSize: "28px",
//                         cursor: "pointer",
//                         color: "#B2EEEE",
//                       }}
//                     />
//                   ) : (
//                     <BsHeart
//                       style={{
//                         fontSize: "28px",
//                         cursor: "pointer",
//                         color: "black",
//                       }}
//                       onClick={() => {
//                         if (!selectedsize) {
//                           setsizenotselected(false);
//                         } else {
//                           setTimeout(() => {
//                             setsizenotselected(true);
//                             console.log("size?", { selectedsize });
//                             console.log("datas.data", datas.data);
//                             addToWhishlist(datas.data, selectedsize);
//                             navigate("/whishlist");
//                           }, 1000);
//                         }
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//               {/* <div className="quantity-section">
//                 <div className="quantity-text">Quantity</div>
//                 <input className="quantity-input-box" type="-" />
//               </div>
//               <div className="deliver-to-text">Deliver to</div>
//               <div className="deliver-add-section">
//                 <input
//                   type="text"
//                   name=""
//                   id=""
//                   className="pincode-input"
//                   placeholder="Enter Delivery Pincode"
//                 />
//                 <button className="pincode-check-btn">Check</button>
//               </div> */}
//             </div>

//             {/* <div className="product-color-menu">
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//             </div> */}
//             <div className="product-accordion">
//               {/* <Accordion
//                 defaultExpanded={true}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                   defaultExpanded={true}
//                 >
//                   <div className="accordion-heading">Product Details</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   <div className="product-detail-list">
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Type :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Polo Neck</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Sleeve :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Long Sleeve</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Fit :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Regular</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Fabric :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Cotton Blend</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Pack of :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>1</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Neck Type :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Polo Neck</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Ideal For :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Unisex</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Size :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>S</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Pattern :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Solid</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Suitable For :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Western Wear</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Reversible :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>No</p>
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionDetails>
//               </Accordion> */}

//               <Accordion
//                 defaultExpanded={false}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                 >
//                   <div className="accordion-heading">Product Features</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   {features}
//                 </AccordionDetails>
//               </Accordion>

//               <Accordion
//                 defaultExpanded={false}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                 >
//                   <div className="accordion-heading">Product Description</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   {description}
//                 </AccordionDetails>
//               </Accordion>
//               <Accordion
//                 defaultExpanded={false}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                 >
//                   <div className="accordion-heading">Refund and Returns</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   Returning a product on Rjwada is simple; all you have to do is
//                   take a screenshot of the mail you got from Razorpay; a clear
//                   picture of the product & it's packaging. Combine these images
//                   and mail that to support@rjwada.com along with the reason of
//                   return. A genuine reason for return and refund would be
//                   considered. After review we'll get back to you via your email
//                   or phone number you provided in profile section. You can
//                   update these in profile section. You'll receive your refund
//                   within 4 working days.
//                 </AccordionDetails>
//               </Accordion>
//             </div>
//           </div>
//         </div>
//         {/* <div className="section-two">
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">
//               You might be interested in
//             </div>
//             <div className="product-row">
//               <div className="product-card-comp">
//                 <ProductCard/>
//               </div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">Similar Products</div>
//             <div className="product-row">
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">Recently Viewed</div>
//             <div className="product-row">
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">
//               Customers who bought this item also bought
//             </div>
//             <div className="product-row">
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//         </div> */}
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default ParticularProduct;




// import React from "react";
// import Navbar from "../components/Navbar";
// import { useState, useEffect } from "react";
// import Toplist from "../components/Toplist";
// import { Link, useParams } from "react-router-dom";
// import "./ParticularProduct.css";
// import Razorpay from "../components/Razorpay";
// import { auth, fs, storage, initializeAuthentication } from "../config/Config";
// import { useNavigate } from "react-router-dom";
// import { senddata } from "../components/send";
// import { BsCircleFill } from "react-icons/bs";
// import { BsHeartFill } from "react-icons/bs";
// import { BsHeart } from "react-icons/bs";
// import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Footer from "../components/Footer";
// import Carousel from "react-material-ui-carousel";
// import { Paper, Button } from "@mui/material";
// import { AiOutlineInfoCircle } from "react-icons/ai";

// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import "firebase/compat/storage";
// import "firebase/compat/database";

// const ParticularProduct = ({ addToCart, addToWhishlist }) => {
//   const navigate = useNavigate();

//   function Getcurrentuser() {
//     const [user, setuser] = useState(null);
//     useEffect(() => {
//       auth.onAuthStateChanged((user) => {
//         if (user) {
//           fs.collection("users")
//             .doc(user.uid)
//             .get()
//             .then((snapshot) => {
//               setuser(snapshot.data().Fullname);
//             });
//         } else {
//           setuser(null);
//         }
//       });
//     }, []);
//     return user;
//   }

//   const user = Getcurrentuser();

//   const { id } = useParams();

//   const [data, setData] = useState(null);
//   console.log(data);
//   useEffect(() => {
//     fetch("http://api.rjwada.com/items/products")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(
//             `This is an HTTP error: The status is ${response.status}`
//           );
//         }
//         return response.json();
//       })
//       .then((actualdata) => {
//         setData(actualdata.data);
//       })
//       .catch((err) => {
//         console.log(err.message);
//       });
//   }, []);

//   const [selectedsize, setselectedsize] = useState("");
//   const [name, setname] = useState("Product name");
//   const [size, setsize] = useState("");
//   const [image, setimage] = useState([]);
//   const [images, setimages] = useState([]);
//   const [categoryId, setcategoryId] = useState("");
//   const [productId, setproductId] = useState("");
//   const [price, setprice] = useState("Product price");
//   const [description, setdescription] = useState("Product description");
//   const [datas, setdata] = useState({});
//   const [banner, setbanner] = useState("Product img");
//   const [color, setColor] = useState({});
//   const [discount, setDiscount] = useState("");
//   const [features, setFeatures] = useState("");

//   useEffect(() => {
//     data &&
//       data.map((data) =>
//         data.id == id
//           ? (setdata({ data, selectedsize }),
//             setname(data.name),
//             setimage(data.images[0]),
//             setimages(data.images),
//             setsize(data.sizes),
//             setcategoryId(data.category_id),
//             setproductId(data.id),
//             setprice(data.price),
//             setdescription(data.description),
//             setbanner(data.banner),
//             setColor(data.colours),
//             setDiscount(data.discount),
//             setFeatures(data.features))
//           : null
//       );
//   }, [data]);
//   console.log(datas);
//   datas["categoryId"] = categoryId;
//   console.log(selectedsize);

//   let quantity = 1;

//   let tosend = {};
//   tosend["userid_id"] = localStorage.getItem("uid");
//   tosend["name"] = name;
//   tosend["quantity"] = quantity;
//   tosend["size"] = selectedsize;
//   tosend["categoryId"] = categoryId;
//   tosend["product_id"] = productId;
//   tosend["productPrice"] = price;
//   tosend["description"] = description;
//   tosend["banner"] = banner;
//   tosend["color"] = color;

//   useEffect(() => {
//     if (localStorage.getItem("paymentdone") === true) {
//       console.log("paymentdone");
//       senddata(tosend);
//       localStorage.setItem("paymentdone", false);
//     } else {
//       localStorage.setItem("paymentdone", false);
//     }
//   }, []);
//   const [clicked, setClicked] = useState(false);

//   async function sendImg(endpoint, base64_str, prod_id, user_id) {
//     let headersList = {
//       "Access-Control-Allow-Origin": "*",
//     };

//     console.log(base64_str.split("data:image/jpeg;base64,")[1]);

//     let bodyContent = new FormData();
//     bodyContent.append(
//       "base64_str",
//       base64_str.split("data:image/jpeg;base64,")[1]
//     );
//     console.log(returnedEndpoint);
//     let uun = Date.now() * Math.random();
//     bodyContent.append("filename", `${prod_id}*${user_id}*${uun}`);

//     let response = fetch(endpoint, {
//       method: "POST",
//       mode: "no-cors",
//       body: bodyContent,
//       headers: headersList,
//     });

//     console.log("done");
//     response.then((a) => {
//       console.log(a);
//       getImageURL(`${prod_id}*${user_id}*${uun}`);
//     });
//   }

//   var storage = firebase.storage();

//   var storageRef = storage.ref();

//   // var storageRefImgs = storageRef.child("images");

//   const [MLimage, setMLimage] = useState("");
//   function getImageURL(imageName) {
//     // "imageName" is the (<str>) full name of image with extensions.
//     // It's just the name, do not pass anything else with it.
//     // Example: getImageURL("00133_00.jpg");

//     storageRef
//       .child(`images/${imageName}`)
//       .getDownloadURL()
//       .then((url) => {
//         // This is the actual URL (encrypted by Google).
//         // Use it however you want to.
//         console.log("final image url", url);
//         setMLimage(url);
//         // setimagetoview(url)
//         return url;
//       });
//   }

//   initializeAuthentication();
//   const [returnedEndpoint, setreturnedEndpoint] = useState("");
//   const getEndpoint = () => {
//     // This function returns endpoint that is to be called by Fetch request.
//     console.log("function called");
//     var dbRef = firebase.database().ref().child("URL");
//     dbRef.on("value", (snap) => {
//       var endpoint = snap.val()["URL"] + "/upload";
//       // console.log('this is endpoint - ', endpoint);
//       // console.log('this is endpoint - ', endpoint);
//       setreturnedEndpoint(endpoint);
//       return endpoint;
//     });
//   };
//   console.log(returnedEndpoint);

//   console.log(size);

//   const [base64, setbase64] = useState("");
//   const [readers, setreaders] = useState({});
//   function loadfile(images) {
//     getEndpoint();
//     var reader = new FileReader();
//     reader.onload = function () {
//       var output = document.getElementById("output");
//       setreaders(reader);
//       output.src = readers.result;
//       var res = readers.result;
//       setbase64(res);
//       return res;
//     };
//     reader.readAsDataURL(images);
//   }
//   console.log(base64);
//   console.log(readers.result);

//   const [sizenotselected, setsizenotselected] = useState(false);
//   const [imagetoview, setimagetoview] = useState("");
//   const [uploadedimage, setuploadedimage] = useState("");

//   console.log(uploadedimage);

//   return (
//     <div>
//       {/* <Toplist /> */}
//       <div className="part-product-wrapper">
//         <div className="section-one">
//           <div className="product-image-section">
//             <div className="vertical-slider">
//               <div
//                 onClick={() => {
//                   setimagetoview(
//                     "url(" +
//                       "http://api.rjwada.com/assets/" +
//                       `${images[0]}` +
//                       ")"
//                   );
//                 }}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage:
//                     "url(" +
//                     "http://api.rjwada.com/assets/" +
//                     `${images[0]}` +
//                     ")",
//                 }}
//               ></div>
//               <div
//                 onClick={() => {
//                   setimagetoview(
//                     "url(" +
//                       "http://api.rjwada.com/assets/" +
//                       `${images[1]}` +
//                       ")"
//                   );
//                 }}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage:
//                     "url(" +
//                     "http://api.rjwada.com/assets/" +
//                     `${images[1]}` +
//                     ")",
//                 }}
//               ></div>
//               <div
//                 onClick={() => {
//                   setimagetoview(
//                     "url(" +
//                       "http://api.rjwada.com/assets/" +
//                       `${images[2]}` +
//                       ")"
//                   );
//                 }}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage:
//                     "url(" +
//                     "http://api.rjwada.com/assets/" +
//                     `${images[2]}` +
//                     ")",
//                 }}
//               ></div>
//               {MLimage ? (
//                 <div
//                   onClick={() => {
//                     setimagetoview("url(" + MLimage + ")");
//                   }}
//                   className="vertical-slider-item"
//                   style={{
//                     backgroundImage: "url(" + MLimage + ")",
//                   }}
//                 ></div>
//               ) : (
//                 <div
//                   onClick={() => {
//                     setimagetoview("url(" + uploadedimage + ")");
//                   }}
//                   className="vertical-slider-item"
//                   style={{
//                     backgroundImage: "url(" + uploadedimage + ")",
//                   }}
//                 ></div>
//               )}
//               <div
//                 // onClick={()=>{setimagetoview("url(" +
//                 // "http://api.rjwada.com/assets/" +
//                 // `${images[2]}` +
//                 // ")")}}
//                 className="vertical-slider-item"
//                 style={{
//                   backgroundImage: "url(" + { uploadedimage } + ")",
//                 }}
//               ></div>
//               {/* <img src={require(images[0])} alt="" /> */}
//             </div>

//             <div>
//               <div className="product-image-slider">
//                 {/* image fetch start */}
//                 {imagetoview ? (
//                   <div
//                     className="particular-productimage"
//                     style={{
//                       backgroundImage: imagetoview,
//                     }}
//                   ></div>
//                 ) : (
//                   <div
//                     className="particular-productimage"
//                     style={{
//                       backgroundImage:
//                         "url(" +
//                         "http://api.rjwada.com/assets/" +
//                         `${images[0]}` +
//                         ")",
//                     }}
//                   ></div>
//                 )}
//                 {/* <img
//                 height={600}
//                 // weight={1000}
//                 className="particular-productimage"
//                 src={`http://api.rjwada.com/assets/${image}`}
//                 alt=""
//               /> */}
//                 {/* Image fetch end */}
//               </div>

//               {/* TRY ON */}
//               <div className="try-section">
//                 {/* {MLimage ? (
//                   <div
//                     className="particular-productimage"
//                     style={{
//                       height: "550px",
//                       width: "550px",
//                       backgroundImage: "url(" + `${MLimage}` + ")",
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                   ></div>
//                 ) : (
//                   <div style={{ marginTop: "-1000px" }}></div>
//                 )} */}

//                 <div className="tryon-lower-sec">
//                   <div className="uploadbtn">
//                     <input
//                       id="imagefile"
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => {
//                         loadfile(e.target.files[0]);
//                         setuploadedimage(
//                           URL.createObjectURL(e.target.files[0])
//                         );
//                       }}
//                       // onChange={(e) => setuploadedimage(e.target.files[0])}
//                       className="custom-file-input"
//                       title=""
//                       style={{
//                         content: "Upload",
//                       }}
//                     />
//                   </div>

//                   <button
//                     onClick={() =>
//                       sendImg(
//                         returnedEndpoint,
//                         readers.result,
//                         `${productId}`,
//                         localStorage.getItem("uid")
//                       )
//                     }
//                     style={{
//                       background: "#B2EEEE",
//                       border: "1px solid rgba(0, 0, 0, 0.137)",
//                       borderRadius: "15px",
//                       padding: "10px 30px",
//                       fontWeight: "300",
//                       fontSize: "18px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Tryon
//                   </button>
//                 </div>
//                 <div class="button-content">
//                   <AiOutlineInfoCircle style={{ marginRight: "5px" }} />
//                   To use Try-On feature, click on Upload button, then click on
//                   Tryon button
//                 </div>
//               </div>
//               {/* TRY ON */}
//             </div>
//           </div>

//           <div className="product-detail-section">
//             <div className="product-details-wrapper">
//               <div className="product-manufac">Stubborn Factory</div>
//               <div className="product-detail-header">
//                 <div className="product-detail-heading">{name}</div>
//                 {/* <div className="product-category-text">{description}</div> */}
//               </div>
//               <div className="product-category-text"></div>
//               <div className="product-size-header">
//                 {" "}
//                 <br />
//                 <div className="product-size-heading">
//                   <h3>Sizes</h3>
//                 </div>
//                 {/* <div className="product-size-chart-text">Size Chart</div> */}
//                 <div className="product-size-boxes">
//                   {size[0] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[0]);
//                         setselectedsize(size[0]);
//                       }}
//                     >
//                       {size[0]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[0])}
//                     >
//                       S
//                     </button>
//                   )}
//                   {size[1] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[1]);
//                         setselectedsize(size[1]);
//                       }}
//                     >
//                       {size[1]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[1])}
//                     >
//                       M
//                     </button>
//                   )}
//                   {size[2] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[2]);
//                         setselectedsize(size[2]);
//                       }}
//                     >
//                       {size[2]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[2])}
//                     >
//                       L
//                     </button>
//                   )}
//                   {size[3] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[3]);
//                         setselectedsize(size[3]);
//                       }}
//                     >
//                       {size[3]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[3])}
//                     >
//                       XL
//                     </button>
//                   )}
//                   {size[4] ? (
//                     <button
//                       className="product-size-item"
//                       onClick={() => {
//                         localStorage.setItem("size", size[4]);
//                         setselectedsize(size[4]);
//                       }}
//                     >
//                       {size[4]}
//                     </button>
//                   ) : (
//                     <button
//                       disabled={true}
//                       style={{ backgroundColor: "#D0D0D0" }}
//                       className="product-size-item"
//                       onClick={() => setselectedsize(size[4])}
//                     >
//                       XXL
//                     </button>
//                   )}
//                 </div>
//                 <br />
//               </div>
//               {selectedsize == "S" ||
//               selectedsize == "M" ||
//               selectedsize == "L" ||
//               selectedsize == "XL" ||
//               selectedsize == "XXL" ? null : (
//                 <h3 class="selectSize">*Please select a size</h3>
//               )}
//               {sizenotselected ? null : console.log("Size selection needed")}
//               <div className="size-lower-text">
//                 {/* Size Not Available? */}
//                 {/* <span className="product-notify">Notify Me</span> */}
//               </div>
//               {/* <div className="product-rating-section">
//                 <div className="star-rating">
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                   <StarIcon style={{ color: "#FFAA15" }} />
//                 </div>
//                 <div className="text-rating">
//                   <pre> 17 Rating and 28 Reviews</pre>
//                 </div>
//               </div> */}
//               <div className="product-price-section">
//                 <div className="product-price-text">₹ {price}</div>
//                 <div className="product-strike-price">₹ {discount}</div>
//                 {/* <div className="product-discount">50%</div> */}
//               </div>
//               <div className="tax-text">Price inclusive of all taxes</div>
//               <div className="product-color-section">
//                 <div className="product-color-text">Colors:</div>
//                 <div className="product-color">
//                   {/* Color add */}

//                   {color[0] && (
//                     <BsCircleFill
//                       style={{
//                         color: `${color[0]}`,
//                         border: "1px solid black",
//                         borderRadius: "30px",
//                         margin: "9px",
//                         fontSize: "20px",
//                       }}
//                     />
//                   )}
//                   {color[1] && (
//                     <BsCircleFill
//                       style={{
//                         color: `${color[1]}`,
//                         border: "1px solid black",
//                         borderRadius: "30px",
//                         margin: "9px",
//                         fontSize: "20px",
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//               <div className="product-btn-section">
//                 <div className="">
//                   {!user || localStorage.getItem("city") === null ? (
//                     <>
//                       {!user ? (
//                         <button
//                           className="product-button-cart"
//                           onClick={() => navigate("/login")}
//                         >
//                           Buy Now
//                         </button>
//                       ) : (
//                         <button
//                           className="product-button-cart"
//                           onClick={() => navigate("/profile")}
//                         >
//                           Buy Now
//                         </button>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       {!selectedsize ? (
//                         <button
//                           className="product-button-cart"
//                           // onClick={() => navigate("/profile")}
//                           disabled={true}
//                         >
//                           Buy Now
//                         </button>
//                       ) : (
//                         <Razorpay
//                           btnText="Buy Now"
//                           className="product-button "
//                           totalCartPrice={price}
//                           dataToSend={tosend}
//                         />
//                       )}
//                     </>
//                   )}
//                 </div>
//                 <button
//                   className="product-button-cart"
//                   onClick={() => {
//                     if (!selectedsize) {
//                       setsizenotselected(false);
//                     } else {
//                       setTimeout(() => {
//                         setsizenotselected(true);
//                         console.log("size?", { selectedsize });
//                         console.log("datas.data", datas.data);
//                         addToCart(datas.data, selectedsize);
//                         navigate("/cart");
//                       }, 1000);
//                     }
//                   }}
//                 >
//                   Add to cart
//                 </button>
//                 {/* <button
//                   className="product-button-cart"
//                   onClick={() => {
//                     if (!selectedsize) {
//                       setsizenotselected(false);
//                     } else {
//                       setTimeout(() => {
//                         setsizenotselected(true);
//                         console.log("size?", { selectedsize });
//                         console.log("datas.data", datas.data);
//                         addToWhishlist(datas.data, selectedsize);
//                         navigate("/whishlist");
//                       }, 1000);
//                     }
//                   }}
//                 >
//                   Add to wishlist
//                 </button> */}
//                 <div
//                   className="product-favourite-icon"
//                   style={{
//                     position: "relative",
//                     bottom: "4.2rem",
//                   }}
//                   onClick={() => {
//                     if (!selectedsize) {
//                       setsizenotselected(false);
//                       setClicked(false);
//                     } else {
//                       setClicked(true);
//                     }
//                   }}
//                 >
//                   {clicked ? (
//                     <BsHeartFill
//                       style={{
//                         fontSize: "28px",
//                         cursor: "pointer",
//                         color: "#B2EEEE",
//                       }}
//                     />
//                   ) : (
//                     <BsHeart
//                       style={{
//                         fontSize: "28px",
//                         cursor: "pointer",
//                         color: "black",
//                       }}
//                       onClick={() => {
//                         if (!selectedsize) {
//                           setsizenotselected(false);
//                         } else {
//                           setTimeout(() => {
//                             setsizenotselected(true);
//                             console.log("size?", { selectedsize });
//                             console.log("datas.data", datas.data);
//                             addToWhishlist(datas.data, selectedsize);
//                             navigate("/whishlist");
//                           }, 1000);
//                         }
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//               {/* <div className="quantity-section">
//                 <div className="quantity-text">Quantity</div>
//                 <input className="quantity-input-box" type="-" />
//               </div>
//               <div className="deliver-to-text">Deliver to</div>
//               <div className="deliver-add-section">
//                 <input
//                   type="text"
//                   name=""
//                   id=""
//                   className="pincode-input"
//                   placeholder="Enter Delivery Pincode"
//                 />
//                 <button className="pincode-check-btn">Check</button>
//               </div> */}
//             </div>

//             {/* <div className="product-color-menu">
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//               <div className="product-color-item">
//                 <img src="" alt="color_img" />
//               </div>
//             </div> */}
//             <div className="product-accordion">
//               {/* <Accordion
//                 defaultExpanded={true}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                   defaultExpanded={true}
//                 >
//                   <div className="accordion-heading">Product Details</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   <div className="product-detail-list">
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Type :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Polo Neck</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Sleeve :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Long Sleeve</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Fit :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Regular</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Fabric :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Cotton Blend</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Pack of :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>1</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Neck Type :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Polo Neck</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Ideal For :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Unisex</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Size :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>S</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Pattern :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Solid</p>
//                       </div>
//                     </div>

//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Suitable For :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>Western Wear</p>
//                       </div>
//                     </div>
//                     <div class="product-detail-row">
//                       <div class="product-detail-column">
//                         <p>Reversible :</p>
//                       </div>
//                       <div class="product-detail-column">
//                         <p>No</p>
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionDetails>
//               </Accordion> */}

//               <Accordion
//                 defaultExpanded={false}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                 >
//                   <div className="accordion-heading">Product Features</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   {features}
//                 </AccordionDetails>
//               </Accordion>

//               <Accordion
//                 defaultExpanded={false}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                 >
//                   <div className="accordion-heading">Product Description</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   {description}
//                 </AccordionDetails>
//               </Accordion>
//               <Accordion
//                 defaultExpanded={false}
//                 className="product-accordion-main"
//               >
//                 <AccordionSummary
//                   id="panel1-header"
//                   className="product-accordion-header"
//                   expandIcon={<ExpandMoreIcon />}
//                 >
//                   <div className="accordion-heading">Refund and Returns</div>
//                 </AccordionSummary>
//                 <AccordionDetails className="product-accordion-detail">
//                   Returning a product on Rjwada is simple; all you have to do is
//                   take a screenshot of the mail you got from Razorpay; a clear
//                   picture of the product & it's packaging. Combine these images
//                   and mail that to support@rjwada.com along with the reason of
//                   return. A genuine reason for return and refund would be
//                   considered. After review we'll get back to you via your email
//                   or phone number you provided in profile section. You can
//                   update these in profile section. You'll receive your refund
//                   within 4 working days.
//                 </AccordionDetails>
//               </Accordion>
//             </div>
//           </div>
//         </div>
//         {/* <div className="section-two">
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">
//               You might be interested in
//             </div>
//             <div className="product-row">
//               <div className="product-card-comp">
//                 <ProductCard/>
//               </div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">Similar Products</div>
//             <div className="product-row">
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">Recently Viewed</div>
//             <div className="product-row">
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//           <div className="product-row-wrapper">
//             <div className="product-row-heading">
//               Customers who bought this item also bought
//             </div>
//             <div className="product-row">
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//               <div className="product-card-comp">  <ProductCard/></div>
//             </div>
//           </div>
//         </div> */}
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default ParticularProduct;























// // import React from "react";
// // import Navbar from "../components/Navbar";
// // import { useState, useEffect } from "react";
// // import Toplist from "../components/Toplist";
// // import { Link, useParams } from "react-router-dom";
// // import "./ParticularProduct.css";
// // import Razorpay from "../components/Razorpay";
// // import { auth, fs, storage, initializeAuthentication } from "../config/Config";
// // import { useNavigate } from "react-router-dom";
// // import { senddata } from "../components/send";
// // import { BsCircleFill } from "react-icons/bs";
// // import { BsHeartFill } from "react-icons/bs";
// // import { BsHeart } from "react-icons/bs";
// // import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
// // import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// // import Footer from "../components/Footer";
// // import Carousel from "react-material-ui-carousel";
// // import { Paper, Button } from "@mui/material";
// // import { AiOutlineInfoCircle } from "react-icons/ai";

// // import firebase from "firebase/compat/app";
// // import "firebase/compat/auth";
// // import "firebase/compat/firestore";
// // import "firebase/compat/storage";
// // import "firebase/compat/database";

// // const ParticularProduct = ({ addToCart, addToWhishlist }) => {
// //   const navigate = useNavigate();

// //   function Getcurrentuser() {
// //     const [user, setuser] = useState(null);
// //     useEffect(() => {
// //       auth.onAuthStateChanged((user) => {
// //         if (user) {
// //           fs.collection("users")
// //             .doc(user.uid)
// //             .get()
// //             .then((snapshot) => {
// //               setuser(snapshot.data().Fullname);
// //             });
// //         } else {
// //           setuser(null);
// //         }
// //       });
// //     }, []);
// //     return user;
// //   }

// //   const user = Getcurrentuser();

// //   const { id } = useParams();

// //   const [data, setData] = useState(null);
// //   console.log(data);
// //   useEffect(() => {
// //     fetch("http://api.rjwada.com/items/products")
// //       .then((response) => {
// //         if (!response.ok) {
// //           throw new Error(
// //             `This is an HTTP error: The status is ${response.status}`
// //           );
// //         }
// //         return response.json();
// //       })
// //       .then((actualdata) => {
// //         setData(actualdata.data);
// //       })
// //       .catch((err) => {
// //         console.log(err.message);
// //       });
// //   }, []);

// //   const [selectedsize, setselectedsize] = useState("");
// //   const [name, setname] = useState("Product name");
// //   const [size, setsize] = useState("");
// //   const [image, setimage] = useState([]);
// //   const [images, setimages] = useState([]);
// //   const [categoryId, setcategoryId] = useState("");
// //   const [productId, setproductId] = useState("");
// //   const [price, setprice] = useState("Product price");
// //   const [description, setdescription] = useState("Product description");
// //   const [datas, setdata] = useState({});
// //   const [banner, setbanner] = useState("Product img");
// //   const [color, setColor] = useState({});
// //   const [discount, setDiscount] = useState("");
// //   const [features, setFeatures] = useState("");

// //   useEffect(() => {
// //     data &&
// //       data.map((data) =>
// //         data.id == id
// //           ? (setdata({ data, selectedsize }),
// //             setname(data.name),
// //             setimage(data.images[0]),
// //             setimages(data.images),
// //             setsize(data.sizes),
// //             setcategoryId(data.category_id),
// //             setproductId(data.id),
// //             setprice(data.price),
// //             setdescription(data.description),
// //             setbanner(data.banner),
// //             setColor(data.colours),
// //             setDiscount(data.discount),
// //             setFeatures(data.features))
// //           : null
// //       );
// //   }, [data]);
// //   console.log(datas);
// //   datas["categoryId"] = categoryId;
// //   console.log(selectedsize);

// //   let quantity = 1;

// //   let tosend = {};
// //   tosend["userid_id"] = localStorage.getItem("uid");
// //   tosend["name"] = name;
// //   tosend["quantity"] = quantity;
// //   tosend["size"] = selectedsize;
// //   tosend["categoryId"] = categoryId;
// //   tosend["product_id"] = productId;
// //   tosend["productPrice"] = price;
// //   tosend["description"] = description;
// //   tosend["banner"] = banner;
// //   tosend["color"] = color;

// //   useEffect(() => {
// //     if (localStorage.getItem("paymentdone") === true) {
// //       console.log("paymentdone");
// //       senddata(tosend);
// //       localStorage.setItem("paymentdone", false);
// //     } else {
// //       localStorage.setItem("paymentdone", false);
// //     }
// //   }, []);
// //   const [clicked, setClicked] = useState(false);

// //   async function sendImg(endpoint, base64_str, prod_id, user_id) {
// //     let headersList = {
// //       "Access-Control-Allow-Origin": "*",
// //     };

// //     console.log(base64_str.split("data:image/jpeg;base64,")[1]);

// //     let bodyContent = new FormData();
// //     bodyContent.append(
// //       "base64_str",
// //       base64_str.split("data:image/jpeg;base64,")[1]
// //     );
// //     console.log(returnedEndpoint);
// //     let uun = Date.now() * Math.random();
// //     bodyContent.append("filename", `${prod_id}*${user_id}*${uun}`);

// //     let response = fetch(endpoint, {
// //       method: "POST",
// //       mode: "no-cors",
// //       body: bodyContent,
// //       headers: headersList,
// //     });

// //     console.log("done");
// //     response.then((a) => {
// //       console.log(a);
// //       getImageURL(`${prod_id}*${user_id}*${uun}`);
// //     });
// //   }

// //   var storage = firebase.storage();

// //   var storageRef = storage.ref();

// //   // var storageRefImgs = storageRef.child("images");

// //   const [MLimage, setMLimage] = useState("");
// //   function getImageURL(imageName) {
// //     // "imageName" is the (<str>) full name of image with extensions.
// //     // It's just the name, do not pass anything else with it.
// //     // Example: getImageURL("00133_00.jpg");

// //     storageRef
// //       .child(`images/${imageName}`)
// //       .getDownloadURL()
// //       .then((url) => {
// //         // This is the actual URL (encrypted by Google).
// //         // Use it however you want to.
// //         console.log("final image url", url);
// //         setMLimage(url);
// //         // setimagetoview(url)
// //         return url;
// //       });
// //   }

// //   initializeAuthentication();
// //   const [returnedEndpoint, setreturnedEndpoint] = useState("");
// //   const getEndpoint = () => {
// //     // This function returns endpoint that is to be called by Fetch request.
// //     console.log("function called");
// //     var dbRef = firebase.database().ref().child("URL");
// //     dbRef.on("value", (snap) => {
// //       var endpoint = snap.val()["URL"] + "/upload";
// //       // console.log('this is endpoint - ', endpoint);
// //       // console.log('this is endpoint - ', endpoint);
// //       setreturnedEndpoint(endpoint);
// //       return endpoint;
// //     });
// //   };
// //   console.log(returnedEndpoint);

// //   console.log(size);

// //   const [base64, setbase64] = useState("");
// //   const [readers, setreaders] = useState({});
// //   function loadfile(images) {
// //     getEndpoint();
// //     var reader = new FileReader();
// //     reader.onload = function () {
// //       var output = document.getElementById("output");
// //       setreaders(reader);
// //       output.src = readers.result;
// //       var res = readers.result;
// //       setbase64(res);
// //       return res;
// //     };
// //     reader.readAsDataURL(images);
// //   }
// //   console.log(base64);
// //   console.log(readers.result);

// //   const [sizenotselected, setsizenotselected] = useState(false);
// //   const [imagetoview, setimagetoview] = useState("");
// //   const [uploadedimage, setuploadedimage] = useState("");

// //   console.log(uploadedimage);

// //   return (
// //     <div>
// //       {/* <Toplist /> */}
// //       <div className="part-product-wrapper">
// //         <div className="section-one">
// //           <div className="product-image-section">
// //             <div className="vertical-slider">
// //               <div
// //                 onClick={() => {
// //                   setimagetoview(
// //                     "url(" +
// //                       "http://api.rjwada.com/assets/" +
// //                       `${images[0]}` +
// //                       ")"
// //                   );
// //                 }}
// //                 className="vertical-slider-item"
// //                 style={{
// //                   backgroundImage:
// //                     "url(" +
// //                     "http://api.rjwada.com/assets/" +
// //                     `${images[0]}` +
// //                     ")",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               ></div>
// //               <div
// //                 onClick={() => {
// //                   setimagetoview(
// //                     "url(" +
// //                       "http://api.rjwada.com/assets/" +
// //                       `${images[1]}` +
// //                       ")"
// //                   );
// //                 }}
// //                 className="vertical-slider-item"
// //                 style={{
// //                   backgroundImage:
// //                     "url(" +
// //                     "http://api.rjwada.com/assets/" +
// //                     `${images[1]}` +
// //                     ")",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               ></div>
// //               <div
// //                 onClick={() => {
// //                   setimagetoview(
// //                     "url(" +
// //                       "http://api.rjwada.com/assets/" +
// //                       `${images[2]}` +
// //                       ")"
// //                   );
// //                 }}
// //                 className="vertical-slider-item"
// //                 style={{
// //                   backgroundImage:
// //                     "url(" +
// //                     "http://api.rjwada.com/assets/" +
// //                     `${images[2]}` +
// //                     ")",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               ></div>
// //               {MLimage ? (
// //                 <div
// //                   onClick={() => {
// //                     setimagetoview("url(" + MLimage + ")");
// //                   }}
// //                   className="vertical-slider-item"
// //                   style={{
// //                     backgroundImage: "url(" + MLimage + ")",
// //                     backgroundSize: "cover",
// //                     backgroundPosition: "center",
// //                   }}
// //                 ></div>
// //               ) : (
// //                 <div
// //                   onClick={() => {
// //                     setimagetoview("url(" + uploadedimage + ")");
// //                   }}
// //                   className="vertical-slider-item"
// //                   style={{
// //                     backgroundImage: "url(" + uploadedimage + ")",
// //                     backgroundSize: "cover",
// //                     backgroundPosition: "center",
// //                   }}
// //                 ></div>
// //               )}
// //               <div
// //                 // onClick={()=>{setimagetoview("url(" +
// //                 // "http://api.rjwada.com/assets/" +
// //                 // `${images[2]}` +
// //                 // ")")}}
// //                 className="vertical-slider-item"
// //                 style={{
// //                   backgroundImage: "url(" + { uploadedimage } + ")",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               ></div>
// //               {/* <img src={require(images[0])} alt="" /> */}
// //             </div>

// //             <div>
// //               <div
// //                 className="product-image-slider"
// //                 style={{ overflow: "hidden", height: "600px" }}
// //               >
// //                 {/* image fetch start */}
// //                 {imagetoview ? (
// //                   <div
// //                     className="particular-productimage"
// //                     style={{
// //                       height: "550px",
// //                       width: "550px",
// //                       backgroundImage: imagetoview,
// //                       backgroundSize: "cover",
// //                       backgroundPosition: "center",
// //                     }}
// //                   ></div>
// //                 ) : (
// //                   <div
// //                     className="particular-productimage"
// //                     style={{
// //                       height: "550px",
// //                       width: "550px",
// //                       backgroundImage:
// //                         "url(" +
// //                         "http://api.rjwada.com/assets/" +
// //                         `${images[0]}` +
// //                         ")",
// //                       backgroundSize: "cover",
// //                       backgroundPosition: "center",
// //                     }}
// //                   ></div>
// //                 )}
// //                 {/* <img
// //                 height={600}
// //                 // weight={1000}
// //                 className="particular-productimage"
// //                 src={`http://api.rjwada.com/assets/${image}`}
// //                 alt=""
// //               /> */}
// //                 {/* Image fetch end */}
// //               </div>

// //               {/* TRY ON */}
// //               <div
// //                 className="try-section"
// //                 style={{
// //                   // border: "1px solid red",
// //                   display: "flex",
// //                   flexDirection: "column",
// //                   justifyContent: "space-evenly",
// //                   alignItems: "center",
// //                 }}
// //               >
// //                 {/* {MLimage ? (
// //                   <div
// //                     className="particular-productimage"
// //                     style={{
// //                       height: "550px",
// //                       width: "550px",
// //                       backgroundImage: "url(" + `${MLimage}` + ")",
// //                       backgroundSize: "cover",
// //                       backgroundPosition: "center",
// //                     }}
// //                   ></div>
// //                 ) : (
// //                   <div style={{ marginTop: "-1000px" }}></div>
// //                 )} */}

// //                 <div
// //                   className="tryon-lower-sec"
// //                   style={{
// //                     display: "flex",
// //                     width: "500px",
// //                     justifyContent: "space-between",
// //                     padding: "10px 0px",
// //                     // border: "1px solid red",
// //                   }}
// //                 >
// //                   <div
// //                     className="uploadbtn"
// //                     style={{
// //                       // border: "1px solid #ccc",
// //                       cursor: "pointer",
// //                       width: "150px",
// //                       overflow: "hidden",
// //                     }}
// //                   >
// //                     <input
// //                       id="imagefile"
// //                       type="file"
// //                       accept="image/*"
// //                       onChange={(e) => {
// //                         loadfile(e.target.files[0]);
// //                         setuploadedimage(
// //                           URL.createObjectURL(e.target.files[0])
// //                         );
// //                       }}
// //                       // onChange={(e) => setuploadedimage(e.target.files[0])}
// //                       className="custom-file-input"
// //                       title=""
// //                       style={{
// //                         content: "Upload",
// //                       }}
// //                     />
// //                   </div>

// //                   <button
// //                     onClick={() =>
// //                       sendImg(
// //                         returnedEndpoint,
// //                         readers.result,
// //                         `${productId}`,
// //                         localStorage.getItem("uid")
// //                       )
// //                     }
// //                     style={{
// //                       background: "#B2EEEE",
// //                       border: "1px solid rgba(0, 0, 0, 0.137)",
// //                       borderRadius: "15px",
// //                       padding: "10px 30px",
// //                       fontWeight: "300",
// //                       fontSize: "18px",
// //                       cursor: "pointer",
// //                     }}
// //                   >
// //                     Tryon
// //                   </button>
// //                 </div>
// //                 <div style={{ display: "flex", justifyContent: "center" }}>
// //                   <AiOutlineInfoCircle style={{ marginRight: "5px" }} />
// //                   To use Try-On feature, click on Upload button, then click on
// //                   Tryon button
// //                 </div>
// //               </div>
// //               {/* TRY ON */}
// //             </div>
// //           </div>

// //           <div className="product-detail-section">
// //             <div className="product-details-wrapper">
// //               <div className="product-manufac">Stubborn Factory</div>
// //               <div className="product-detail-header">
// //                 <div className="product-detail-heading">{name}</div>
// //                 {/* <div className="product-category-text">{description}</div> */}
// //               </div>
// //               <div className="product-category-text"></div>
// //               <div className="product-size-header">
// //                 {" "}
// //                 <br />
// //                 <div className="product-size-heading">
// //                   <h3>Sizes</h3>
// //                 </div>
// //                 {/* <div className="product-size-chart-text">Size Chart</div> */}
// //                 <div className="product-size-boxes">
// //                   {size[0] ? (
// //                     <button
// //                       className="product-size-item"
// //                       onClick={() => {
// //                         localStorage.setItem("size", size[0]);
// //                         setselectedsize(size[0]);
// //                       }}
// //                     >
// //                       {size[0]}
// //                     </button>
// //                   ) : (
// //                     <button
// //                       disabled={true}
// //                       style={{ backgroundColor: "#D0D0D0" }}
// //                       className="product-size-item"
// //                       onClick={() => setselectedsize(size[0])}
// //                     >
// //                       S
// //                     </button>
// //                   )}
// //                   {size[1] ? (
// //                     <button
// //                       className="product-size-item"
// //                       onClick={() => {
// //                         localStorage.setItem("size", size[1]);
// //                         setselectedsize(size[1]);
// //                       }}
// //                     >
// //                       {size[1]}
// //                     </button>
// //                   ) : (
// //                     <button
// //                       disabled={true}
// //                       style={{ backgroundColor: "#D0D0D0" }}
// //                       className="product-size-item"
// //                       onClick={() => setselectedsize(size[1])}
// //                     >
// //                       M
// //                     </button>
// //                   )}
// //                   {size[2] ? (
// //                     <button
// //                       className="product-size-item"
// //                       onClick={() => {
// //                         localStorage.setItem("size", size[2]);
// //                         setselectedsize(size[2]);
// //                       }}
// //                     >
// //                       {size[2]}
// //                     </button>
// //                   ) : (
// //                     <button
// //                       disabled={true}
// //                       style={{ backgroundColor: "#D0D0D0" }}
// //                       className="product-size-item"
// //                       onClick={() => setselectedsize(size[2])}
// //                     >
// //                       L
// //                     </button>
// //                   )}
// //                   {size[3] ? (
// //                     <button
// //                       className="product-size-item"
// //                       onClick={() => {
// //                         localStorage.setItem("size", size[3]);
// //                         setselectedsize(size[3]);
// //                       }}
// //                     >
// //                       {size[3]}
// //                     </button>
// //                   ) : (
// //                     <button
// //                       disabled={true}
// //                       style={{ backgroundColor: "#D0D0D0" }}
// //                       className="product-size-item"
// //                       onClick={() => setselectedsize(size[3])}
// //                     >
// //                       XL
// //                     </button>
// //                   )}
// //                   {size[4] ? (
// //                     <button
// //                       className="product-size-item"
// //                       onClick={() => {
// //                         localStorage.setItem("size", size[4]);
// //                         setselectedsize(size[4]);
// //                       }}
// //                     >
// //                       {size[4]}
// //                     </button>
// //                   ) : (
// //                     <button
// //                       disabled={true}
// //                       style={{ backgroundColor: "#D0D0D0" }}
// //                       className="product-size-item"
// //                       onClick={() => setselectedsize(size[4])}
// //                     >
// //                       XXL
// //                     </button>
// //                   )}
// //                 </div>
// //                 <br />
// //               </div>
// //               {selectedsize == "S" ||
// //               selectedsize == "M" ||
// //               selectedsize == "L" ||
// //               selectedsize == "XL" ||
// //               selectedsize == "XXL" ? null : (
// //                 <h3
// //                   style={{
// //                     marginTop: "-20px",
// //                     marginLeft: "5px",
// //                     color: "red",
// //                   }}
// //                 >
// //                   *Please select a size
// //                 </h3>
// //               )}
// //               {sizenotselected ? null : console.log("Size selection needed")}
// //               <div className="size-lower-text">
// //                 {/* Size Not Available? */}
// //                 {/* <span className="product-notify">Notify Me</span> */}
// //               </div>
// //               {/* <div className="product-rating-section">
// //                 <div className="star-rating">
// //                   <StarIcon style={{ color: "#FFAA15" }} />
// //                   <StarIcon style={{ color: "#FFAA15" }} />
// //                   <StarIcon style={{ color: "#FFAA15" }} />
// //                   <StarIcon style={{ color: "#FFAA15" }} />
// //                   <StarIcon style={{ color: "#FFAA15" }} />
// //                 </div>
// //                 <div className="text-rating">
// //                   <pre> 17 Rating and 28 Reviews</pre>
// //                 </div>
// //               </div> */}
// //               <div className="product-price-section">
// //                 <div className="product-price-text">₹ {price}</div>
// //                 <div className="product-strike-price">₹ {discount}</div>
// //                 {/* <div className="product-discount">50%</div> */}
// //               </div>
// //               <div className="tax-text">Price inclusive of all taxes</div>
// //               <div className="product-color-section">
// //                 <div className="product-color-text">Colors:</div>
// //                 <div className="product-color">
// //                   {/* Color add */}

// //                   {color[0] && (
// //                     <BsCircleFill
// //                       style={{
// //                         color: `${color[0]}`,
// //                         border: "1px solid black",
// //                         borderRadius: "30px",
// //                         margin: "9px",
// //                         fontSize: "20px",
// //                       }}
// //                     />
// //                   )}
// //                   {color[1] && (
// //                     <BsCircleFill
// //                       style={{
// //                         color: `${color[1]}`,
// //                         border: "1px solid black",
// //                         borderRadius: "30px",
// //                         margin: "9px",
// //                         fontSize: "20px",
// //                       }}
// //                     />
// //                   )}
// //                 </div>
// //               </div>
// //               <div className="product-btn-section">
// //                 <div className="">
// //                   {!user || localStorage.getItem("city") === null ? (
// //                     <>
// //                       {!user ? (
// //                         <button
// //                           className="product-button-cart"
// //                           onClick={() => navigate("/login")}
// //                         >
// //                           Buy Now
// //                         </button>
// //                       ) : (
// //                         <button
// //                           className="product-button-cart"
// //                           onClick={() => navigate("/profile")}
// //                         >
// //                           Buy Now
// //                         </button>
// //                       )}
// //                     </>
// //                   ) : (
// //                     <>
// //                       {!selectedsize ? (
// //                         <button
// //                           className="product-button-cart"
// //                           // onClick={() => navigate("/profile")}
// //                           disabled={true}
// //                         >
// //                           Buy Now
// //                         </button>
// //                       ) : (
// //                         <Razorpay
// //                           btnText="Buy Now"
// //                           className="product-button "
// //                           totalCartPrice={price}
// //                           dataToSend={tosend}
// //                         />
// //                       )}
// //                     </>
// //                   )}
// //                 </div>
// //                 <button
// //                   className="product-button-cart"
// //                   onClick={() => {
// //                     if (!selectedsize) {
// //                       setsizenotselected(false);
// //                     } else {
// //                       setTimeout(() => {
// //                         setsizenotselected(true);
// //                         console.log("size?", { selectedsize });
// //                         console.log("datas.data", datas.data);
// //                         addToCart(datas.data, selectedsize);
// //                         navigate("/cart");
// //                       }, 1000);
// //                     }
// //                   }}
// //                 >
// //                   Add to cart
// //                 </button>
// //                 {/* <button
// //                   className="product-button-cart"
// //                   onClick={() => {
// //                     if (!selectedsize) {
// //                       setsizenotselected(false);
// //                     } else {
// //                       setTimeout(() => {
// //                         setsizenotselected(true);
// //                         console.log("size?", { selectedsize });
// //                         console.log("datas.data", datas.data);
// //                         addToWhishlist(datas.data, selectedsize);
// //                         navigate("/whishlist");
// //                       }, 1000);
// //                     }
// //                   }}
// //                 >
// //                   Add to wishlist
// //                 </button> */}
// //                 <div
// //                   className="product-favourite-icon"
// //                   style={{
// //                     position: "relative",
// //                     bottom: "4.2rem",
// //                   }}
// //                   onClick={() => {
// //                     if (!selectedsize) {
// //                       setsizenotselected(false);
// //                       setClicked(false);
// //                     } else {
// //                       setClicked(true);
// //                     }
// //                   }}
// //                 >
// //                   {clicked ? (
// //                     <BsHeartFill
// //                       style={{
// //                         fontSize: "28px",
// //                         cursor: "pointer",
// //                         color: "#B2EEEE",
// //                       }}
// //                     />
// //                   ) : (
// //                     <BsHeart
// //                       style={{
// //                         fontSize: "28px",
// //                         cursor: "pointer",
// //                         color: "black",
// //                       }}
// //                       onClick={() => {
// //                         if (!selectedsize) {
// //                           setsizenotselected(false);
// //                         } else {
// //                           setTimeout(() => {
// //                             setsizenotselected(true);
// //                             console.log("size?", { selectedsize });
// //                             console.log("datas.data", datas.data);
// //                             addToWhishlist(datas.data, selectedsize);
// //                             navigate("/whishlist");
// //                           }, 1000);
// //                         }
// //                       }}
// //                     />
// //                   )}
// //                 </div>
// //               </div>
// //               {/* <div className="quantity-section">
// //                 <div className="quantity-text">Quantity</div>
// //                 <input className="quantity-input-box" type="-" />
// //               </div>
// //               <div className="deliver-to-text">Deliver to</div>
// //               <div className="deliver-add-section">
// //                 <input
// //                   type="text"
// //                   name=""
// //                   id=""
// //                   className="pincode-input"
// //                   placeholder="Enter Delivery Pincode"
// //                 />
// //                 <button className="pincode-check-btn">Check</button>
// //               </div> */}
// //             </div>

// //             {/* <div className="product-color-menu">
// //               <div className="product-color-item">
// //                 <img src="" alt="color_img" />
// //               </div>
// //               <div className="product-color-item">
// //                 <img src="" alt="color_img" />
// //               </div>
// //               <div className="product-color-item">
// //                 <img src="" alt="color_img" />
// //               </div>
// //               <div className="product-color-item">
// //                 <img src="" alt="color_img" />
// //               </div>
// //               <div className="product-color-item">
// //                 <img src="" alt="color_img" />
// //               </div>
// //               <div className="product-color-item">
// //                 <img src="" alt="color_img" />
// //               </div>
// //             </div> */}
// //             <div className="product-accordion">
// //               {/* <Accordion
// //                 defaultExpanded={true}
// //                 className="product-accordion-main"
// //               >
// //                 <AccordionSummary
// //                   id="panel1-header"
// //                   className="product-accordion-header"
// //                   expandIcon={<ExpandMoreIcon />}
// //                   defaultExpanded={true}
// //                 >
// //                   <div className="accordion-heading">Product Details</div>
// //                 </AccordionSummary>
// //                 <AccordionDetails className="product-accordion-detail">
// //                   <div className="product-detail-list">
// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Type :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Polo Neck</p>
// //                       </div>
// //                     </div>

// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Sleeve :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Long Sleeve</p>
// //                       </div>
// //                     </div>
// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Fit :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Regular</p>
// //                       </div>
// //                     </div>

// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Fabric :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Cotton Blend</p>
// //                       </div>
// //                     </div>
// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Pack of :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>1</p>
// //                       </div>
// //                     </div>

// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Neck Type :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Polo Neck</p>
// //                       </div>
// //                     </div>
// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Ideal For :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Unisex</p>
// //                       </div>
// //                     </div>

// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Size :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>S</p>
// //                       </div>
// //                     </div>
// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Pattern :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Solid</p>
// //                       </div>
// //                     </div>

// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Suitable For :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>Western Wear</p>
// //                       </div>
// //                     </div>
// //                     <div class="product-detail-row">
// //                       <div class="product-detail-column">
// //                         <p>Reversible :</p>
// //                       </div>
// //                       <div class="product-detail-column">
// //                         <p>No</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </AccordionDetails>
// //               </Accordion> */}

// //               <Accordion
// //                 defaultExpanded={false}
// //                 className="product-accordion-main"
// //               >
// //                 <AccordionSummary
// //                   id="panel1-header"
// //                   className="product-accordion-header"
// //                   expandIcon={<ExpandMoreIcon />}
// //                 >
// //                   <div className="accordion-heading">Product Features</div>
// //                 </AccordionSummary>
// //                 <AccordionDetails className="product-accordion-detail">
// //                   {features}
// //                 </AccordionDetails>
// //               </Accordion>

// //               <Accordion
// //                 defaultExpanded={false}
// //                 className="product-accordion-main"
// //               >
// //                 <AccordionSummary
// //                   id="panel1-header"
// //                   className="product-accordion-header"
// //                   expandIcon={<ExpandMoreIcon />}
// //                 >
// //                   <div className="accordion-heading">Product Description</div>
// //                 </AccordionSummary>
// //                 <AccordionDetails className="product-accordion-detail">
// //                   {description}
// //                 </AccordionDetails>
// //               </Accordion>
// //               <Accordion
// //                 defaultExpanded={false}
// //                 className="product-accordion-main"
// //               >
// //                 <AccordionSummary
// //                   id="panel1-header"
// //                   className="product-accordion-header"
// //                   expandIcon={<ExpandMoreIcon />}
// //                 >
// //                   <div className="accordion-heading">Refund and Returns</div>
// //                 </AccordionSummary>
// //                 <AccordionDetails className="product-accordion-detail">
// //                   Returning a product on Rjwada is simple; all you have to do is
// //                   take a screenshot of the mail you got from Razorpay; a clear
// //                   picture of the product & it's packaging. Combine these images
// //                   and mail that to support@rjwada.com along with the reason of
// //                   return. A genuine reason for return and refund would be
// //                   considered. After review we'll get back to you via your email
// //                   or phone number you provided in profile section. You can
// //                   update these in profile section. You'll receive your refund
// //                   within 4 working days.
// //                 </AccordionDetails>
// //               </Accordion>
// //             </div>
// //           </div>
// //         </div>
// //         {/* <div className="section-two">
// //           <div className="product-row-wrapper">
// //             <div className="product-row-heading">
// //               You might be interested in
// //             </div>
// //             <div className="product-row">
// //               <div className="product-card-comp">
// //                 <ProductCard/>
// //               </div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //             </div>
// //           </div>
// //           <div className="product-row-wrapper">
// //             <div className="product-row-heading">Similar Products</div>
// //             <div className="product-row">
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //             </div>
// //           </div>
// //           <div className="product-row-wrapper">
// //             <div className="product-row-heading">Recently Viewed</div>
// //             <div className="product-row">
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //             </div>
// //           </div>
// //           <div className="product-row-wrapper">
// //             <div className="product-row-heading">
// //               Customers who bought this item also bought
// //             </div>
// //             <div className="product-row">
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //               <div className="product-card-comp">  <ProductCard/></div>
// //             </div>
// //           </div>
// //         </div> */}
// //         <Footer />
// //       </div>
// //     </div>
// //   );
// // };

// // export default ParticularProduct;
