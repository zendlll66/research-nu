import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Ebookpage from "./page/Ebookpage";
import Homepage from "./page/Homepage";
import Dashboard from "./page/Dashboard";
import Research from "./page/Research";
import Foradmin from "./page/Foradmin";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute"; // นำเข้า ProtectedRoute

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // ใช้ Layout เป็น component หลัก
    children: [
      { path: "/", element: <Homepage /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "ebook", element: <Ebookpage /> },
      { path: "research", element: <Research /> },
      {
        path: "foradmin",
        element: (

          <Foradmin />

        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
