import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import SignIn from './components/SignIn.jsx';
import Home from './components/Home.jsx';
import Outleet from './components/Outleet.jsx';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Outleet></Outleet>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/login",
        element: <SignIn></SignIn>
      },
      {
        path: "/register",
        element: <Register></Register>
      },
      {
        path: "/profile",
        element: <Profile></Profile>
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
