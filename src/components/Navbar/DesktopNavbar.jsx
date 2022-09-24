import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { BsHandbag } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

export const DeskTopNavbar = () => {
  return (
    <div className="desktop-nav">
      <Link to="/cart">
        <div className="nav-right-item">
          <BsHandbag size={25} />
        </div>
      </Link>
      <Link to="/whishlist">
        <div className="nav-right-item">
          <AiOutlineHeart size={25} />
        </div>
      </Link>
      <Link to="/profile">
        <div className="nav-right-item">
          <CgProfile size={25} />
        </div>
      </Link>
      <Link to="/trackOrder">
        <div className="nav-right-item">Orders</div>
      </Link>
    </div>
  );
};
