import React from 'react';
import Navbar from '../components/Navbar';
import { BsHandbag } from 'react-icons/bs';
import { useState, useEffect, useRef } from 'react';
import Toplist from '../components/Toplist';
import { Link, useParams } from 'react-router-dom';
import './ParticularProduct.css';
import Razorpay from '../components/Razorpay';
import { auth, fs, storage, initializeAuthentication } from '../config/Config';
import { useNavigate } from 'react-router-dom';
import { senddata } from '../components/send';
import { BsCircleFill } from 'react-icons/bs';
import { BsHeartFill } from 'react-icons/bs';
import { BsHeart } from 'react-icons/bs';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../components/Footer';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import Modal3D from "../components/Modal3D";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import Spinner from "react-bootstrap/Spinner"
import { RiRefreshFill } from "react-icons/ri"

const ParticularProduct = ({ addToCart, addToWhishlist }) => {
  const navigate = useNavigate();

  function Getcurrentuser() {
    const [user, setuser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection('users')
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
  // console.log(data);
  useEffect(() => {
    fetch('https://api.rjwada.com/items/products')
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
  console.log(data);
  const [selectedsize, setselectedsize] = useState('');
  const [upload, setUpload] = useState(false);
  const [name, setname] = useState('Product name');
  const [size, setsize] = useState([]);
  const [image, setimage] = useState([]);
  const [images, setimages] = useState([]);
  const [categoryId, setcategoryId] = useState('');
  const [productId, setproductId] = useState('');
  const [price, setprice] = useState('Product price');
  const [description, setdescription] = useState('Product description');
  const [datas, setdata] = useState({});
  const [banner, setbanner] = useState('Product img');
  const [color, setColor] = useState({});
  const [discount, setDiscount] = useState('');
  const [features, setFeatures] = useState('');
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  let modiSize = [0, 0, 0, 0, 0];
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
  // console.log(data);
  datas['categoryId'] = categoryId;
  // console.log(selectedsize);

  let quantity = 1;

  let tosend = {};
  tosend['userid_id'] = localStorage.getItem('uid');
  tosend['name'] = name;
  tosend['quantity'] = quantity;
  tosend['size'] = selectedsize;
  tosend['categoryId'] = categoryId;
  tosend['product_id'] = productId;
  tosend['productPrice'] = price;
  tosend['description'] = description;
  tosend['banner'] = banner;
  tosend['color'] = color;

  useEffect(() => {
    if (localStorage.getItem('paymentdone') === true) {
      console.log('paymentdone');
      senddata(tosend);
      localStorage.setItem('paymentdone', false);
    } else {
      localStorage.setItem('paymentdone', false);
    }
  }, []);

  const [clicked, setClicked] = useState(false);

  async function sendImg(endpoint, base64_str, prod_id, user_id) {
    let headersList = {
      'Access-Control-Allow-Origin': '*',
    };

    console.log(base64_str.split('data:image/jpeg;base64,')[1]);

    let bodyContent = new FormData();
    bodyContent.append(
      'base64_str',
      base64_str.split('data:image/jpeg;base64,')[1]
    );
    console.log(returnedEndpoint);
    let uun = Date.now() * Math.random();
    bodyContent.append('filename', `${prod_id}*${user_id}*${uun}`);

    let response = fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      body: bodyContent,
      headers: headersList,
    });

    console.log('done');
    response.then((a) => {
      console.log(a);
      getImageURL(`${prod_id}*${user_id}*${uun}`);
    });
  }

  var storage = firebase.storage();

  var storageRef = storage.ref();

  // var storageRefImgs = storageRef.child("images");

  const [MLimage, setMLimage] = useState('');
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
        console.log('final image url', url);
        setMLimage(url);
        setimagetoview('url(' + url + ')');
        // setimagetoview(url)
        return url;
      });
  }

  initializeAuthentication();
  const [returnedEndpoint, setreturnedEndpoint] = useState('');
  const getEndpoint = () => {
    // This function returns endpoint that is to be called by Fetch request.
    console.log('function called');
    var dbRef = firebase.database().ref().child('URL');
    dbRef.on('value', (snap) => {
      var endpoint = snap.val()['URL'] + '/upload';
      // console.log('this is endpoint - ', endpoint);
      // console.log('this is endpoint - ', endpoint);
      setreturnedEndpoint(endpoint);
      console.log(endpoint,"end point")
      return endpoint;
    });
  };
  // console.log(returnedEndpoint);

  // console.log(size);
  // console.log(selectedsize);
  const [base64, setbase64] = useState('');
  const [readers, setreaders] = useState({});

  function loadfile(images) {
   
    getEndpoint();
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById('output');
      setreaders(reader);
      console.log(readers)
      output.src = readers.result;
      var res = readers.result;
      setbase64(res);
      return res;
    };
    reader.readAsDataURL(images);
  }
  const pName = name.toLowerCase().split(' ');
  const name3d = pName.join('-');
  // console.log(name3d, "modal");
  // console.log(base64);
  // console.log(readers.result);

  function handleTryon() {
    setLoader(true)
    setTimeout(() => { setLoader(false) }, 5000)
    sendImg(
      returnedEndpoint,
      readers.result,
      `${productId}`,
      localStorage.getItem('uid')
    )
    setRefresh(true)
  }

  function handleRefresh() {
    setUpload(false)
    setimagetoview('url(' +
      'https://api.rjwada.com/assets/' +
      `${images[0]}` +
      ')')
    setRefresh(false)
    setuploadedimage("")
    setreturnedEndpoint("");
    setbase64("")
    setreaders({})
    setuploadedimage("")
  }

  const [sizenotselected, setsizenotselected] = useState(false);
  const [imagetoview, setimagetoview] = useState('');
  const [uploadedimage, setuploadedimage] = useState('');
  console.log(selectedsize);
  console.log(uploadedimage,">>>")



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
                    'url(' +
                    'https://api.rjwada.com/assets/' +
                    `${images[0]}` +
                    ')'
                  );
                }}
                className="vertical-slider-item"
                style={{
                  backgroundImage:
                    'url(' +
                    'https://api.rjwada.com/assets/' +
                    `${images[0]}` +
                    ')',
                  cursor: "pointer"
                }}
              ></div>
              <div
                onClick={() => {
                  setimagetoview(
                    'url(' +
                    'https://api.rjwada.com/assets/' +
                    `${images[1]}` +
                    ')'
                  );
                }}
                className="vertical-slider-item"
                style={{
                  backgroundImage:
                    'url(' +
                    'https://api.rjwada.com/assets/' +
                    `${images[1]}` +
                    ')',
                  cursor: "pointer"
                }}
              ></div>
              {images[2] ? (
                <div
                  onClick={() => {
                    setimagetoview(
                      'url(' +
                      'https://api.rjwada.com/assets/' +
                      `${images[2]}` +
                      ')'
                    );
                  }}
                  className="vertical-slider-item"
                  style={{
                    backgroundImage:
                      'url(' +
                      'https://api.rjwada.com/assets/' +
                      `${images[2]}` +
                      ')',
                    cursor: "pointer"
                  }}
                ></div>
              ) : (
                <div
                  onClick={() => {
                    setimagetoview('url(' + uploadedimage + ')');
                    
                  }}
                  className="vertical-slider-item"
                  style={{
                    backgroundImage: 'url(' + uploadedimage + ')', cursor: "pointer"
                    

                  }}
                ></div>
              )}

              {MLimage ? (
                <div
                  onClick={() => {
                    setimagetoview('url(' + MLimage + ')');
                  }}
                  className="vertical-slider-item"
                  style={{
                    backgroundImage: 'url(' + MLimage + ')',
                  }}
                ></div>
              ) : (
                <>

                  {uploadedimage && images[2] ? (
                    <div
                      onClick={() => {
                        setimagetoview('url(' + uploadedimage + ')');
                        console.log("btn click")
                      }}
                      className="vertical-slider-item"
                      style={{
                        backgroundImage: 'url(' + uploadedimage + ')', cursor: "pointer"
                      }}
                    ></div>
                  ) : (
                    <div
                      onClick={() => {
                        setimagetoview(
                          'url(' +
                          'https://api.rjwada.com/assets/' +
                          `${images[0]}` +
                          ')'
                        );
                      }}
                      className="vertical-slider-item"
                    ></div>
                  )}
                </>
              )}
            </div>

            <div className='spinner-parent'>
              <div className="product-image-slider">
                {loader ? <div className="spinner"><Spinner animation="border" role="status" variant="light" style={{ height: "100%", width: "100%" }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner></div> :
                  ""}
                {/* image fetch start */}
                {imagetoview || uploadedimage ? (

                  <div
                    className="particular-productimage"

                    style={{ backgroundImage: imagetoview ,
                      display: "flex",
                      justifyContent: "flex-end",}
                    }
                  ><Modal3D src ={productId}/></div>
                ) : (
                  <div
                    className="particular-productimage"
                    style={{
                      backgroundImage:
                        'url(' +
                        'https://api.rjwada.com/assets/' +
                        `${images[0]}` +
                        ')',
                      display: "flex",
                      justifyContent: "flex-end",
                    }}


                  ><Modal3D src ={productId}/></div>
                )}
              </div>







              {/* TRY ON */}
              <div className="try-section">

                <div className="tryon-lower-sec ">
                  <div className='uploadbtn'>
                    <input
                      id="imagefile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        loadfile(e.target.files[0]);
                
                        let uploadedImageURL =  URL.createObjectURL(e.target.files[0])
                        setuploadedimage(
                         uploadedImageURL
                        );
                        setimagetoview('url(' + uploadedImageURL + ')');

                        setUpload(true)
                        var tryon = document.querySelector(".tryon-lower-sec");
                        tryon.classList.add("custom-btn-toggle");
                        var div = document.querySelector(".particular-productimage");

                        
                        var inp = document.querySelector(".custom-file-input");
                        inp.classList.add("custom-btn-toggle");
                        var slider = document.querySelector(".product-image-section");
                        slider.classList.add("resp");
                      }}
                      // onChange={(e) => setuploadedimage(e.target.files[0])}
                      className="custom-file-input"
                      title=""
                   style={!upload?{content:"upload"}:{display:"none",content:""}}
                    />
                  </div>

                  {upload === true ?
                    <button
                      className='right'
                      onClick={handleTryon}
                      // style={{
                      //   background: '#B2EEEE',
                      //   border: '1px solid rgba(0, 0, 0, 0.137)',
                      //   borderRadius: '12px',
                      //   padding: '10px 30px',
                      //   fontWeight: '300',
                      //   fontSize: '18px',
                      //   cursor: 'pointer',
                      // }}
                    >
                      Tryon
                    </button>
                    :
                    null
                  }
                  {refresh ? <span className='refresh' onClick={handleRefresh}><RiRefreshFill></RiRefreshFill></span> : ""}
                </div>

                <div class="button-content">
                  <AiOutlineInfoCircle style={{ marginRight: '5px' }} />
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
                {' '}
                <div className="product-size-heading">
                  Sizes
                </div>
                {/* <div className="product-size-chart-text">Size Chart</div> */}
                <div className="product-size-boxes">
                  {size.map((size) => {
                    if (size === 'S') {
                      modiSize[0] = 'S';
                    } else if (size === 'M') {
                      modiSize[1] = 'M';
                    } else if (size === 'L') {
                      modiSize[2] = 'L';
                    } else if (size === 'XL') {
                      modiSize[3] = 'XL';
                    } else if (size === 'XXL') {
                      modiSize[4] = 'XXL';
                      console.log(modiSize);
                    }
                  })}
                  <>
                    {modiSize[0] != 0 ? (
                      <button
                        className={"product-size-item"}
                        id='size0'
                        onClick={(e) => {
                          if (selectedsize === modiSize[0]) {

                            const curr = document.querySelector('#size0');
                            curr.classList.remove("sizeState");
                            curr.classList.add("noBlue")
                            setselectedsize(null);
                          }
                          else {

                            const curr = document.querySelector('#size0');
                            curr.classList.remove("noBlue");
                            localStorage.setItem('size', modiSize[0]);
                            setselectedsize(modiSize[0]);
                          }


                        }}
                      >
                        {modiSize[0]}
                      </button>
                    ) : (
                      <button
                        id='dsize0'
                        disabled={true}
                        style={{ backgroundColor: '#D0D0D0' }}
                        className="product-size-item"
                        onClick={() => setselectedsize(modiSize[0])}
                      >
                        S
                      </button>
                    )}
                    {modiSize[1] != 0 ? (
                      <button
                        id="size1"
                        className={"product-size-item"}
                        onClick={() => {
                          if (selectedsize === modiSize[1]) {

                            const curr = document.querySelector('#size1');
                            curr.classList.remove("sizeState");
                            curr.classList.add("noBlue")
                            setselectedsize(null);
                          }
                          else {

                            const curr = document.querySelector('#size1');
                            curr.classList.remove("noBlue");
                            localStorage.setItem('size', modiSize[1]);
                            setselectedsize(modiSize[1]);
                          }
                        }}
                      >
                        {modiSize[1]}
                      </button>
                    ) : (
                      <button
                        disabled={true}
                        style={{ backgroundColor: '#D0D0D0' }}
                        className="product-size-item"
                        onClick={() => setselectedsize(modiSize[1])}
                      >
                        M
                      </button>
                    )}
                    {modiSize[2] != 0 ? (
                      <button
                        id="size2"
                        className={"product-size-item"}
                        onClick={() => {
                          if (selectedsize === modiSize[2]) {

                            const curr = document.querySelector('#size2');
                            curr.classList.remove("sizeState");
                            curr.classList.add("noBlue")
                            setselectedsize(null);
                          }
                          else {

                            const curr = document.querySelector('#size2');
                            curr.classList.remove("noBlue");
                            localStorage.setItem('size', modiSize[2]);
                            setselectedsize(modiSize[2]);
                          }
                        }}
                      >
                        {modiSize[2]}
                      </button>
                    ) : (
                      <button
                        disabled={true}
                        style={{ backgroundColor: '#D0D0D0' }}
                        className="product-size-item"
                        onClick={() => setselectedsize(modiSize[2])}
                      >
                        L
                      </button>
                    )}
                    {modiSize[3] != 0 ? (
                      <button
                        id='size3'
                        className={"product-size-item"}
                        onClick={() => {
                          if (selectedsize === modiSize[3]) {

                            const curr = document.querySelector('#size3');
                            curr.classList.remove("sizeState");
                            curr.classList.add("noBlue")
                            setselectedsize(null);
                          }
                          else {

                            const curr = document.querySelector('#size3');
                            curr.classList.remove("noBlue");
                            localStorage.setItem('size', modiSize[3]);
                            setselectedsize(modiSize[3]);
                          }
                        }}
                      >
                        {modiSize[3]}
                      </button>
                    ) : (
                      <button
                        disabled={true}
                        style={{ backgroundColor: '#D0D0D0' }}
                        className="product-size-item"
                        onClick={() => setselectedsize(modiSize[0])}
                      >
                        XL
                      </button>
                    )}
                    {modiSize[4] != 0 ? (
                      <button
                        id="size4"
                        className={"product-size-item"}
                        onClick={() => {
                          if (selectedsize === modiSize[4]) {

                            const curr = document.querySelector('#size0');
                            curr.classList.remove("sizeState");
                            curr.classList.add("noBlue")
                            setselectedsize(null);
                          }
                          else {

                            const curr = document.querySelector('#size4');
                            curr.classList.remove("noBlue");
                            localStorage.setItem('size', modiSize[4]);
                            setselectedsize(modiSize[4]);
                          }
                        }}
                      >
                        {modiSize[4]}
                      </button>
                    ) : (
                      <button
                        disabled={true}
                        style={{ backgroundColor: '#D0D0D0' }}
                        className="product-size-item"
                        onClick={() => setselectedsize(modiSize[4])}
                      >

                        XXL
                      </button>
                    )}

                  </>
                </div>
                <br />

              </div>

              {selectedsize === 'S' ||
                selectedsize === 'M' ||
                selectedsize === 'L' ||
                selectedsize === 'XL' ||
                selectedsize === 'XXL' ? null : (
                <h3 className="selectASize"
                  style={{
                    marginTop: '-8px',
                    marginLeft: '9px',
                    color: 'red',
                    fontFamily: 'Montserrat',
                  }}
                >
                  *Please select a size
                </h3>
              )}
              {/* {sizenotselected ? null : console.log('Size selection needed')} */}
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
                        border: '1px solid black',
                        borderRadius: '30px',
                        margin: '9px',
                        fontSize: '20px',
                      }}
                    />
                  )}
                  {color[1] && (
                    <BsCircleFill
                      style={{
                        color: `${color[1]}`,
                        border: '1px solid black',
                        borderRadius: '30px',
                        margin: '9px',
                        fontSize: '20px',
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="product-btn-section product-btn-section-desktop">
                <div className="buy-now-btn">
                  {!user || localStorage.getItem('city') === null ? (
                    <>
                      {!user ? (
                        <button
                          className="product-button-cart "
                          onClick={() => navigate('/login')}
                        >
                          Buy Now
                        </button>
                      ) : (
                        <button
                          className="product-button-cart "
                          onClick={() => navigate('/profile')}
                        >
                          Buy Now
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {!selectedsize ? (
                        <button
                          className="product-button-cart "
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
                <div style={{ flex: 0.2, textAlign: 'center' }}>
                  <BsHandbag
                    style={{ cursor: 'pointer' }}
                    // className="product-button-cart"
                    size={28}
                    onClick={() => {
                      if (!selectedsize) {
                        setsizenotselected(false);
                      } else {
                        setTimeout(() => {
                          setsizenotselected(true);
                          console.log('size?', { selectedsize });
                          console.log('datas.data', datas.data);
                          addToCart(datas.data, selectedsize);
                          navigate('/cart');
                        }, 1000);
                      }
                    }}
                  />
                </div>
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
                        fontSize: '28px',
                        cursor: 'pointer',
                        color: '#B2EEEE',
                      }}
                    />
                  ) : (
                    <BsHeart
                      style={{
                        fontSize: '28px',
                        cursor: 'pointer',
                        color: 'black',
                      }}
                      onClick={() => {
                        if (!selectedsize) {
                          setsizenotselected(false);
                        } else {
                          setTimeout(() => {
                            setsizenotselected(true);
                            console.log('size?', { selectedsize });
                            console.log('datas.data', datas.data);
                            addToWhishlist(datas.data, selectedsize);
                            navigate('/whishlist');
                          }, 1000);
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="product-btn-section-mobile">
                <div>
                  {!user || localStorage.getItem('city') === null ? (
                    <>
                      {!user ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="product-button-cart"
                        >
                          Buy Now
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/profile')}
                          className="product-button-cart"
                        >
                          Buy Now
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {!selectedsize ? (
                        <button className="product-button-cart" disabled={true}>
                          Buy Now
                        </button>
                      ) : (
                        <div style={{ width: '85%', marginLeft: '10px' }}>
                          <Razorpay
                            btnText="Buy Now"
                            totalCartPrice={price}
                            dataToSend={tosend}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="product-btn-section-mobile-lower-div">
                  <div className="cart-btn">
                    <button
                      className="product-button-cart"
                      onClick={() => {
                        if (!selectedsize) {
                          setsizenotselected(false);
                        } else {
                          setTimeout(() => {
                            setsizenotselected(true);
                            console.log('size?', { selectedsize });
                            console.log('datas.data', datas.data);
                            addToCart(datas.data, selectedsize);
                            navigate('/cart');
                          }, 1000);
                        }
                      }}
                    >
                      Add to cart
                    </button>
                  </div>

                  <div
                    className="product-favourite-icon wishlist-btn"
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
                      <button className="product-button-cart">Added</button>
                    ) : (
                      <button
                        className="product-button-cart"
                        onClick={() => {
                          if (!selectedsize) {
                            setsizenotselected(false);
                          } else {
                            setTimeout(() => {
                              setsizenotselected(true);
                              console.log('size?', { selectedsize });
                              console.log('datas.data', datas.data);
                              addToWhishlist(datas.data, selectedsize);
                              navigate('/whishlist');
                            }, 1000);
                          }
                        }}
                      >
                        Wishlist
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
            <div className="product-accordion">


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

        <Footer />
      </div>
    </div>
  );
};

export default ParticularProduct;


