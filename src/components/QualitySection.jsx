import "./QualitySection.css";
import { GiClothes } from "react-icons/gi";
import { BsCashStack } from "react-icons/bs";
import { MdKeyboardReturn } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
const QualitySection = () => {
  return (
    <div className="quality-wrapper">
      <div className="quality-item">
        <div
          className="quality-item-icon"
          style={{ fontSize: "20px", padding: "3px 10px", color: "#8FD4F1" }}
        >
          <GiClothes />
        </div>
        <div className="quality-item-heading">
          ML Tryon
          <br />
        </div>
      </div>
      <div className="quality-item">
        <div
          className="quality-item-icon"
          style={{ fontSize: "20px", padding: "3px 10px", color: "#8FD4F1" }}
        >
          <BsCashStack />
        </div>
        <div className="quality-item-heading">
         Secure Payment
          <br />
        </div>
      </div>
      <div className="quality-item">
        <div
          className="quality-item-icon"
          style={{ fontSize: "20px", padding: "3px 10px", color: "#8FD4F1" }}
        >
          <RiCustomerService2Fill />
        </div>
        <div className="quality-item-heading">
          24 / 7 Support
          <br />
        </div>
      </div>
      <div className="quality-item">
        <div
          className="quality-item-icon"
          style={{ fontSize: "20px", padding: "3px 10px", color: "#8FD4F1" }}
        >
          <MdKeyboardReturn />
        </div>
        <div className="quality-item-heading">
          Easy Return
          <br />
        </div>
      </div>
    </div>
  );
};

export default QualitySection;