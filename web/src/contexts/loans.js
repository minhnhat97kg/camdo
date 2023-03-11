import { message } from "antd";
import { createContext, useState, useMemo, useContext } from "react";
import axios from "axios";
import * as util from '../utils'
import dayjs from 'dayjs';
import { WalletContext } from "./wallet";

export const LoanContext = createContext()

function LoanProvider({ children }) {

    const { getAvailable } = useContext(WalletContext)
    const [loans, setLoans] = useState([])
    const [dateFilter, setDateFilter] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

    async function listLoan() {
        try {
            const { data } = await axios.get(`http://207.148.68.86:3001/loans?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setLoans(data?.data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        }finally {
            getAvailable()
        }
    }

    return <LoanContext.Provider value={{ loans, listLoan, dateFilter, setDateFilter }}>
        {children}
    </LoanContext.Provider>
}
export default LoanProvider