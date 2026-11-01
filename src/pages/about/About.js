import AboutHero from "./sections/AboutHero";
import AboutStory from "./sections/AboutStory";
import AboutValues from "./sections/AboutValues";
import AboutTeam from "./sections/AboutTeam";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
    </div>
  );
}

export default About;
