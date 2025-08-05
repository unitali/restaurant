import React from 'react';
import { AdminPage, HomePage, LoginPage } from "./pages";

export const publicRoutes = [
    {
        path: "/home",
        element: React.createElement(HomePage),
    },
    {
        path: "/admin",
        element: React.createElement(AdminPage),
    },
    {
        path: "/login",
        element: React.createElement(LoginPage),
    }
];

export const privateRoutes = [
    {
        path: "/dashboard",
        element: React.createElement(AdminPage),
    },
    {
        path: "/settings",
        element: React.createElement(AdminPage),
    },
];
