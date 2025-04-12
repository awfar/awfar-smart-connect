
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import Settings from "./pages/Settings";
import PermissionsManagement from "./pages/PermissionsManagement";
import CompaniesManagement from "./pages/CompaniesManagement";
import TicketsManagement from "./pages/TicketsManagement";
import CompanyPropertiesManagement from "./pages/CompanyPropertiesManagement";
import FormBuilderManagement from "./pages/FormBuilderManagement";
import FormEmbed from "./pages/FormEmbed";

function App() {
  return (
    <RouterProvider
      router={
        createBrowserRouter([
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          {
            path: "/appointments",
            element: <AppointmentsManagement />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
          {
            path: "/permissions",
            element: <PermissionsManagement />,
          },
          {
            path: "/companies",
            element: <CompaniesManagement />,
          },
          {
            path: "/tickets",
            element: <TicketsManagement />,
          },
          {
            path: "/company-properties",
            element: <CompanyPropertiesManagement />,
          },
          {
            path: "/form-builder",
            element: <FormBuilderManagement />,
          },
          {
            path: "/form-embed/:formId",
            element: <FormEmbed />,
          },
        ])
      }
    />
  );
}

export default App;
