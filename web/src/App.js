import LoanPane from './components/LoanPane'
import { Tabs } from 'antd';
import LoanProvider from './contexts/loans'
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
    label: `Thu chi`,
    children: `Content of Tab Pane 3`,
  },
];
export default function App() {
  return (
    <div style={{padding: 20 }}>
      <LoanProvider>
        <Tabs defaultActiveKey="2" items={items} tabPosition={'left'} />
      </LoanProvider>
    </div>
  )
}