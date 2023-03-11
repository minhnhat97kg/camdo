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
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import * as util from '../../../utils'

export default function PaidForm({ onOk, onCancel, open, onClose, data }) {

    const [form] = Form.useForm();
    const interestString = useMemo(() => data && util.interestTypeToString(data.interest, data.interestType), [data])

    function handleSubmit({ id, productName, paidAmount }) {
        onOk({ id, productName, paidAmount })
        onClose()
        form.resetFields()
    }
    useEffect(() => form.setFieldsValue(data || {}), [data])
    return (
        <Modal
            onOk={form.submit}
            open={open}
            onCancel={onClose}
            title="Chi tiết khoản vay"
            okText="Chuộc"
        >
            <Form
                labelCol={{ span: 6, }} wrapperCol={{ span: 12, }}
                layout="horizontal"
                style={{ maxWidth: 600, }}
                form={form}
                onFinish={handleSubmit}
            >

                <Form.Item label="ID" name="id" >
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Khách hàng" name="userName" >
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="userPhone"  >
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Sản phẩm" name="productName" >
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Ngày vay" >
                    <Input disabled value={moment(data?.startedAt || "").format("DD-MM-yyyy")} />
                </Form.Item>
                <Form.Item label="Số tiền" >
                    <Input value={util.formatCurrency(data?.amount || 0)} disabled />
                </Form.Item>
                <Form.Item label="Lãi">
                    <Input value={interestString} disabled />
                </Form.Item>
                <Form.Item label="Ngày trể" name={"days"}>
                    <Input disabled />
                </Form.Item>
                <Form.Item label="Tạm tính">
                    <Input value={util.formatCurrency(data?.lateAmount || 0)} disabled />
                </Form.Item>
                <Form.Item label="Số tiền" name="paidAmount" rules={[{ required: true, message: 'Giá trị vay là bắt buộc!', }]} >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="đ"
                        defaultValue={1000}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
            </Form>
        </Modal >
    );
};
