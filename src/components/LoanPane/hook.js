import { Table, Space, message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import * as util from '../../utils'
import { useContext, useEffect, useMemo, useState } from 'react'
import DetailForm from './DetailForm';
import client from '../../utils/client';
import { LoanContext } from '../../contexts/loans';
import { WalletContext } from '../../contexts/wallet';
import dayjs from 'dayjs';

export default function Hook() {
    const { loans, listLoan, dateFilter, setDateFilter, isLoading } = useContext(LoanContext)
    const { available } = useContext(WalletContext)
    const [selected, setSelected] = useState()
    const [isOpenedModalCreating, setOpenedModalCreating] = useState(false)
    const [isOpenedModalPaid, setOpenedModalPaid] = useState(false)
    const [isOpenedModalSold, setOpenedModalSold] = useState(false)
    const [isOpenedModalEdit, setOpenedModalEdit] = useState(false)

    const total = useMemo(() => loans && loans.reduce((p, c) => {
        if (!dayjs(c.startedAt).isSame(dayjs(), 'month'))
            return p
        switch (c.status) {
            case util.Status.Actived:
                return { ...p, debt: p.debt + c.amount, fee: p.fee + c.lateAmount }
            case util.Status.Paid:
                return { ...p, profit: c.paidAmount + p.profit }
            default:
                return p
        }
    }, { debt: 0, fee: 0, profit: 0 }), [loans])



    async function handleDelele({ id, productName }) {
        Modal.confirm({
            content: `Bạn có chắc xoá khoản cho vay ${productName}.`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    const { data } = await client.delete(`/loans/${id}`)
                    message.info(JSON.stringify(data))
                } catch (err) {
                    message.error(`Lỗi khi xoá ${productName}.`)
                } finally {
                    listLoan()
                }
            },
        });

    }

    async function handlePaid({ id, productName, paidAmount }) {
        try {
            const { data } = await client.post(`/loans/pay/${id}`, { paidAmount })
            message.info(JSON.stringify(data.message))
        } catch (err) {
            message.error(`Lỗi khi thanh toán ${productName}.`)
        } finally {
            listLoan()
        }
    }

    async function handleSold({ id, productName, paidAmount }) {
        try {
            const { data } = await client.post(`/loans/sell/${id}`, { paidAmount })
            message.info(JSON.stringify(data.message))
        } catch (err) {
            message.error(`Lỗi khi thanh lý${productName}.`)
        } finally {
            listLoan()
        }
    }

    function handleDetail(record) {
        const value = loans.find(v => record.id == v.id)
        setSelected(value)
        Modal.info({
            title: "Chi tiết",
            content: <DetailForm data={value} />
        })
    }

    async function handleCreating(values) {
        try {
            const { data } = await client.post(`/loans`, values)
            message.info(JSON.stringify(data))
        } catch (err) {
            message.error(`Lỗi khi tạo khoản vay`)
        } finally {
            listLoan()
        }
    }

    async function handleEdit(values) {
        try {
            const { id } = values
            const { data } = await client.patch(`/loans/${id}`, values)
            message.info(JSON.stringify(data))
        } catch (err) {
            message.error(`Lỗi khi cập nhật khoản vay`)
        } finally {
            listLoan()
        }
    }

    useEffect(() => {
        listLoan()
    }, [])
    useEffect(() => console.log(loans), [loans])

    return {
        loans,
        listLoan,
        isLoading,
        handleDelele,
        handleCreating,
        handlePaid,
        handleDetail,
        handleSold,
        handleEdit,
        selected,
        setSelected,
        isOpenedModalCreating,
        setOpenedModalCreating,
        isOpenedModalPaid,
        setOpenedModalPaid,
        isOpenedModalSold,
        setOpenedModalSold,
        isOpenedModalEdit,
        setOpenedModalEdit,
        dateFilter,
        setDateFilter,
        available,
        total
    }
}