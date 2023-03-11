import { Table, Space, message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import * as util from '../../utils'
import { useContext, useEffect, useMemo, useState } from 'react'
import DetailForm from './DetailForm';
import axios from 'axios';
import { LoanContext } from '../../contexts/loans';
export default function Hook() {
    const { loans, listLoan, dateFilter, setDateFilter } = useContext(LoanContext)
    const [selected, setSelected] = useState()
    const [isOpenedModalCreating, setOpenedModalCreating] = useState(false)
    const [isOpenedModalPaid, setOpenedModalPaid] = useState(false)

    const totalDebt = useMemo(() => loans.reduce((p, c) => c.status === util.Status.Actived && p + c.amount, 0), [loans, listLoan])
    const totalFee = useMemo(() => loans.reduce((p, c) => c.status === util.Status.Actived && p + c.lateAmount, 0), [loans, listLoan])
    const totalProfit = useMemo(() => loans.reduce((p, c) => c.status === util.Status.Paid && p + (c.paidAmount || 0), 0), [loans, listLoan])

    async function handleDelele({ id, productName }) {
        Modal.confirm({
            content: `Bạn có chắc xoá khoản cho vay ${productName}.`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    const { data } = await axios.delete(`http://localhost:3001/loans/${id}`)
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
            const { data } = await axios.post(`http://localhost:3001/loans/${id}/pay`, { paidAmount })
            message.info(JSON.stringify(data.message))
        } catch (err) {
            message.error(`Lỗi khi thanh toán ${productName}.`)
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
            const { data } = await axios.post(`http://localhost:3001/loans`, values)
            message.info(JSON.stringify(data))
        } catch (err) {
            message.error(`Lỗi khi tạo khoản vay`)
        } finally {
            listLoan()
        }
    }

    useEffect(() => {
        listLoan()
    }, [])

    return {
        listLoan,
        handleDelele,
        handlePaid,
        handleDetail,
        loans,
        selected,
        setSelected,
        isOpenedModalCreating,
        setOpenedModalCreating,
        handleCreating,
        isOpenedModalPaid,
        setOpenedModalPaid,
        totalDebt,
        totalFee,
        totalProfit,
        dateFilter,
        setDateFilter
    }
}