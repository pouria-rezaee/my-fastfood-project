import HeroSection from "./sections/HeroSection";
import PopularSection from "./sections/PopularSection";
import WhySection from "./sections/WhySection";
import AboutSection from "./sections/AboutSection";

function Home() {
  return (
    <div className="home-wrapper">
      <HeroSection />
      <PopularSection />
      <WhySection />
      <AboutSection />
    </div>
  );
}

export default Home;
