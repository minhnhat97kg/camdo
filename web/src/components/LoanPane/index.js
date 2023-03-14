import { Table, Space, message, Modal, Dropdown, Button, Row, Col, Form, Input, Statistic, Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import * as util from '../../utils'
import useHook from './hook'
import { CreditCardOutlined, DeleteOutlined, DollarOutlined, DownOutlined, EditOutlined, MoneyCollectFilled, MoneyCollectOutlined, MoneyCollectTwoTone, MoreOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons'
import { Fragment, useMemo } from 'react'
import CreatingForm from './CreatingForm'
import PaidForm from './PaidForm'
import locale from 'antd/es/date-picker/locale/vi_VN';
import SoldForm from './SoldForm'
import EditForm from './EditForm'

const columns = ({ onDelete, onDetail, onPaid, onSold, onEdit }) => [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: v => v.slice(-5),
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
    // {
    //     title: 'Trạng thái',
    //     dataIndex: 'status',
    //     key: 'status',
    //     render: v => <center>{util.statusToString(v)}</center>,
    //     filters: util.Statues.map((v) => ({ text: util.statusToString(v), value: v })),
    //     onFilter: (value, record) => record.status === value,

    // },
    {
        title: 'Số tiền vay',
        dataIndex: 'amount',
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
        render: (_, r) => <center style={{}}>
            <p style={{ margin: 1, color: dayjs(r.startedAt).locale(locale).isSame(dayjs().locale(locale), 'month') ? 'black' : 'red' }}>{dayjs(r.startedAt).locale(locale).format("DD-MM-YYYY")}</p>
            {r.days > 0 && <p style={{ fontSize: 11, color: 'grey', margin: 1 }}>{`(${r.days} ngày)`}</p>}
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
            <Dropdown menu={{ items: buildItems({ onDelete, onDetail, onPaid, onSold, onEdit, record }) }} placement="top" arrow>
                <Button type='text'><MoreOutlined /></Button>
            </Dropdown>
        ),
    }
];
const buildItems = ({ onDetail, onDelete, onPaid, onSold, onEdit, record }) => {
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
            key: '5',
            label: <Button
                type='text'
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
            >Xoá</Button>,
            danger: true
        },
        {
            key: '2',
            label: <Button
                type='text'
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
            >Chỉnh sửa</Button>,
        },
    ]
    if (record.status === 'ACTIVED') {
        items.push({
            key: '3',
            label: <Button
                type='text'
                icon={<CreditCardOutlined />}
                onClick={() => onPaid(record)}
            >Chuộc</Button>,
        },)

        items.push({
            key: '4',
            label: <Button
                type='text'
                icon={<CreditCardOutlined />}
                onClick={() => onSold(record)}
            >Thanh lý</Button>,
        },)
    }
    return items.sort((a, b) => parseInt(a.key) - parseInt(b.key))
};

export default function LoanPane() {
    const {
        loans,
        isLoading,
        selected,
        setSelected,
        handleDelele,
        handlePaid,
        handleDetail,
        handleEdit,
        isOpenedModalCreating,
        setOpenedModalCreating,
        isOpenedModalPaid,
        setOpenedModalPaid,
        handleCreating,
        isOpenedModalSold,
        setOpenedModalSold,
        isOpenedModalEdit,
        setOpenedModalEdit,
        total,
        available
    } = useHook()


    return <Fragment>
        <Row gutter={24} justify={'center'}>
            <Col span={8}>
                <Card bordered={false}>
                    <Statistic
                        prefix={<MoneyCollectTwoTone />}
                        title="Tiền hiện có"
                        value={available.available || 0}
                        precision={0}
                        suffix={'đ'} />
                </Card>
            </Col>
            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title={`Tiền cho vay ${dayjs().locale(locale).format("MM-YYYY")}`} value={total.debt || 0} precision={0} suffix={'đ'} />
                </Card>
            </Col>
            <Col span={8}>
                <Card bordered={false}>
                    <Statistic title={`Lãi tạm tính ${dayjs().locale(locale).format("MM-YYYY")}`} value={total.fee || 0} precision={0} suffix={'đ'} />
                </Card>
            </Col>
        </Row>
        <div style={{ background: 'white', padding: '10px 5px', margin: '20px 0px' }}>
            <Row style={{ margin: '20px 10px' }}>
                <Col span={10} >
                    <Button onClick={() => setOpenedModalCreating(true)} icon={<PlusCircleOutlined />} type={'primary'} style={{ background: 'green' }}>Khoản vay mới</Button>
                </Col>
            </Row>

            <Table size='small' dataSource={loans} columns={columns({
                onDelete: handleDelele,
                onDetail: handleDetail,
                onPaid: (v) => {
                    setSelected(v)
                    setOpenedModalPaid(true)
                },
                onSold: (v) => {
                    setSelected(v)
                    setOpenedModalSold(true)
                },
                onEdit: (v) => {
                    setSelected(v)
                    setOpenedModalEdit(true)
                },
            })}
                key={(v) => v.id}
                loading={isLoading}
            />
        </div>
        <CreatingForm open={isOpenedModalCreating} onOk={handleCreating} onClose={() => setOpenedModalCreating(false)} />
        <PaidForm open={isOpenedModalPaid} onOk={handlePaid} onClose={() => setOpenedModalPaid(false)} data={selected} />
        <SoldForm open={isOpenedModalSold} onOk={handlePaid} onClose={() => setOpenedModalSold(false)} data={selected} />
        <EditForm open={isOpenedModalEdit} onOk={handleEdit} onClose={() => setOpenedModalEdit(false)} data={selected} />
    </Fragment>
}

