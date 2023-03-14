import 'antd/dist/reset.css';
import LoanPane from '@/components/LoanPane'
import { Tabs } from 'antd';
import WalletPane from '@/components/WalletPane';
import ProfitPane from '@/components/ProfitPane';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RootLayout from '@/components/RootLayout';
import { useEffect, useState } from 'react';

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
      },
      {
        key: '2',
        path: '/history',
        element: <ProfitPane />,
      },
      {
        key: '3',
        path: '/wallets',
        element: <WalletPane />,
      },]
  }
]
export default function App() {
  const [router, setRouter] = useState(null)
  useEffect(() => {
    var aScript = document.createElement('script');
    aScript.type = 'text/javascript';
    aScript.src = " https://js.stripe.com/v3/";

    document.head.appendChild(aScript);
    aScript.onload = () => {
      const router = createBrowserRouter(items);
      setRouter(router)
    };
  }, [])

  return router && (
        <RouterProvider router={router} />
  )
}