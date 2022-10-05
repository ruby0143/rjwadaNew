import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
// import BannerImg from "../images/Banner.png"
//------skeleton------
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CardSkeleton from './../components/skeleton/homeSkeleton';
//------end here
import 'aos/dist/aos.css';
import Aos from 'aos';
import './Homepage.css';
import QualitySection from '../components/QualitySection';
import Toplist from '../components/Toplist';
import Footer from '../components/Footer';
import { auth, fs } from '../config/Config';
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import { Banner } from './Banner';
import ParticularProduct from './ParticularProduct';

const Homepage = (props) => {
  const navigate = useNavigate;
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
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
  ////////

  const [data, setData] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      fetch('http://api.rjwada.com/items/category')
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
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 1000);
  }, []);

  ////////

  const [homepageTopseller, sethomepageTopseller] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      fetch('http://api.rjwada.com/items/products')
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}`
            );
          }
          return response.json();
        })
        .then((actualhomepageTopseller) => {
          sethomepageTopseller(actualhomepageTopseller.data);
          setLoading1(false);
          console.log(actualhomepageTopseller);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 1000);
  }, []);

  const user = Getcurrentuser();

  useEffect(() => {
    Aos.init({
      duration: 1500,
    });
  }, []);

  return (
    <>
      <div className="homepage-wrapper">
        {/* <div className="homepage-banner">
         
        </div> */}
        <Banner />
        <QualitySection />
        <div className="collection-wrapper">
          <div
            className="collection-heading"
            style={{ marginTop: '2px', marginBottom: '5px' }}
          >
            <center>COLLECTIONS</center>
          </div>
          <SkeletonTheme baseColor="#cfcfcf" highlightColor="#DFD8D7">
            {loading ? (
              <>
                <div className="skeleton">
                  <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
                </div>
                {/* <Skeleton /> */}
              </>
            ) : (
              <div className="collection-item-wrapper">
                <div className="collection-item">
                  {data &&
                    data.map((data) => (
                      <div
                        className="categorycard-homepage1"
                        key={data.id}
                        data-aos="fade-in"
                      >
                        {data.id < 4 && (
                          <div
                            className="data-banner-container1"
                            key={data.id}
                            style={{}}
                          >
                            <Link
                              style={{ textDecoration: 'none' }}
                              to={`productpage/${data.id}`}
                            >
                              <div
                                className="data-banner1"
                                style={{
                                  borderRadius: '13px',
                                  backgroundImage:
                                    'url(' +
                                    'http://api.rjwada.com/assets/' +
                                    `${data.banner}` +
                                    ')',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              ></div>
                            </Link>
                            <div key={data.id} className="collection-item-text">
                              <Link
                                style={{ textDecoration: 'none' }}
                                to={`productpage/${data.id}`}
                              >
                                <center>
                                  <div
                                    style={{
                                      marginTop: '-20px',
                                      color: 'black',
                                    }}
                                  >
                                    {data.category_name.length >= 25
                                      ? `${data.category_name.slice(0, 5)}`
                                      : data.category_name}
                                  </div>
                                </center>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </SkeletonTheme>
        </div>
        <hr
          style={{
            border: '0px',
            height: '2px',
            backgroundImage:
              'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))',
          }}
        />
        <div
          className="collection-wrapper"
          style={{
            background: 'rgb(255,255,255)',
            backgroundImage:
              'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 9%, rgba(236,244,244,1) 22%)',
          }}
        >
          <div
            className="collection-heading"
            style={{ marginTop: '2px', marginBottom: '5px' }}
          >
            <center>Hot Selling Products</center>
          </div>
          <SkeletonTheme baseColor="#cfcfcf" highlightColor="#DFD8D7">
            {loading1 ? (
              <>
                <div className="skeleton">
                  <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
                </div>
                {/* <Skeleton /> */}
              </>
            ) : (
              <div className="collection-item-wrapper">
                <div className="collection-item">
                  {homepageTopseller &&
                    homepageTopseller.map((data) => (
                      <div
                        className="categorycard-homepage"
                        key={data.id}
                        data-aos="fade-in"
                      >
                        {data.id === 4 && (
                          <>
                            <div
                              className="data-banner-container data-banner-container-ext"
                              key={data.id}
                              style={{
                                height: '600px',
                                overflow: 'hidden',
                                width: '380px',
                              }}
                            >
                              {/* `productpage/${data.id} */}
                              <Link
                                style={{ textDecoration: 'none' }}
                                to={`productpage/${data.category_id}/${data.id}`}
                                onClick={() => {
                                  <ParticularProduct
                                    cat_id={data.category_id}
                                  />;
                                }}
                              >
                                <div
                                  className="data-banner"
                                  style={{
                                    height: '510px',
                                    borderRadius: '13px',
                                    backgroundImage:
                                      'url(' +
                                      'http://api.rjwada.com/assets/' +
                                      `${data.banner}` +
                                      ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }}
                                ></div>
                              </Link>
                              <div
                                key={data.id}
                                className="collection-item-text"
                              >
                                <Link
                                  style={{ textDecoration: 'none' }}
                                  to={`productpage/${data.id}`}
                                >
                                  <center>
                                    <div
                                      style={{
                                        fontSize: '1.2rem',
                                        marginTop: '-20px',
                                        color: 'black',
                                      }}
                                    >
                                      {data.name}
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '0.2rem',
                                        fontSize: '1.5rem',
                                        color: 'black',
                                      }}
                                    >
                                      ₹ {data.price}
                                    </div>
                                  </center>
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                        {data.id === 11 && (
                          <>
                            <div
                              className="data-banner-container data-banner-container-ext"
                              key={data.id}
                              style={{
                                height: '600px',
                                overflow: 'hidden',
                                width: '380px',
                              }}
                            >
                              <Link
                                style={{ textDecoration: 'none' }}
                                to={`productpage/${data.category_id}/${data.id}`}
                                onClick={() => {
                                  <ParticularProduct
                                    cat_id={data.category_id}
                                  />;
                                }}
                              >
                                <div
                                  className="data-banner"
                                  style={{
                                    height: '510px',
                                    borderRadius: '13px',
                                    backgroundImage:
                                      'url(' +
                                      'http://api.rjwada.com/assets/' +
                                      `${data.banner}` +
                                      ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }}
                                ></div>
                              </Link>
                              <div
                                key={data.id}
                                className="collection-item-text"
                              >
                                <Link
                                  style={{ textDecoration: 'none' }}
                                  to={`productpage/${data.id}`}
                                >
                                  <center>
                                    <div
                                      style={{
                                        fontSize: '1.2rem',
                                        marginTop: '-20px',
                                        color: 'black',
                                      }}
                                    >
                                      {data.name}
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '0.2rem',
                                        fontSize: '1.5rem',
                                        color: 'black',
                                      }}
                                    >
                                      ₹ {data.price}
                                    </div>
                                  </center>
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                        {data.id === 5 && (
                          <>
                            <div
                              className="data-banner-container data-banner-container-ext"
                              key={data.id}
                              style={{
                                height: '600px',
                                overflow: 'hidden',
                                margin: '40px',
                                width: '380px',
                              }}
                            >
                              <Link
                                style={{ textDecoration: 'none' }}
                                to={`productpage/${data.category_id}/${data.id}`}
                                onClick={() => {
                                  <ParticularProduct
                                    cat_id={data.category_id}
                                  />;
                                }}
                              >
                                <div
                                  className="data-banner"
                                  style={{
                                    height: '510px',
                                    borderRadius: '13px',
                                    backgroundImage:
                                      'url(' +
                                      'http://api.rjwada.com/assets/' +
                                      `${data.banner}` +
                                      ')',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }}
                                ></div>
                              </Link>
                              <div
                                key={data.id}
                                className="collection-item-text"
                              >
                                <Link
                                  style={{ textDecoration: 'none' }}
                                  to={`productpage/${data.id}`}
                                >
                                  <center>
                                    <div
                                      style={{
                                        fontSize: '1.2rem',
                                        marginTop: '-20px',
                                        color: 'black',
                                      }}
                                    >
                                      {data.name}
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '0.2rem',
                                        fontSize: '1.5rem',
                                        color: 'black',
                                      }}
                                    >
                                      ₹ {data.price}
                                    </div>
                                  </center>
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </SkeletonTheme>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
