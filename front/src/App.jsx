import { RouterProvider, createBrowserRouter } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./components/Navbar";
import { Categories } from "./pages/Categories";
import { Clients } from "./pages/Clients";
import { Products } from "./pages/Products";
import { Inventories } from "./pages/Inventories";
import {Sales} from "./pages/Sales";

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          index: true,
          element: <Products />,
        },

        {
          path: "/categories",
          element: <Categories />,
        },

        {
          path: "/inventories",
          element: <Inventories />,
        },

        {
          path: "/clients",
          element: <Clients />,
        },

        {
          path: "sales",
          element: <Sales />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
