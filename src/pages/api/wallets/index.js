import wallets from "@/server/controllers/wallets"

export default function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'GET':
            wallets.getWallet(req, res, (err) => {
                console.log(err)
            })
            break
        case 'POST':
            wallets.createRecord(req, res)
            break
        default:
            res.status(404)
    }
}
