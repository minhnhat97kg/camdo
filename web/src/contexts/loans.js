import { message } from "antd";
import { createContext, useState, useMemo } from "react";
import axios from "axios";
import * as util from '../utils'
import dayjs from 'dayjs';

export const LoanContext = createContext()

function LoanProvider({ children }) {
    const [loans, setLoans] = useState([])
    const [dateFilter,setDateFilter] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

    async function listLoan() {
        try {
            const { data } = await axios.get(`http://localhost:3001/loans?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setLoans(data?.data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }

    return <LoanContext.Provider value={{ loans, listLoan, dateFilter,setDateFilter}}>
        {children}
    </LoanContext.Provider>
}
export default LoanProvider