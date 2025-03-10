import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RegisterPage from "./pages/register";
import { fetchAccount } from "./service/auth-service";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutAdmin from "./components/admin/LayoutAdmin";
import User from "./pages/admin/user";
import Book from "./pages/admin/book";
import OrderPage from "./pages/order";
import CheckoutPage from "./pages/checkout";
import OrderSuccess from "./pages/checkout/OrderSuccess";
import OrderHistoryPage from "./pages/OrderHistory";
import AccountManagement from "./components/AccountManagement/AccountManagement";
import Order from "./pages/admin/order";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);

  const getAccount = async () => {
    const pathsToSkip = ["/login", "/register"];
    const currentPath = window.location.pathname;

    if (pathsToSkip.includes(currentPath)) return;

    const res = await fetchAccount();
    if (res.data) {
      dispatch(doGetAccountAction(res.data.user));
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contacts",
          element: <ContactPage />,
        },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-success",
          element: (
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          ),
        },
        {
          path: "purchase-history",
          element: (
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "book/:slug",
          // element: <BookPage />,
          element: (
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          ),
        },
        // {
        //   path: "account-management",
        //   element: (
        //     <ProtectedRoute>
        //       <AccountManagement />
        //     </ProtectedRoute>
        //   ),
        // },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          ),
        },
        {
          path: "books",
          element: (
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);
  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
