import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Razorpay from "../components/Razorpay";
import Toplist from "../components/Toplist";
import { auth, fs } from "../config/Config";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/feather/plus";
import { minus } from "react-icons-kit/feather/minus";
import "./Cart.css";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import RefreshIcon from "@mui/icons-material/Refresh";
import ProductCard from "../components/ProductCard";
import { textAlign } from "@mui/system";
import { senddata } from "../components/send";
import { BsTrash } from "react-icons/bs";

const Cart = ({ userid }) => {
  let deliverycharges = 0;
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
  const [cartProducts, setCartProducts] = useState([]);

  const cart = fs.collection("cart");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        cart.onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
    });
  }, [user]);

  let particularProductArray = [];
  const handleProductDecrease = (p, userid, name, quantity, price, id) => {
    particularProductArray.map((ele) => {
      if (ele[0] === name && ele[1] === userid && quantity > 1) {
        ProdUpdate = p;
        ProdUpdate.quantity = ProdUpdate.quantity - 1;
        x -= price * quantity;
        auth.onAuthStateChanged((user) => {
          if (user) {
            fs.collection("cart")
              .doc("USER_ID = " + userid + ` PRODUCT_ID = ${id}`)
              .update(ProdUpdate)
              .then(() => {
                console.log("done decrement");
              });
          } else {
            console.log("can't decrement ");
          }
        });
      }
    });
  };

  let ProdUpdate;
  const handleProductIncrease = (p, userid, name, quantity, price, id) => {
    particularProductArray.map((ele) => {
      if (ele[0] === name && ele[1] === userid) {
        ProdUpdate = p;
        ProdUpdate.quantity = ProdUpdate.quantity + 1;
        x += price * quantity;
        auth.onAuthStateChanged((user) => {
          if (user) {
            fs.collection("cart")
              .doc("USER_ID = " + userid + ` PRODUCT_ID = ${id}`)
              .update(ProdUpdate)
              .then(() => {
                console.log("done increment");
              });
          } else {
            console.log("cant increment ");
          }
        });
      }
    });
  };
  const handleProductDelete = (p, userid, name, quantity, price, id) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("cart")
          .doc(`USER_ID = ` + userid + ` PRODUCT_ID = ${id}`)
          .delete()
          .then(() => {
            delete products[`${id}`]
            cartProducts = cartProducts.filter((item) => {
              return item.ID !== `USER_ID = ` + userid + ` PRODUCT_ID = ${id}`;
            });
            console.log("deleted item");
          });
      } else {
      }
    });
  };

  // const [fetcall, fetsetcall] = useState()

  let x = 0;
  let totalq = 0;

  function total() {
    cartProducts.map((p) => {
      const slicedid = p.ID.slice(10, 38);
      if (slicedid === userid) {
        x += p.price * p.quantity;
      }
      // x += 40;
    });
    return x;
  }
  totalq = total();
  console.log(cartProducts.length);

  const [useradd, setuseradd] = useState({});
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fs
          .collection("user_address")
          .doc(`${userid}`)
          .get()
          .then((snapshot) => {
            setuseradd(snapshot.data());
            // localStorage.setItem("City", snapshot.data().City);
            // localStorage.setItem("State", snapshot.data().State);
            // localStorage.setItem("Street", snapshot.data().Street);
            // localStorage.setItem("Country", snapshot.data().Country);
            // localStorage.setItem("Landmark", snapshot.data().Landmark);
          });
      } else {
        setuseradd(null);
      }
    });
  }, [user]);

  const [products, setProducts] = useState({});
  console.log(products)

  return (
    <div>
      <Toplist />
      <center>
        <div className="cart-container">
          <div
            className="cart-header"
            style={{
              textAlign: "left",
              marginBottom: "30px",
            }}
          >
            Your Cart Item
          </div>
          <div className="cart-item-container">
            <div className="cart-item-grid">
              {cartProducts.length <= 0 && (
                <div className="noproduct">Add your favourites here</div>
              )}
              {cartProducts.length > 0 && (
                <div className="noproduct">
                  <div className="cart-item-header">
                    <div className="cart-prod">Product</div>
                    <div className="cart-price">Price</div>
                    <div className="cart-quan">Quantity</div>
                  </div>
                  {cartProducts.map((p) => {
                    const slicedid = p.ID.slice(10, 38);
                    if (slicedid === userid) {
                      let tosend = {};
                      tosend["userid_id"] = localStorage.getItem("uid");
                      tosend["product_id"] = p.id;
                      tosend["quantity"] = p.quantity;
                      tosend["categoryId"] = p.categoryId;
                      tosend["productPrice"] = p.price;
                      tosend["banner"] = p.banner;
                      tosend["size"] = p.size[0];
                      particularProductArray.push([p.name, userid]);
                      console.log(tosend);
                      products[`${p.id}`] = tosend;

                      return (
                        <div className="main-card-wrap">
                          <hr />
                          <div className="cart-card" key={p.id}>
                            <div className="card-product-detail">
                              <div style={{ width: "40%" }}>
                                <img
                                  src={`http://api.rjwada.com/assets/${p.banner}`}
                                  alt=""
                                  className="cart-img"
                                />
                              </div>

                              <div className="cart-carddetails">
                                <div
                                  className="cart-item-text"
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  {p.name}
                                </div>
                                {/* Product size : {p.sizes[0]} */}
                                {/* <h4>Price : {p.price}</h4> */}
                              </div>
                            </div>

                            <div className="cart-price-detail">₹ {p.price}</div>
                            <div className="incDec">
                              <div
                                onClick={() =>
                                  handleProductDecrease(
                                    p,
                                    userid,
                                    p.name,
                                    p.quantity,
                                    p.price,
                                    p.id
                                  )
                                }
                              >
                                <Icon icon={minus} size={20} />
                              </div>
                              <div
                                className="cart-quantity"
                                style={{ padding: "5px 10px" }}
                              >
                                {p.quantity}
                              </div>
                              <div
                                onClick={() =>
                                  handleProductIncrease(
                                    p,
                                    userid,
                                    p.name,
                                    p.quantity,
                                    p.price,
                                    p.id
                                  )
                                }
                              >
                                <Icon icon={plus} size={20} />
                              </div>
                            </div>
                            <div className="delete-btn">
                              <BsTrash
                                onClick={() =>
                                  handleProductDelete(
                                    p,
                                    userid,
                                    p.name,
                                    p.quantity,
                                    p.price,
                                    p.id
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="cart-detail-container">
            <div className="cart-address-wrapper">
              <div className="cart-add-header">
                <div className="cart-add-icon">
                  <LocationOnRoundedIcon />
                </div>
                <div className="cart-add-heading">
                  <div className="add-heading-bold">Delivery Address</div>
                  <div className="add-heading-light">
                    We will deliver your order to this address
                  </div>
                </div>
              </div>
              {useradd ? (
                <div className="cart-address-detail-header">
                  <ul className="cart-details-list">
                    <li className="add-detail-fullname">{useradd.Name}</li>
                    {/* <li className="add-detail-addtype">Home</li> */}
                    <li className="add-detail-addline1">{useradd.Street}</li>
                    <li className="add-detail-landmark">{useradd.Landmark}</li>
                    <li className="add-detail-addline2">{useradd.City}</li>
                    <li className="add-detail-state-country">
                      {useradd.State}
                    </li>
                    <li className="add-detail-state-country">
                      {useradd.Country}
                    </li>
                    <li className="add-detail-phone">
                      Phone{" "}
                      <span className="add-detail-number">
                        {useradd.Mobile}
                      </span>
                    </li>
                  </ul>
                </div>
              ) : (
                <h4> click on change address to add address </h4>
              )}
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <button className="change-add-btn">Change Address</button>
              </Link>
            </div>
            <div className="cart-total-container">
              <div className="cart-total-header">CART TOTAL</div>
              {/*  */}

              <table className="cart-total">
                <tr className="cart-row">
                  <td className="cart-col">Sub-Total</td>
                  <td className="cart-col">₹{totalq}</td>
                </tr>
                <tr className="cart-row">
                  <td className="cart-col">Delivery Charges</td>
                  <td className="cart-col">₹{deliverycharges}</td>
                </tr>
              </table>
              <hr className="cart-hr" />
              <table className="cart-total">
                <tr className="cart-row">
                  <td className="cart-col">Total</td>
                  <td className="cart-col">₹{totalq}</td>
                </tr>
              </table>
              <div
                className="cart-btn-sec"
                style={{
                  backgroundColor: "#ECF4F4",
                }}
              >
                <button
                  className="buynow-btn"
                  style={{
                    width: "100%",
                    backgroundColor: "#b2eeee",
                    border: "1px solid black",
                    borderRadius: "20px",
                    padding: "6px",
                    margin: "10px 0px",
                  }}
                >
                  {user && useradd ? (
                    <Razorpay
                      cartProducts={cartProducts.length}
                      totalCartPrice={x}
                      products={products}
                      style={{ width: "20px" }}
                    />
                  ) : (
                    <center>
                      <h2>Please enter address</h2>
                      <Link to="/profile" style={{ textDecoration: "none" }}>
                        <button className="change-add-btn">Add Address</button>
                      </Link>
                    </center>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default Cart;
