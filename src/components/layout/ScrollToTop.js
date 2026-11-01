import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// با هر تغییر صفحه، اسکرول به بالای صفحه برمی‌گردد
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
