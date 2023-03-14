import LoanPane from './components/LoanPane'
import { Tabs } from 'antd';
import LoanProvider from './contexts/loans'
import WalletPane from './components/WalletPane';
import WalletProvider from './contexts/wallet';
import ProfitPane from './components/ProfitPane';
import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RootLayout from './components/RootLayout';

const items = [
  {
    key: '0',
    path: '/',
    element: <RootLayout />,
    children: [
      {
        key: '1',
        path: '/loans',
        exact: true,
        element: <LoanPane />,
        loader: () => {
          console.log("loan loadded")
          return {}
        }
      },
      {
        key: '2',
        path: '/history',
        element: <ProfitPane />,
        loader: () => {
          return {}
        }
      },
      {
        key: '3',
        path: '/wallets',
        element: <WalletPane />,
      },]
  }
]
const router = createBrowserRouter(items);
export default function App() {

  return (
    <WalletProvider>
      <LoanProvider>
        <RouterProvider router={router} />
      </LoanProvider>
    </WalletProvider>
  )
}