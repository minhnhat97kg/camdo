import loans from "@/server/controllers/loans"

export default function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'GET':
            loans.getLoans(req, res, (err) => {
                console.log(err)
            })
            break
        case 'POST':
            const { body } = req
            console.log(body)
            loans.createLoan(req, res)
            break
        default:
            res.status(404)
    }
}
