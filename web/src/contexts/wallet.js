import { message } from "antd";
import { createContext, useState, useMemo } from "react";
import axios from "axios";
import * as util from '../utils'
import dayjs from 'dayjs';

export const WalletContext = createContext()

function WalletProvider({ children }) {
    const [wallets, setWallet] = useState([])
    const [available, setAvailable] = useState(0)
    const [dateFilter, setDateFilter] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

    async function listWallet() {
        try {
            const { data } = await axios.get(`http://localhost:3001/wallets?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setLoans(data?.data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }

    async function getAvailable() {
        try {
            const { data } = await axios.get(`http://localhost:3001/wallets/available`)
            setLoans(data?.data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }

    return <LoanContext.Provider value={{ loans, listLoan, dateFilter, setDateFilter, getAvailable, listWallet }}>
        {children}
    </LoanContext.Provider>
}
export default LoanProvider