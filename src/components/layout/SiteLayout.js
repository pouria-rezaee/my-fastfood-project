import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import ScrollToTop from "./ScrollToTop";

// قالب مشترک صفحه‌های سایت: Navbar + محتوای صفحه + Footer
function SiteLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="page-fade" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default SiteLayout;
