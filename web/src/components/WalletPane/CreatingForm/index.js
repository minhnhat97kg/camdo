import { PlusOutlined } from '@ant-design/icons';
import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Modal
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function CreatingForm({ onOk, onCancel, open, onClose }) {
    const [form] = Form.useForm();

    function handleSubmit(values) {
        onOk({ ...values, createdAt: dayjs(values.createdAt).startOf('day').toISOString() })
        onClose()
        form.resetFields()

    }
    return (
        <Modal open={open} onOk={form.submit} onCancel={onClose}>
            <Form
                labelCol={{ span: 6, }} wrapperCol={{ span: 12, }}
                layout="horizontal"
                style={{ maxWidth: 600, }}
                form={form}
                onFinish={handleSubmit}
            >
                <Form.Item label="Mô tả" name="title" rules={[{ required: true, message: 'Vui long nhập mô tả', }]} >
                    <Input />
                </Form.Item>
                <Form.Item label="Số tiền" name="amount" rules={[{ required: true, message: 'Giá trị vay là bắt buộc!', }]} >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="đ"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
