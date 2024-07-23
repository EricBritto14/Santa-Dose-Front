import { createHashRouter } from "react-router-dom";

import StandartLayout from './layouts/StandartLayout';

import Login from "@Pages/Login";
import HomePage from './pages/Home';
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import UserList from "./pages/UserList";

const routers = createHashRouter([
    {
        path: "",
        element: <StandartLayout/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/product-list",
                element: <ProductList/>
            },
            {
                path: "/product-form",
                element: <ProductForm/>
            },
            {
                path: "/user-list",
                element: <UserList/>
            },
        ]
    },
    {
        path: "",
        element: null,
        children: [
            {
                path: "/login",
                element: <Login/>
            }
        ]
    }
])

export default routers;