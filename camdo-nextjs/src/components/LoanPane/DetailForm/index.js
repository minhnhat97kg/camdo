import { PlusOutlined } from '@ant-design/icons';
import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Modal,
    message
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import * as util from '../../../utils'

export default function DetailForm({ data }) {
    const [form] = Form.useForm();
    const interestString = useMemo(() => data && util.interestTypeToString(data.interest, data.interestType), [data])

    useEffect(() => form.setFieldsValue(data), [data])
    return data && (
        <Form
            labelCol={{ span: 6, }} wrapperCol={{ span: 12, }}
            layout="horizontal"
            style={{ maxWidth: 700, }}
            form={form}
            contentEditable={false}
        >
            <Form.Item label="Khách hàng" >
                <Input value={data?.userName || ""} />
            </Form.Item>
            <Form.Item label="SĐT"   >
                <Input value={data?.userPhone || ""} />
            </Form.Item>
            <Form.Item label="Sản phẩm"  >
                <Input value={data?.productName || ""} />
            </Form.Item>
            <Form.Item label="Ngày vay" >
                <Input value={dayjs(data.createdAt || "").format("DD-MM-YYYY")} />
            </Form.Item>
            <Form.Item label="Số tiền" >
                <Input value={util.formatCurrency(data?.amount || 0)} />
            </Form.Item>
            <Form.Item label="Lãi">
                <Input value={interestString} />
            </Form.Item>
            <Form.Item label="Tạm tính">
                <Input value={util.formatCurrency(data?.lateAmount || 0)} />
            </Form.Item>
            <Form.Item label="Đã trả">
                <Input value={util.formatCurrency(data?.paidAmount || 0)} />
            </Form.Item>
            <Form.Item label="Ngày trả" >
                <Input value={dayjs(data.paidAt|| "").format("DD-MM-YYYY")} />
            </Form.Item>
            <Form.Item label="Ngày trể">
                <Input value={data?.days || 0} />
            </Form.Item>


        </Form>
    );
};
