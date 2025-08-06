import React from 'react';
import { AdminPage, CreateRestaurant, HomePage, LoginPage, MenuPage } from "./pages";
import { ClientPage } from './pages/ClientPage';

export const webRoutes =
{
    home: "/",
    createRestaurant: "/create-restaurant",
    login: "/login",
    admin: "/admin",
    client: "/client",
    menu: "/menu/:restaurantId",
}

export const publicRoutes = [
    {
        path: webRoutes.home,
        element: React.createElement(HomePage),
    },
    {
        path: webRoutes.createRestaurant,
        element: React.createElement(CreateRestaurant),
    },
    {
        path: webRoutes.login,
        element: React.createElement(LoginPage),
    },
    {
        path: webRoutes.menu,
        element: React.createElement(MenuPage),
    }
];

export const privateRoutes = [
    {
        path: webRoutes.admin,
        element: React.createElement(AdminPage),
    },
    {
        path: webRoutes.client,
        element: React.createElement(ClientPage),
    }
];
