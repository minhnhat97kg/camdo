import { Table, Space, message, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import { WalletContext } from '../../contexts/wallet';
import client from '../../utils/client';

export default function Hook() {
    const { wallets, listWallet, dateFilter, setDateFilter, available } = useContext(WalletContext)
    const [selected, setSelected] = useState()
    const [isOpenedModalCreating, setOpenedModalCreating] = useState(false)

    const total = useMemo(() => wallets.reduce((p, c) => {
        if (c.amount > 0) {
            return { ...p, income: p.income + c.amount }
        }
        return { ...p, outcome: p.outcome + c.amount }
    }, { income: 0, outcome: 0 }), [wallets])

    async function handleDelele({ id, productName }) {
        Modal.confirm({
            content: `Bạn có chắc xoá khoản cho vay ${productName}.`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    const { data } = await client.delete(`/wallets/${id}`)
                    message.info(JSON.stringify(data))
                } catch (err) {
                    message.error(`Lỗi khi xoá ${productName}.`)
                } finally {
                    listWallet()
                }
            },
        });

    }

    async function handleCreating(values) {
        try {
            const { data } = await client.post(`/wallets`, values)
            message.info(JSON.stringify(data))
        } catch (err) {
            message.error(`Lỗi khi tạo khoản vay`)
        } finally {
            listWallet()
        }
    }

    useEffect(() => {
        listWallet()
    }, [])

    return {
        handleDelele,
        wallets,
        listWallet,
        selected,
        setSelected,
        isOpenedModalCreating,
        setOpenedModalCreating,
        handleCreating,
        dateFilter,
        setDateFilter,
        available,
        total
    }
}