const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs'); // require

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
            return { days: diffDays, lateAmount: interest * diffDays * amount }
        default:
            throw new Error('Invalid interest type')
    }
}


function getLoans(req, res, next) {
    const stt = req.query?.stt || Status.Actived
    prisma.loan.findMany({
        where: {
            status: stt,
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
        const loan = await prisma.loan.create({
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
function getLoanByID(req, res, next) {
    prisma.loan.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
        .then((loan) => {
            res.json(loan)
        })
        .catch((err) => {
            next(err)
        })
}

function updateLoanByID(req, res, next) {
    prisma.loan.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: {
            amount: req.body.amount,
            interest: req.body.interest,
            term: req.body.term,
            status: req.body.status
        }
    })
        .then((loan) => {
            res.json({ message: `Cập nhật thành công id [${loan.id}]` })
        })
        .catch((err) => {
            next(err)
        })
}

function deleteLoanByID(req, res, next) {
    prisma.loan.update({
        where: {
            id: parseInt(req.params.id)
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
            console.log(err)
        })
}

async function payLoanByID(req, res, next) {
    try {

        const { id } = req.params
        let { paidAmount } = req.body
        if (!paidAmount) return res.status(400).json({ error: 'Amount is requried' })

        const result = await prisma.loan.updateMany({
            where: { id: parseInt(id), status: 'ACTIVED' },
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

module.exports = {
    getLoans,
    getLoanByID,
    createLoan,
    updateLoanByID,
    deleteLoanByID,
    payLoanByID
}
