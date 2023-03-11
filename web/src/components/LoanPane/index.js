import { Table, Space, message, Modal, Dropdown, Button, Row, Col, Form, Input, Statistic, Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import * as util from '../../utils'
import useHook from './hook'
import { CreditCardOutlined, DeleteOutlined, DollarOutlined, DownOutlined, MoreOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons'
import { Fragment, useMemo } from 'react'
import CreatingForm from './CreatingForm'
import PaidForm from './PaidForm'
import locale from 'antd/es/date-picker/locale/vi_VN';

const columns = ({ onDelete, onDetail, onPaid, onSold }) => [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
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
            {r.days > 0 && <p style={{ fontSize: 11, color: 'grey', margin: 1 }}>{`(Trễ ${r.days} ngày)`}</p>}
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
const buildItems = ({ onDetail, onDelete, onPaid, onSold, record }) => {
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
    if (record.status === 'ACTIVED') {
        items.push({
            key: '2',
            label: <Button
                type='text'
                icon={<CreditCardOutlined />}
                onClick={() => onPaid(record)}
            >Chuộc</Button>,
        },)
    }
    return items
};

export default function LoanPane() {
    const {
        loans,
        selected,
        setSelected,
        handleDelele,
        handlePaid,
        handleDetail,
        listLoan,
        isOpenedModalCreating,
        setOpenedModalCreating,
        isOpenedModalPaid,
        setOpenedModalPaid,
        handleCreating,
        totalDebt,
        totalProfit,
        totalFee,
        dateFilter,
        setDateFilter
    } = useHook()


    return <Fragment>
        <Row gutter={24} align={''}>
            <Col span={5}>
                <Card bordered>
                    <Statistic title="Tổng tiền cho vay" value={totalDebt || 0} precision={0} suffix={'đ'} />
                </Card>
            </Col>
            <Col span={5}>
                <Card bordered>
                    <Statistic title="Tổng lãi tạm tính" value={totalFee || 0} precision={0} suffix={'đ'} />
                </Card>
            </Col>
            <Col span={5}>
                <Card bordered>
                    <Statistic title="Tổng lợi nhuận" value={totalProfit || 0} precision={0} suffix={'đ'} />
                </Card>
            </Col>
        </Row>
        <Row style={{ margin: '20px 10px' }}>
            <Col span={10} >
                <Button onClick={() => setOpenedModalCreating(true)} icon={<PlusCircleOutlined />} type={'primary'} style={{ background: 'green' }}>Khoản vay mới</Button>
            </Col>
            <Col span={14} >

                <Space>
                    <p>Chọn thời gian: </p>
                    <DatePicker.RangePicker locale={locale} onChange={setDateFilter} value={dateFilter} format={'DD-MM-YYYY'} />
                    <Button onClick={listLoan} icon={<SearchOutlined />} type={'primary'}>Tìm</Button>
                </Space>
            </Col>
        </Row>

        <Table size='small' dataSource={loans} da columns={columns({
            onDelete: handleDelele,
            onDetail: handleDetail,
            onPaid: (v) => {
                setSelected(v)
                setOpenedModalPaid(true)
            },
        })}
            key={(v) => v.id}
        />
        <CreatingForm open={isOpenedModalCreating} onOk={handleCreating} onClose={() => setOpenedModalCreating(false)} />
        <PaidForm open={isOpenedModalPaid} onOk={handlePaid} onClose={() => setOpenedModalPaid(false)} data={selected} />
    </Fragment>
}

