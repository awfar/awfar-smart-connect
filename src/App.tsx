
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
import NotFound from "./pages/NotFound";
import LeadManagement from "./pages/LeadManagement";
import DealsManagement from "./pages/DealsManagement";
import TasksManagement from "./pages/TasksManagement";
import ReportsManagement from "./pages/ReportsManagement";
import UserManagement from "./pages/UserManagement";
import PropertiesManagement from "./pages/PropertiesManagement";
import CMS from "./pages/CMS";

function App() {
  return (
    <RouterProvider
      router={
        createBrowserRouter([
          {
            path: "/",
            element: <Dashboard />,
            errorElement: <NotFound />,
          },
          {
            path: "/dashboard",
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
            path: "/leads",
            element: <LeadManagement />,
          },
          {
            path: "/deals",
            element: <DealsManagement />,
          },
          {
            path: "/appointments",
            element: <AppointmentsManagement />,
          },
          {
            path: "/tasks",
            element: <TasksManagement />,
          },
          {
            path: "/tickets",
            element: <TicketsManagement />,
          },
          {
            path: "/reports",
            element: <ReportsManagement />,
          },
          {
            path: "/users",
            element: <UserManagement />,
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
            path: "/properties",
            element: <PropertiesManagement />,
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
          {
            path: "/cms",
            element: <CMS />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ])
      }
    />
  );
}

export default App;
