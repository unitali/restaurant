import React from 'react';
import { AdminPage, CreateRestaurant, HomePage, LoginPage } from "./pages";
import { ClientPage } from './pages/ClientPage';

export const webRoutes =
{
    home: "/",
    createRestaurant: "/create-restaurant",
    login: "/login",
    admin: "/admin",
    client: "/client",
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
