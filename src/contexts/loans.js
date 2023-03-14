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
    const [getStatistic, setStatistic] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    async function listLoan() {
        setIsLoading(true)
        try {
            const { data } = await client.get(`/loans?b=${dateFilter[0].toISOString()}&e=${dateFilter[1].toISOString()}`)
            setLoans(data || [])
        } catch ({ response }) {
            message.error(JSON.stringify(response))
        } finally {
            setIsLoading(false)
        }
    }

    async function listProfit() {
        setIsLoading(true)
        try {
            const { data } = await client.get(`/loans?stt=PAID,SOLD`)
            setProfits(data || [])
        } catch (err) {
            message.error(JSON.stringify(err))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAvailable()
    }, [loans])

    return <LoanContext.Provider value={{ loans, listLoan, profits, listProfit, dateFilter, setDateFilter, isLoading }}>
        {children}
    </LoanContext.Provider>
}
export default LoanProvider