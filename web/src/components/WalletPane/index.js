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
        title: 'Mô tả',
        dataIndex: 'title',
        key: 'title',
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
        title: 'Số tiền',
        dataIndex: 'amount',
        key: 'amount',
        render: (v) => <center>{util.formatCurrency(v)}</center>
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

];
export default function WalletPane() {
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

