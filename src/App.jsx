import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useThemeCustom } from "./store/themeCustomStore";
import { useComponentCustom } from "./store/componentCustomStore";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminContent from "./pages/admin/AdminContent";
import AdminAppearance from "./pages/admin/AdminAppearance";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  const initCustomization = useThemeCustom((s) => s.initCustomization);
  const initComponents = useComponentCustom((s) => s.initComponents);

  useEffect(() => {
    initCustomization();
    initComponents();
  }, [initCustomization, initComponents]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          gutter={12}
          containerStyle={{
            top: 80,
            right: 20,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow:
                "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06)",
              maxWidth: "400px",
            },
            success: {
              duration: 2500,
              iconTheme: {
                primary: "#10b981",
                secondary: "white",
              },
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid #10b98160",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 10px 25px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06)",
              },
            },
            error: {
              duration: 3500,
              iconTheme: {
                primary: "#ef4444",
                secondary: "white",
              },
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid #ef444460",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 10px 25px rgba(239, 68, 68, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06)",
              },
            },
            loading: {
              iconTheme: {
                primary: "#3b82f6",
                secondary: "white",
              },
              style: {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid #3b82f660",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow:
                  "0 10px 25px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06)",
              },
            },
          }}
        />

        <Routes>
          {/* Public site */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:id" element={<OrderSuccess />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="appearance" element={<AdminAppearance />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}