import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Ebookpage from "./page/Ebookpage";
import Homepage from "./page/Homepage";
import Dashboard from "./page/Dashboard";
import Research from "./page/Research";
import Foradmin from "./page/Foradmin";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute"; // นำเข้า ProtectedRoute
import Nopage from "./components/Nopage";
import ActivityDetail from "./page/ActivityDetail";
import ResearcherDetails from "./page/ResearcherDetail";


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
      { path: "/researcher/:faculty/:id", element: <ResearcherDetails/> },
      { path: "/activity/:id", element: <ActivityDetail/>},
      {
        path: "foradmin",
        element: <Foradmin />,
      },
      { path: "*", element: <Nopage /> }, // เส้นทาง fallback สำหรับเส้นทางที่ไม่พบ
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
