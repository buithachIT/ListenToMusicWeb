import { App, Divider, Form, FormProps, Input, Modal, notification } from "antd";
import { useEffect } from "react";
import FormItem from "antd/es/form/FormItem";
import { updateUserAPI } from "../../../services/api";
import { AxiosError } from "axios";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    dataUpdate: IUserList | null;
    setDataUpdate: (v: IUserList | null) => void;
    refreshTable: () => void;
}

type FieldType = {
    id: number;
    email: string;
    fullname: string;
    phone: string;
}

const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, refreshTable } = props;
    const [form] = Form.useForm();
    const { message } = App.useApp();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                email: dataUpdate.email,
                fullname: dataUpdate.fullname,
                phone: dataUpdate.phone,
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { id, fullname, email, phone } = values;
        try {
            const res = await updateUserAPI(id, fullname, email, phone);
            if (res?.data) {
                setDataUpdate(null);
                setOpenModalUpdate(false);
                message.success("User updated successfully");
                refreshTable();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: "Update failed",
                    description: error.response?.data?.message || "System error"
                });
            } else {
                notification.error({
                    message: "Update failed",
                    description: "System error"
                });
            }
        }
    };

    return (
        <Modal
            title="Update User Information"
            open={openModalUpdate}
            onCancel={() => {
                setOpenModalUpdate(false);
                setDataUpdate(null);
            }}
            okText="Update"
            onOk={() => { form.submit() }}
            cancelText="Cancel"
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
                    label="ID"
                    name="id"
                    rules={[{ required: true, message: 'Please input ID!' }]}
                >
                    <Input disabled />
                </FormItem>

                <FormItem<FieldType>
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input email!' }]}
                >
                    <Input disabled />
                </FormItem>

                <FormItem<FieldType>
                    labelCol={{ span: 24 }}
                    label="Full Name"
                    name="fullname"
                    rules={[
                        { required: true, message: 'Please input full name!' },
                    ]}
                >
                    <Input />
                </FormItem>

                <FormItem<FieldType>
                    labelCol={{ span: 24 }}
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: 'Please input phone number!' }]}
                >
                    <Input />
                </FormItem>
            </Form>
        </Modal>
    );
};

export default UpdateUser;