import { Table, Space, message, Modal, Dropdown, Button, Row, Col, Form, Input, Statistic, Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import * as util from '../../utils'
import useHook from './hook'
import { CreditCardOutlined, DeleteOutlined, DollarOutlined, DownOutlined, MoneyCollectFilled, MoneyCollectOutlined, MoneyCollectTwoTone, MoreOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons'
import { Fragment, useMemo } from 'react'
import CreatingForm from './CreatingForm'
import locale from 'antd/lib/date-picker/locale/vi_VN';

const columns = ({ onDelete, onDetail, onPaid, onSold }) => [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: v => `${v}`.slice(-5),
        sorter: (a, b) => a.id - b.id
    },
    {
        title: 'Khách hàng',
        dataIndex: 'userName',
        key: 'userName',
        render: (_, r) => <center direction='vertical' align='center' size={'small'}>
            <p style={{ margin: 1 }}>{r.userName}</p>
            <p style={{ fontSize: 12, color: 'grey', margin: 1 }}>{r.userPhone || '-'}</p>
        </center>
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: v => <center>{util.statusToString(v)}</center>,
        filters: util.Statues.map((v) => ({ text: util.statusToString(v), value: v })),
        onFilter: (value, record) => record.status === value,

    },
    {
        title: 'Số tiền vay',
        dataIndex: 'amount',
        key: 'amount',
        render: (v) => <center>{util.formatCurrency(v)}</center>
    },

    {
        title: 'Số tiền đã trả',
        dataIndex: 'paidAmount',
        key: 'amount',
        render: (v) => <center>{util.formatCurrency(v)}</center>
    },
    {
        title: 'Lãi',
        dataIndex: 'interest',
        render: (_, r) => <center>
            <p style={{ margin: 1 }}>{util.formatCurrency(r.lateAmount)}</p>
            <p style={{ fontSize: 12, color: 'red', margin: 1 }}>{util.interestTypeToString(r.interest, r.interestType)}</p>
        </center>
    },
    {
        title: 'Ngày vay',
        dataIndex: 'startedAt',
        key: 'startedAt',
        render: (_, r) => <center>
            <p style={{ margin: 1 }}>{dayjs(r.startedAt).locale(locale).format("DD-MM-YYYY")}</p>
            {r.days > 0 && <p style={{ fontSize: 11, color: 'grey', margin: 1 }}>{`(${r.days} ngày)`}</p>}
        </center>,
        sorter: (a, b) => dayjs(a.startedAt).isAfter(dayjs(b.startedAt))
    },
    {
        title: 'Ngày trả',
        dataIndex: 'paidAt',
        key: 'paidAt',
        render: (_, r) => <center>
            <p style={{ margin: 1 }}>{dayjs(r.paidAt).locale(locale).format("DD-MM-YYYY")}</p>
        </center>,
        sorter: (a, b) => dayjs(a.startedAt).isAfter(dayjs(b.startedAt))
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (v) => <center>
            <p style={{ margin: 1 }}>{dayjs(v).locale(locale).format("HH:mm DD-MM-YYYY")}</p>
        </center>,
        sorter: (a, b) => dayjs(a.createdAt).isAfter(dayjs(b.createdAt))
    },
    {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
            <Dropdown menu={{ items: buildItems({ onDelete, onDetail, onPaid, onSold, record }) }} placement="top" arrow>
                <Button type='text'><MoreOutlined /></Button>
            </Dropdown>
        ),
    }
];
const buildItems = ({ onDetail, onDelete, record }) => {
    let items = [
        {
            key: '1',
            label: <Button
                type='text'
                icon={<SearchOutlined />}
                onClick={() => onDetail(record)}
            >Chi tiết</Button>,
        },
        {
            key: '3',
            label: <Button
                type='text'
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
            >Xoá</Button>,
            danger: true
        },
    ]
    return items
};

export default function ProfitPane() {
    const {
        profits,
        selected,
        setSelected,
        handleDelele,
        handleDetail,
        isOpenedModalCreating,
        setOpenedModalCreating,
        handleCreating,
        total,
        available
    } = useHook()


    return <Fragment>
        <Row gutter={10} >
            <Col span={12}>
                <Card bordered={false}>
                    <Statistic
                        prefix={<MoneyCollectTwoTone />}
                        title="Tiền hiện có"
                        value={available.available || 0}
                        precision={0}
                        suffix={'đ'} />
                </Card>
            </Col>
            <Col span={12}>
                <Card bordered={false}>
                    <Statistic title="Tổng lãi" value={total.profit || 0} precision={0} suffix={'đ'} />
                </Card>
            </Col>
        </Row>

        <div style={{ background: 'white', padding: '10px 5px', margin: '20px 0px' }}>
            <Table size='small'
                dataSource={profits}
                columns={columns({
                    onDelete: handleDelele,
                    onDetail: handleDetail,
                })}
                key={(v) => v.id}
            />
        </div>
        {/* <CreatingForm open={isOpenedModalCreating} onOk={handleCreating} onClose={() => setOpenedModalCreating(false)} /> */}
    </Fragment>
}

