import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SiteLayout from "./components/layout/SiteLayout";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blog/Blogdetail";
import Login from "./pages/login/Login";
import Contact from "./pages/contact/Contact";
import Shop from "./pages/shop/Shop";
import Profile from "./pages/profile/Profile";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Payment from "./pages/payment/Payment";
import Admin from "./pages/admin/Admin";
import Notfound from "./pages/notfound/Notfound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحه‌هایی که Navbar و Footer دارند */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Notfound />} />
        </Route>

        {/* صفحه‌های تمام‌صفحه */}
        <Route path="/login" element={<Login />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/:section" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
