import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import Home from "../pages/Home"
import Chef from '../pages/Chef';
import Menu from '../pages/Menu';
import Events from '../pages/Events';
import Contact from '../pages/Contact';
import Order from "../pages/Order"
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,        // Navbar + Footer wrap every page
    children: [
      { index: true,      element: <Home /> },
      { path: 'chefs',    element: <Chef /> },
      { path: 'menu',     element: <Menu /> },
      { path: 'events',   element: <Events /> },
      { path: 'contact',  element: <Contact /> },
      { path: 'order',  element: <Order /> },
      { path: '*',        element: <NotFound /> },
    ],
  },
]);