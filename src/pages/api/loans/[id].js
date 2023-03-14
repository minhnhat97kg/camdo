import loans from "@/server/controllers/loans"

export default function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'GET':
            loans.getLoanByID(req, res, (err) => {
                console.log(err)
            })
            break
        case 'PATCH':
            loans.updateLoanByID(req, res)
            break
        default:
            res.status(404)
    }
}
