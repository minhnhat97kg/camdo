import moment from "moment"
import { Tag } from 'antd'

const InterestType = {
    PercentsPerMonth: 'PERCENTS_PER_MONTH',
    PercentsPerDay: 'PERCENTS_PER_DAY',
    AmountPerMonth: 'AMOUNT_PER_MONTH',
    AmountPerDay: 'AMOUNT_PER_DAY',
}

export const Status = {
    Paid: 'PAID',
    Deleted: 'DELETED',
    Actived: 'ACTIVED',
    Sold: 'SOLD',
}
export const Statues = [Status.Actived, Status.Paid]


export function calculateFee(data) {
    const { amount,
        interest,
        interestType,
        startedAt, paidAt } = data
    let now = moment()
    if (paidAt) {
        now = moment(paidAt)
    }
    const diffDays = now.diff(moment(startedAt), 'days') + 1
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

export function interestTypeToString(value, type) {
    switch (type) {
        case InterestType.PercentsPerMonth:
            return `${value}% /tháng`
        case InterestType.PercentsPerDay:
            return `${value}% /ngày`
        case InterestType.AmountPerMonth:
            return `${formatCurrency(value)}/tháng`
        case InterestType.AmountPerDay:
            return `${formatCurrency(value)}/ngày`
        default:
            return 'Lỗi dữ liệu'
    }
}

export function statusToString(v) {
    switch (v) {
        case Status.Actived:
            return <Tag color={'geekblue'}>Đang hoạt động</Tag>
        case Status.Deleted:
            return <Tag color={'red'}>Đã xoá</Tag>
        case Status.Paid:
            return <Tag color={'green'}>Đã chuộc</Tag>
        case Status.Sold:
            return <Tag color={'cyan'}>Thanh lý</Tag>
        default:
            return <Tag color={'geekblue'}>Lỗi dữ liệu</Tag>
    }
}

export function formatCurrency(v) {
    return new Intl.NumberFormat('vi-VI', { style: 'currency', currency: 'VND' }).format(v)
}