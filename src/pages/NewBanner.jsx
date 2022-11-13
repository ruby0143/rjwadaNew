import "./NewBanner.css"
import Carousel from 'react-bootstrap/Carousel';

import mobile1 from "./../banner/mobile1.jpg"
import mobile2 from "./../banner/mobile2.jpg"
import mobile3 from "./../banner/mobile3(snow).png"

import middevices1 from "./../banner/middevices1.jpg"
import middevices2 from "./../banner/middevices2.jpg"
import middevices3 from "./../banner/middevices3(snow).png"

import tab1 from "./../banner/tab1.jpg"
import tab2 from "./../banner/tab2.jpg"
import tab3 from "./../banner/tab3(snow).png"

import smallscreens1 from "./../banner/smallscreens1.jpg"
import smallscreens2 from "./../banner/smallscreens2.jpg"
import smallscreens3 from "./../banner/smallscreens3(snow).png"

import laptops1 from "./../banner/laptops1.jpg"
import laptops2 from "./../banner/laptops2.jpg"
import laptops3 from "./../banner/laptops3(snow).png"

// import lAndD3 from "./../banner/lAndD3(snow).png"

import bigsc1 from "./../banner/bigsc1.jpg"
import bigsc2 from "./../banner/bigsc2.jpg"
import bigsc3 from "./../banner/bigsc3.png"

function NewBanner() {
  return (
    <Carousel >
      <Carousel.Item>
        <picture >
          <source media="(max-width: 425px)" srcSet={mobile1} />
          <source media="(max-width: 600px)" srcSet={middevices1} />
          <source media="(max-width: 768px)" srcSet={tab1} />
          <source media="(max-width: 900px)" srcSet={smallscreens1} />
          <source media="(max-width: 1200px)" srcSet={laptops1} />
          <source media="(max-width: 1440px)" srcSet={bigsc1} />
          <img src={mobile1} alt="" style={{width: "100%"}}/>
        </picture>
      </Carousel.Item>
      <Carousel.Item>
        <picture>
        <source media="(max-width: 425px)" srcSet={mobile2} />
          <source media="(max-width: 600px)" srcSet={middevices2} />
          <source media="(max-width: 768px)" srcSet={tab2} />
          <source media="(max-width: 900px)" srcSet={smallscreens2} />
          <source media="(max-width: 1200px)" srcSet={laptops2} />
          <source media="(max-width: 1440px)" srcSet={bigsc2} />
          <img src={mobile2} alt="" style={{width: "100%"}}/>
        </picture>
      </Carousel.Item>
      <Carousel.Item>
        <picture>
          <source media="(max-width: 425px)" srcSet={mobile3} />
          <source media="(max-width: 600px)" srcSet={middevices3} />
          <source media="(max-width: 768px)" srcSet={tab3} />
          <source media="(max-width: 900px)" srcSet={smallscreens3} />
          <source media="(max-width: 1200px)" srcSet={laptops3} />
          <source media="(max-width: 1440px)" srcSet={bigsc3} />
          <img src={mobile3} alt="" style={{width: "100%"}}/>
        </picture>
      </Carousel.Item>

    </Carousel>
  );
}

export default NewBanner;