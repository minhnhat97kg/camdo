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
import locale from 'antd/lib/date-picker/locale/vi_VN';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

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
                <Form.Item label="Khách hàng" name="userName" rules={[{ required: true, message: 'Tên khách hàng là bắt buộc!', }]} >
                    <Input />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="userPhone"  >
                    <Input />
                </Form.Item>
                <Form.Item label="Sản phẩm" name="productName" rules={[{ required: true, message: 'Sản phẩm là bắt buộc!', }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Ngày vay" name="startedAt" rules={[{ required: true, message: 'Ngày vay là bắt buộc!', }]}>
                    <DatePicker locale={locale} format={'DD-MM-YYYY'} />
                </Form.Item>
                <Form.Item label="Số tiền" name="amount" rules={[{ required: true, message: 'Giá trị vay là bắt buộc!', }]} >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="đ"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item label="Loại lãi" name="interestType" initialValue={'PERCENTS_PER_MONTH'} rules={[{ required: true, message: 'Loại lãi suất vay là bắt buộc!', }]}>
                    <Select>
                        <Select.Option value="PERCENTS_PER_MONTH">%/tháng</Select.Option>
                        <Select.Option value="PERCENTS_PER_DAY">%/ngày</Select.Option>
                        <Select.Option value="AMOUNT_PER_MONTH">đ/tháng</Select.Option>
                        <Select.Option value="AMOUNT_PER_DAY">đ/ngày</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Lãi" name="interest" rules={[{ required: true, message: 'Giá trị lãi là bắt buộc!', }]} >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Modal>
    );
};
