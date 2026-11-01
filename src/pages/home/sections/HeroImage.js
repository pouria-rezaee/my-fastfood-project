import burger from "../../../assets/images/img/Group 15.png";
import "./HeroImage.css";

function HeroImage() {
  return (
    <div className="hero-image">
      <div className="image-container">
        <img src={burger} alt="برگر ویژه" loading="lazy" />
      </div>
    </div>
  );
}

export default HeroImage;
