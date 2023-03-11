const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs'); // require


function getWallet(req, res, next) {
    const { b, e } = req.query
    prisma.wallet.findMany({
        where: {
            status: { not: Status.Deleted },
            createdAt: {
                lte: dayjs(e).toISOString(),
                gte: dayjs(b).toISOString()
            }
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
        const data = await prisma.wallet.create({
            data: {
                title,
                amount
            }
        })
        return res.status(200).json({ message: "Tạo thành công" })
    } catch (error) {
        next(error)
    }
}
function getAvailable(req, res, next) {
    prisma.wallet.aggregate({
        where: {
            id: parseInt(req.params.id),
            status: 'ACTIVED'
        },
        _sum: {
            amount: true
        }
    })
        .then((v) => {
            res.json(v)
        })
        .catch((err) => {
            next(err)
        })
}

function deleteRecordByID(req, res, next) {
    prisma.wallet.update({
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

module.exports = {
    getWallet,
    createRecord,
    getAvailable,
    deleteRecordByID
}
