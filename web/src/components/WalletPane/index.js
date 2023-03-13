import { Table, Space, message, Modal, Dropdown, Button, Row, Col, Form, Input, Statistic, Card, DatePicker, Tag } from 'antd'
import dayjs from 'dayjs'
import * as util from '../../utils'
import useHook from './hook'
import { PlusCircleOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined, MoneyCollectOutlined, MoneyCollectTwoTone } from '@ant-design/icons'
import { Fragment, useMemo } from 'react'
import CreatingForm from './CreatingForm'
import locale from 'antd/es/date-picker/locale/vi_VN';

const columns = ({ onDelete }) => [
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
        title: 'Loại',
        dataIndex: 'type',
        key: 'type',
        render: (_, r) => <div>{r.amount > 0 ? <Tag color={'green'}>Thu</Tag> : <Tag color={'orange'}>Chi</Tag>}</div>,

    },
    {
        title: <center>Số tiền</center>,
        dataIndex: 'amount',
        key: 'amount',
        render: v => <div style={{ textAlign: 'right' }}>{util.formatCurrency(v)}</div>
    },
    {
        title: <center>Ngày tạo</center>,
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
        wallets,
        listWallet,
        available,
        isOpenedModalCreating,
        setOpenedModalCreating,
        handleCreating,
        handleDelele,
        dateFilter,
        setDateFilter,
        total,
    } = useHook()


    return <Fragment>
        <Row gutter={24} align={''}>
            <Col span={6}>
                <Card bordered={false}>
                    <Statistic
                        prefix={<MoneyCollectTwoTone/>}
                        title="Tiền hiện có"
                        value={available.available || 0}
                        precision={0}
                        suffix={'đ'} />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false}>
                    <Statistic
                        title="Thu"
                        value={total.income}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="đ"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={false}>
                    <Statistic
                        title="Chi"
                        value={total.outcome * -1}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<ArrowDownOutlined />}
                        suffix="đ"
                    />
                </Card>
            </Col>
        </Row>
        { <Row style={{ margin: '20px 10px' }}>
            <Col span={10} >
                <Button onClick={() => setOpenedModalCreating(true)} icon={<PlusCircleOutlined />} type={'primary'} style={{ background: 'green' }}>Tạo giao dịch</Button>
            </Col>
            {/* <Col span={14} >

                <Space>
                    <p>Chọn thời gian: </p>
                    <DatePicker.RangePicker locale={locale} onChange={setDateFilter} value={dateFilter} format={'DD-MM-YYYY'} />
                    <Button onClick={listWallet} icon={<SearchOutlined />} type={'primary'}>Tìm</Button>
                </Space>
            </Col> */}
        </Row> }

        <Table size='small' dataSource={wallets} columns={columns({
            onDelete: handleDelele,
        })}
            key={(v) => v.id}
        />
        <CreatingForm open={isOpenedModalCreating} onOk={handleCreating} onClose={() => setOpenedModalCreating(false)} />
    </Fragment>
}

