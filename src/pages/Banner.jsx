import "./Banner.css";
export const Banner = () => {
  return (
    <>
      {/* For mobile*/}
      <div
        id="carouselExampleIndicators"
        className=" d-block d-sm-none carousel slide carousel-fade" //d-block d-sm-none
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <div className="carousel-inner">
          <div
            className="carousel-item active homepage-banner-1"
            data-bs-interval="8000"
          ></div>
          <div
            className="carousel-item homepage-banner-2"
            data-bs-interval="2000"
          ></div>
          <div className="carousel-item homepage-banner-3"></div>
        </div>
      </div>

      {/* For Tablet */}
      <div
        id="carouselExampleIndicators"
        className="d-none d-sm-block d-lg-none carousel slide carousel-fade" //d-block d-sm-none
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <div className="carousel-inner">
          <div
            className="carousel-item active homepage-banner-4"
            data-bs-interval="8000"
          ></div>
          <div
            className="carousel-item homepage-banner-5"
            data-bs-interval="2000"
          ></div>
          <div className="carousel-item homepage-banner-6"></div>
        </div>
      </div>
      {/* For Laptop*/}

      <div
        id="carouselExampleIndicators"
        className="d-none d-lg-block d-xl-none carousel slide carousel-fade" //d-block d-sm-none
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <div className="carousel-inner">
          <div
            className="carousel-item active homepage-banner-7"
            data-bs-interval="8000"
          ></div>
          <div
            className="carousel-item homepage-banner-8"
            data-bs-interval="2000"
          ></div>
          <div className="carousel-item homepage-banner-9"></div>
        </div>
      </div>

      {/* For Desktop*/}

      <div
        id="carouselExampleIndicators"
        className="d-none d-xl-block carousel slide carousel-fade" //d-block d-sm-none
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <div className="carousel-inner">
          <div
            className="carousel-item active homepage-banner-10"
            data-bs-interval="8000"
          ></div>
          <div
            className="carousel-item homepage-banner-11"
            data-bs-interval="2000"
          ></div>
          <div className="carousel-item homepage-banner-12"></div>
        </div>
      </div>
    </>
  );
};
