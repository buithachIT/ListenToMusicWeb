import { createUserAPI } from "../../../services/api";
import { App, Divider, Form, FormProps, Input, Modal, notification } from "antd";
import FormItem from "antd/es/form/FormItem";

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
}

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { fullName, password, email, phone } = values;
        console.log("Form values:", values);
        const res = await createUserAPI(fullName, password, email, phone);
        if (res && res.data) {
            message.success("User created successfully");
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            message.error(res.message);
        }
    }

    return (
        <Modal
            title="Create New User"
            open={openModalCreate}
            onCancel={() => {
                setOpenModalCreate(false);
            }}
            okText="Create"
            onOk={() => { form.submit() }}
            cancelText="Cancel"
        >
            <Divider />
            <Form
                form={form}
                name="create-user"
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <FormItem<FieldType>
                    label="Display Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter display name!' }]}
                >
                    <Input placeholder="Enter display name" />
                </FormItem>

                <FormItem<FieldType>
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </FormItem>

                <FormItem<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter email!' },
                        { type: 'email', message: 'Please enter a valid email address!' }
                    ]}
                >
                    <Input placeholder="Enter email" />
                </FormItem>

                <FormItem<FieldType>
                    label="Phone Number"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please enter phone number!' },
                        { pattern: /^[0-9]+$/, message: 'Please enter only numbers!' }
                    ]}
                >
                    <Input placeholder="Enter phone number" />
                </FormItem>
            </Form>
        </Modal>
    );
};

export default CreateUser;