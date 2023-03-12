import { Table, Space, message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import * as util from '../../utils'
import { useContext, useEffect, useMemo, useState } from 'react'
import DetailForm from './DetailForm';
import client from '../../utils/client';
import { LoanContext } from '../../contexts/loans';
import { WalletContext } from '../../contexts/wallet';

export default function Hook() {
    const { profits, listProfit, dateFilter, setDateFilter } = useContext(LoanContext)
    const { available } = useContext(WalletContext)
    const [selected, setSelected] = useState()
    const [isOpenedModalCreating, setOpenedModalCreating] = useState(false)

    const total = useMemo(() => profits && profits.reduce((p, c) => {
        switch (c.status) {
            case util.Status.Paid:
                return { ...p, profit: c.paidAmount + p.profit }
            default:
                return p
        }
    }, { debt: 0, fee: 0, profit: 0 }), [profits])



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
                    listProfit()
                }
            },
        });

    }

    function handleDetail(record) {
        const value = profits.find(v => record.id == v.id)
        setSelected(value)
        Modal.info({
            title: "Chi tiết",
            content: <DetailForm data={value} />
        })
    }

    useEffect(() => {
        listProfit()
    }, [])

    return {
        profits,
        listProfit,
        handleDelele,
        handleDetail,
        selected,
        setSelected,
        // isOpenedModalCreating,
        // setOpenedModalCreating,
        // handleCreating,
        // isOpenedModalPaid,
        // setOpenedModalPaid,
        dateFilter,
        setDateFilter,
        available,
        total
    }
}