import { message } from "antd";
import { createContext, useState, useMemo } from "react";
import axios from "axios";
import * as util from '../utils'
import dayjs from 'dayjs';

export const WalletContext = createContext()

function WalletProvider({ children }) {
    const [wallets, setWallet] = useState([])
    const [available, setAvailable] = useState({ available: 0, profitAmount: 0, loanAmount: 0 })
    const [dateFilter, setDateFilter] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

    async function listWallet() {
        try {
            const { data } = await axios.get(`http://207.148.68.86:3001/wallets?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setWallet(data?.data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        } finally {
            getAvailable()
        }
    }

    async function getAvailable() {
        try {
            const { data } = await axios.get(`http://207.148.68.86:3001/wallets/available`)
            setAvailable(data)
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }

    return <WalletContext.Provider value={{ wallets, listWallet, dateFilter, setDateFilter, getAvailable, available }}>
        {children}
    </WalletContext.Provider>
}
export default WalletProvider