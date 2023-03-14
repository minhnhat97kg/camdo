import orm from '@/utils/orm'
import dayjs from 'dayjs'

const InterestType = {
    PercentsPerMonth: 'PERCENTS_PER_MONTH',
    PercentsPerDay: 'PERCENTS_PER_DAY',
    AmountPerMonth: 'AMOUNT_PER_MONTH',
    AmountPerDay: 'AMOUNT_PER_DAY',
}

const Status = {
    Paid: 'PAID',
    Deleted: 'DELETED',
    Actived: 'ACTIVED',
    Sold: 'SOLD',
}

function calculateFee(data) {
    const { amount,
        interest,
        interestType,
        startedAt, paidAt } = data
    let now = dayjs()
    if (paidAt) {
        now = dayjs(paidAt)
    }
    const diffDays = now.diff(dayjs(startedAt), 'days') + 1
    if (diffDays <= 0) return { days: 0, lateAmount: 0 }
    switch (interestType) {
        case InterestType.PercentsPerMonth:
            return { days: diffDays, lateAmount: (interest / 100) / 30 * diffDays * amount }
        case InterestType.PercentsPerDay:
            return { days: diffDays, lateAmount: interest / 100 * diffDays * amount }
        case InterestType.AmountPerMonth:
            return { days: diffDays, lateAmount: (interest / 30) * diffDays * amount }
        case InterestType.AmountPerDay:
            return { days: diffDays, lateAmount: interest * diffDays }
        default:
            throw new Error('Invalid interest type')
    }
}


function getLoans(req, res, next) {
    const stt = req.query.stt

    orm.loan.findMany({
        where: {
            status: { in: stt?.split(',') || ['ACTIVED'] },
        },
        orderBy: { id: 'asc' }
    })
        .then((loans) => {
            res.status(200).json(loans.map((v) => ({ ...v, ...calculateFee(v) })))
        })
        .catch((err) => {
            next(err)
        })
}
async function createLoan(req, res, next) {
    const {
        userName,
        userPhone,
        productName,
        amount,
        interest,
        interestType,
        startedAt,
    } = req.body

    try {
        await orm.loan.create({
            data: {
                userName,
                userPhone,
                productName,
                amount,
                interest,
                interestType,
                startedAt,
                userID: 0,
            }
        })
        return res.status(200).json({ message: "Tạo thành công" })
    } catch (error) {
        next(error)
    }
}
async function updateLoanByID(req, res, next) {
    const { id } = req.params
    const {
        userName,
        userPhone,
        productName,
        amount,
        interest,
        interestType,
        startedAt,
    } = req.body

    try {
        await orm.loan.update({
            where: {
                id: id
            },
            data: {
                userName,
                userPhone,
                productName,
                amount,
                interest,
                interestType,
                startedAt,
                userID: 0,
            }
        })
        return res.status(200).json({ message: "Cập nhật thành công" })
    } catch (error) {
        next(error)
    }
}
function getLoanByID(req, res, next) {
    orm.loan.findUnique({
        where: {
            id: req.params.id
        }
    })
        .then((loan) => {
            res.json(loan)
        })
        .catch((err) => {
            next(err)
        })
}

function deleteLoanByID(req, res, next) {
    orm.loan.update({
        where: {
            id: req.params.id
        },
        data: {
            status: 'DELETED',
        },
    })
        .then((loan) => {
            res.json({ message: `Xoá thành công id [${loan.id}]` })
        })
        .catch((err) => {
            next(err)
        })
}

async function payLoanByID(req, res, next) {
    try {

        const { id } = req.params
        let { paidAmount } = req.body
        if (!paidAmount) return res.status(400).json({ error: 'Amount is requried' })

        const result = await orm.loan.updateMany({
            where: { id: id, status: 'ACTIVED' },
            data: {
                status: 'PAID',
                paidAt: dayjs().toISOString(),
                paidAmount: paidAmount
            },
        })
        if (result.count == 0)
            return res.status(400).json({ error: 'Không thể thực hiện' })
        return res.status(200).json({ message: 'Thanh toán khoản nợ thành công', result })
    } catch (err) {
        next(err)
    }
}

async function sellLoanByID(req, res, next) {
    try {

        const { id } = req.params
        let { paidAmount } = req.body
        if (!paidAmount) return res.status(400).json({ error: 'Amount is requried' })

        const result = await orm.loan.updateMany({
            where: { id: id, status: 'ACTIVED' },
            data: {
                status: 'SOLD',
                paidAt: dayjs().toISOString(),
                paidAmount: paidAmount
            },
        })
        if (result.count == 0)
            return res.status(400).json({ error: 'Không thể thực hiện' })
        return res.status(200).json({ message: 'Thanh lý khoản nợ thành công', result })
    } catch (err) {
        next(err)
    }
}



async function getReportByMonth(req, res, next) {
    try {
        const month = req.query.month || dayjs()


        const sumLoans = await orm.loan.aggregate({
            where: {
                status: 'ACTIVED',
                startedAt: {
                    gte: dayjs(month).startOf('month'),
                    lt: dayjs(month).endOf('month'),
                }
            },
            _sum: {
                amount: true
            }
        })

        const sumProfit = await orm.loan.aggregate({
            where: {
                status: { in: ['PAID', 'SOLD'] }
            },
            _sum: {
                amount: true,
                paidAmount: true
            }
        })
        const { _sum: { amount: walletAmount } } = sumWallet
        const { _sum: { amount: loanAmount } } = sumLoans
        const { _sum: { amount: amount, paidAmount: profitAmount } } = sumProfit
        res.json({ available: walletAmount + amount + profitAmount - loanAmount, profitAmount, loanAmount })
    } catch (err) {
        next(err)
    }
}

export default {
    getLoans,
    getLoanByID,
    createLoan,
    deleteLoanByID,
    payLoanByID,
    sellLoanByID,
    updateLoanByID,
}
