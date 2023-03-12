import LoanPane from './components/LoanPane'
import { Tabs } from 'antd';
import LoanProvider from './contexts/loans'
import WalletPane from './components/WalletPane';
import WalletProvider from './contexts/wallet';
import ProfitPane from './components/ProfitPane';
const items = [
  {
    key: '1',
    label: `Thống kê`,
    children: `Content of Tab Pane 1`,
  },
  {
    key: '2',
    label: `Cầm đồ`,
    children: <LoanPane />
    ,
  },
  {
    key: '3',
    label: `Chuộc`,
    children: <ProfitPane />
    ,
  },
  {
    key: '4',
    label: `Thu chi`,
    children: <WalletPane />,
  },
];
export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <WalletProvider>
        <LoanProvider>
          <Tabs defaultActiveKey="2" items={items} tabPosition={'left'} style={{}}/>
        </LoanProvider>
      </WalletProvider>
    </div>
  )
}