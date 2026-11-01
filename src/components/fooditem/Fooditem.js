import "./Fooditem.css";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { FaMoneyBillWave, FaTruck, FaLeaf } from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";

function Fooditem() {
  const features = [
    {
      id: 1,
      icon: <AiOutlineSafetyCertificate size={34} />,
      title: "امنیت غذایی",
      description: "استانداردهای بهداشتی و کیفیت مواد اولیه",
    },
    {
      id: 2,
      icon: <IoFastFood size={34} />,
      title: "آشپزی حرفه‌ای",
      description: "آشپزان با تجربه و دستورهای پخت ویژه",
    },
    {
      id: 3,
      icon: <FaMoneyBillWave size={34} />,
      title: "قیمت مناسب",
      description: "بهترین قیمت‌ها با بالاترین کیفیت",
    },
    {
      id: 4,
      icon: <FaTruck size={34} />,
      title: "تحویل سریع",
      description: "ارسال در کوتاه‌ترین زمان ممکن",
    },
    {
      id: 5,
      icon: <FaLeaf size={34} />,
      title: "مواد ارگانیک",
      description: "استفاده از مواد طبیعی و سالم",
    },
  ];

  return (
    <div className="why-us-grid">
      {features.map((feature) => (
        <div key={feature.id} className="why-us-card">
          <div className="why-us-icon">{feature.icon}</div>
          <h3 className="why-us-title">{feature.title}</h3>
          <p className="why-us-desc">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Fooditem;
