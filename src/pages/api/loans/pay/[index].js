import loans from "@/server/controllers/loans"

export default function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            loans.payLoanByID(req, res, (err) => {
                console.log(err)
            })
            break
        default:
            res.status(404)
    }
}
