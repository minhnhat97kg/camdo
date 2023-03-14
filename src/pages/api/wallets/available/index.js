import wallets from "@/server/controllers/wallets"

export default function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'GET':
            wallets.getAvailable(req, res, (err) => {
                console.log(err)
            })
            break
        default:
            res.status(404)
    }
}
