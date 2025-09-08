import React from 'react';
import { useRoutes, Navigate, type RouteObject } from 'react-router-dom';
import { RoutePaths } from './AuthRoutes';
import Layout from '@layout/index';
import Login from '@/pages/Login';

// ErrorRoutes
// const BadRequest = React.lazy(() => import('@/pages/Error/BadRequest'));
// const Forbidden = React.lazy(() => import('@/pages/Error/Forbidden'));
const NotFound = React.lazy(() => import('@/pages/Error/NotFound'));
// const InternalServer = React.lazy(
//   () => import('@/pages/Error/InternalServer')
// );
// const ServiceUnavailable = React.lazy(
//   () => import('@/pages/Error/ServiceUnavailable')
// );

// XRoutes
const Ticket = React.lazy(() => import('@/pages/Ticket'));
const TicketDetail = React.lazy(() => import('@/pages/Ticket/id'));
const Terms = React.lazy(() => import('@/pages/Terms'));
const Register = React.lazy(() => import('@/pages/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const ChangeEmail = React.lazy(() => import('@/pages/Profile/ChangeEmail'));
const Wallet = React.lazy(() => import('@/pages/Wallet'));
const Invite = React.lazy(() => import('@/pages/Invite'));
const Traffic = React.lazy(() => import('@/pages/Traffic'));
const Order = React.lazy(() => import('@/pages/Order'));
const OrderDetail = React.lazy(() => import('@/pages/Order/id'));
const Plan = React.lazy(() => import('@/pages/Plan'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Knowledge = React.lazy(() => import('@/pages/Knowledge'));

const Routes: React.FC = () => {
  const element: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        // XRoutes
        { path: RoutePaths.TICKET, element: <Ticket /> },
        { path: RoutePaths.TICKET_DETAIL, element: <TicketDetail /> },
        { path: RoutePaths.PROFILE, element: <Profile /> },
        { path: RoutePaths.WALLET, element: <Wallet /> },
        { path: RoutePaths.INVITE, element: <Invite /> },
        { path: RoutePaths.TRAFFIC, element: <Traffic /> },
        { path: RoutePaths.ORDER, element: <Order /> },
        { path: RoutePaths.ORDER_DETAIL, element: <OrderDetail /> },
        { path: RoutePaths.PLAN, element: <Plan /> },
        { path: RoutePaths.DASHBOARD, element: <Dashboard /> },
        { path: RoutePaths.KNOWLEDGE, element: <Knowledge /> },
      ],
    },

    // AuthRoutes
    { path: RoutePaths.TERMS, element: <Terms /> },
    { path: RoutePaths.REGISTER, element: <Register /> },
    { path: RoutePaths.LOGIN, element: <Login /> },
    { path: RoutePaths.FORGOT_PASSWORD, element: <ForgotPassword /> },
    { path: RoutePaths.CHANGE_EMAIL, element: <ChangeEmail /> },

    // 通配符路由放在最后，捕获所有未匹配的路径，不使用Layout
    { path: '*', element: <NotFound /> },
  ];

  return useRoutes(element);
};

export default Routes;
