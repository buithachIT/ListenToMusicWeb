import { App, Divider, Form, FormProps, Input, message, Modal, notification } from "antd";
import { useEffect } from "react";
import FormItem from "antd/es/form/FormItem";
import { updateUserAPI } from "@/services/api";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void;
    refreshTable: () => void;
}
type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}

const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, refreshTable } = props;
    const [form] = Form.useForm()
    const { message } = App.useApp();
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                email: dataUpdate.email,
                fullName: dataUpdate.fullName,
                phone: dataUpdate.phone,
            })
        }
    }, [dataUpdate])
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { _id, email, fullName, phone } = values;
        console.log("check value Update>>", values);

        const res = await updateUserAPI(_id, fullName, phone);
        if (res && res.data) {
            setDataUpdate(null);
            setOpenModalUpdate(false);
            message.success("Thành công");
            refreshTable();
        }
        else {
            notification.error({
                message: "Tạo mới thất bại",
                description: res.message || "Lỗi hệ thống"
            });
        }
    }
    return (
        <Modal
            title="Sửa thông tin người dùng"
            open={openModalUpdate}
            onCancel={() => {
                setOpenModalUpdate(false);

            }}
            okText="Tạo mới"
            onOk={() => { form.submit() }}
            cancelText="Hủy"
        >
            <Divider />
            <Form
                form={form}
                name="basic"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
            >

                <FormItem<FieldType>
                    hidden
                    labelCol={{ span: 24 }}
                    label="_id"
                    name="_id"
                    rules={[{ required: true, message: 'Vui lòng nhập _id!' }]}
                >
                    <Input disabled />
                </FormItem>

                <FormItem<FieldType>
                    labelCol={{ span: 24 }}
                    label="email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input disabled />
                </FormItem>

                <FormItem<FieldType>
                    labelCol={{ span: 24 }}
                    label="Fullname"
                    name="fullName"
                    rules={[
                        { required: true, message: 'Vui lòng nhập full name!' },

                    ]}
                >
                    <Input />
                </FormItem>

                <FormItem<FieldType>
                    labelCol={{ span: 24 }}
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input />
                </FormItem >
            </Form >
        </Modal >
    )
}
export default UpdateUser;