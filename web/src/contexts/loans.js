import { message } from "antd";
import { createContext, useState, useMemo, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import * as util from '../utils'
import dayjs from 'dayjs';
import { WalletContext } from "./wallet";
import client from "../utils/client";

export const LoanContext = createContext()


function LoanProvider({ children }) {

    const { getAvailable } = useContext(WalletContext)
    const [loans, setLoans] = useState([])
    const [profits, setProfits] = useState([])
    const [solds, setSolds] = useState([])
    const [dateFilter, setDateFilter] = useState([dayjs().startOf('month'), dayjs().endOf('month')])

    async function listLoan() {
        try {
            const { data } = await client.get(`/loans?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setLoans(data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }

    async function listProfit() {
        try {
            const { data } = await client.get(`/loans?stt=PAID`)
            setProfits(data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }

    useEffect(() => {
        getAvailable()
    }, [loans])

    return <LoanContext.Provider value={{ loans, listLoan, profits, listProfit, dateFilter, setDateFilter }}>
        {children}
    </LoanContext.Provider>
}
export default LoanProvider