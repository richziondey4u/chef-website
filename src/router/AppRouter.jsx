import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import Home from "../pages/Home";
import Chef from "../pages/Chef";
import Menu from "../pages/Menu";
import Events from "../pages/Events";
import Contact from "../pages/Contact";
import EventDetail from "../pages/EventDetail";
import MenuDetail from "../pages/MenuDetail";
import AuthPage from "../pages/AuthPage";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "chefs", element: <Chef /> },
      { path: "menu", element: <Menu /> },
      { path: "events", element: <Events /> },
      { path: "contact", element: <Contact /> },
      { path: "events/:service", element: <EventDetail /> },
      { path: "menu/:id", element: <MenuDetail /> },
      { path: "auth", element: <AuthPage /> },
      { path: "profile", element: <Profile /> },
      { path: "admin", element: <Admin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
