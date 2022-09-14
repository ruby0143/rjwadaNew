import React, { useState } from "react";
import "./Razorpay.css";
import axios from "axios";
import { auth, fs } from "../config/Config";
import { senddata } from "./send";
const Razorpay = ({ totalCartPrice, products, cartProducts, selectedsize }) => {
  console.log(products, "in razorpay jsx");
  const price = totalCartPrice;
  const [paymentid, setpaymentid] = useState();
  console.log(price);

  const loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resovle(true);
      };

      script.onerror = () => {
        resovle(false);
      };

      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("You are offline... Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: "rzp_live_xlfQfSGlO230bx",
      currency: "INR",
      amount: amount * 100,
      name: "Rjwada",
      description: "Private Limited",
      image: "../images/rjwada_logo",

      handler: function (response) {
        setpaymentid(response.razorpay_payment_id);
        console.log(response);
        localStorage.setItem("browser_tahelka", response.razorpay_payment_id);
        alert("Payment Successfully");
        localStorage.setItem("paymentdone", true);
        for (const property in products) {
          if (products.hasOwnProperty(property)) {
            console.log(products[property], "inside razorpay");
            console.log(
              "USER_ID = " +
                products[property].userid_id +
                ` PRODUCT_ID = ${products[property].product_id}`
            );
            senddata(products[property]);
            console.log("json sent");
            fs.collection("cart")
              .doc(
                "USER_ID = " +
                  products[property].userid_id +
                  ` PRODUCT_ID = ${products[property].product_id}`
              )
              .delete()
              .then(() => {
                console.log("all cart items deleted!");
                cartProducts = 0;
              });
          }
        }
        console.log(localStorage.getItem("paymentdone"), ": payment done");
        localStorage.setItem("paymentdone", false);
        console.log(localStorage.getItem("paymentdone"));
      },
      prefill: {
        name: "",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <button className="razorpaycss" onClick={() => displayRazorpay(price)}>
        BUY NOW
      </button>
    </div>
  );
};

export default Razorpay;
