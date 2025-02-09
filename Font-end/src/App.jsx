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
import Postpage from "./components/Dashboard/Postpage";
import Editpage from "./components/Dashboard/Editpage";
import Analytics from "./components/Dashboard/Analytics";
import EditEbook from "./components/Dashboard/EditEbook";
import LineBroadcast from "./components/Dashboard/LineBroadcast";
import EditRes from "./components/Dashboard/EditRes";

// เพิ่ม component สำหรับหน้าย่อยใน Dashboard


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
        children: [
          { path: "postnews", element: <Postpage/> }, // เส้นทางสำหรับ Post News
          { path: "edit", element: <EditRes/> }, // เส้นทางสำหรับ Edit
          { path: "analytics", element: <Analytics/> }, // เส้นทางสำหรับ Analytics
          { path: "editebook", element: <EditEbook/> }, // เส้นทางสำหรับ Edit Ebook
          { path: "linebroadcast", element: <LineBroadcast/> }, // เส้นทางสำหรับ Edit Ebook
        ],
      },
      { path: "ebook", element: <Ebookpage /> },
      { path: "research", element: <Research /> },
      { path: "/researcher/:faculty/:id", element: <ResearcherDetails /> },
      { path: "/activity/:id", element: <ActivityDetail /> },

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
