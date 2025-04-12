
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
import CatalogManagement from "./pages/CatalogManagement";
import ProductDetails from "./pages/ProductDetails";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import PackageManagement from "./pages/PackageManagement";
import InvoiceManagement from "./pages/InvoiceManagement";

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
          {
            path: "/catalog",
            element: <CatalogManagement />,
          },
          {
            path: "/catalog/product/:productId",
            element: <ProductDetails />,
          },
          {
            path: "/subscriptions",
            element: <SubscriptionManagement />,
          },
          {
            path: "/packages",
            element: <PackageManagement />,
          },
          {
            path: "/invoices",
            element: <InvoiceManagement />,
          },
        ])
      }
    />
  );
}

export default App;
