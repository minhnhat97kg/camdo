import { message } from "antd";
import { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
import * as util from '../utils'
import dayjs from 'dayjs';
import client from "../utils/client";

export const WalletContext = createContext()

function WalletProvider({ children }) {
    const [wallets, setWallet] = useState([])
    const [isFetchingAvailable,setIsFetchingAvailable] = useState(false)
    const [available, setAvailable] = useState({ available: 0, profitAmount: 0, loanAmount: 0 })
    const [dateFilter, setDateFilter] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

    async function listWallet() {
        try {
            const { data } = await client.get(`/wallets?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setWallet(data?.data || [])
        } catch ({ error }) {
            message.error(JSON.stringify(error))
        }
    }

    async function getAvailable() {
        if (isFetchingAvailable) return
        setIsFetchingAvailable(true)
        try {
            const { data } = await client.get(`/wallets/available`)
            setAvailable(data)
        } catch ({ error }) {
            message.error(JSON.stringify(error))
        }finally{
            setIsFetchingAvailable(false)
        }
    }
    useEffect(() => {
        getAvailable()
    }, [wallets])

    return <WalletContext.Provider value={{ wallets, listWallet, dateFilter, setDateFilter, getAvailable, available }}>
        {children}
    </WalletContext.Provider>
}
export default WalletProvider