import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import AdminRoute from "../components/guards/AdminRoute";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import Home from "../pages/Home";
import ResetPassword from '../pages/ResetPassword';
import Chefs from "../pages/Chef";
import Menu from "../pages/Menu";
import AdminDebug from "../pages/admin/AdminDebug";
import MenuDetail from "../pages/MenuDetail";
import Events from "../pages/Events";
import EventDetail from "../pages/EventDetail";
import Contact from "../pages/Contact";
import AuthPage from "../pages/AuthPage";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminMenu from "../pages/admin/AdminMenu";
import AdminUsers from "../pages/admin/AdminUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "chefs", element: <Chefs /> },
      { path: "menu", element: <Menu /> },
      { path: "menu/:id", element: <MenuDetail /> },
      { path: "events", element: <Events /> },
      { path: "events/:service", element: <EventDetail /> },
      { path: "contact", element: <Contact /> },
      { path: "auth", element: <AuthPage /> },
      { path: 'reset-password', element: <ResetPassword /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Admin — completely separate layout, no navbar/footer
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "menu", element: <AdminMenu /> },
      { path: "users", element: <AdminUsers /> },
      { path: "debug", element: <AdminDebug /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
