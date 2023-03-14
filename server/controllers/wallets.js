const orm = require('../utils/orm')
const dayjs = require('dayjs'); // require


function getWallet(req, res, next) {
    orm.wallet.findMany({
        where: {
            status: { not: 'DELETED' },
        },
        orderBy: { id: 'asc' }
    })
        .then((v) => {
            res.status(200).json({ data: v })
        })
        .catch((err) => {
            next(err)
        })
}
async function createRecord(req, res, next) {
    const {
        title,
        amount
    } = req.body

    try {
        const data = await orm.wallet.create({
            data: {
                title,
                amount,
                status: 'ACTIVED',
                userID: 0,
            }
        })
        return res.status(200).json({ message: "Tạo thành công" })
    } catch (error) {
        next(error)
    }
}

async function getAvailable(req, res, next) {
    try {

        const sumWallet = await orm.wallet.aggregate({
            where: {
                status: 'ACTIVED'
            },
            _sum: {
                amount: true
            }
        })

        const sumLoans = await orm.loan.aggregate({
            where: {
                status: 'ACTIVED'
            },
            _sum: {
                amount: true,
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
        const { _sum: { paidAmount: profitAmount } } = sumProfit
        res.json({ available: walletAmount + profitAmount - loanAmount, profitAmount, loanAmount })
    } catch (err) {
        next(err)
    }
}

function deleteRecordByID(req, res, next) {
    orm.wallet.update({
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
            console.log(err)
        })
}

module.exports = {
    getWallet,
    createRecord,
    getAvailable,
    deleteRecordByID
}
