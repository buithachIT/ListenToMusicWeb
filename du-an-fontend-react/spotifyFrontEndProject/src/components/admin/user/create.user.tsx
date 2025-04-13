// import { createUserAPI } from "../../../services/api";
// import { App, Divider, Form, FormProps, Input, Modal, notification } from "antd";
// import FormItem from "antd/es/form/FormItem";


// type FieldType = {

//     fullName: string;
//     password: string;
//     email: string;
//     phone: string;

// }
// interface IProps {
//     openModalCreate: boolean;
//     setOpenModalCreate: (v: boolean) => void;
//     refreshTable: () => void;
// }
// const CreateUser = (props: IProps) => {
//     const { openModalCreate, setOpenModalCreate, refreshTable } = props;
//     const [form] = Form.useForm();
//     const { message } = App.useApp();

//     const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
//         const { fullName, password, email, phone } = values;
//         console.log("cheekc value>>>.", values);
//         const res = await createUserAPI(fullName, password, email, phone);
//         if (res && res.data) {
//             message.success("Tạo mới thành công");
//             form.resetFields();
//             setOpenModalCreate(false)
//             refreshTable();
//         }
//         else {
//             notification.error({
//                 message: "Tạo mới thất bại",
//                 description: res.message || "Lỗi hệ thống"
//             });
//         }
//     }

//     return (
//         <Modal

//             title="Thêm mới người dùng"
//             open={openModalCreate}
//             onCancel={() => {
//                 setOpenModalCreate(false);

//             }}
//             okText="Tạo mới"
//             onOk={() => { form.submit() }}
//             cancelText="Hủy"
//         >
//             <Divider />
//             <Form
//                 form={form}
//                 name="basic"
//                 style={{ maxWidth: 600 }}
//                 onFinish={onFinish}
//                 autoComplete="off"
//             >

//                 <FormItem<FieldType>
//                     labelCol={{ span: 24 }}
//                     label="Tên hiện thị"
//                     name="fullName"
//                     rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
//                 >
//                     <Input />
//                 </FormItem>

//                 <FormItem<FieldType>
//                     labelCol={{ span: 24 }}
//                     label="Password"
//                     name="password"
//                     rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
//                 >
//                     <Input />
//                 </FormItem>

//                 <FormItem<FieldType>
//                     labelCol={{ span: 24 }}
//                     label="Email"
//                     name="email"
//                     rules={[
//                         { required: true, message: 'Vui lòng nhập email!' },
//                         { type: 'email', message: 'Vui lòng nhập đúng định dạng email' }
//                     ]}
//                 >
//                     <Input />
//                 </FormItem>

//                 <FormItem<FieldType>
//                     labelCol={{ span: 24 }}
//                     label="Số điện thoại"
//                     name="phone"
//                     rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
//                 >
//                     <Input />
//                 </FormItem >
//             </Form >
//         </Modal >
//     );
// };

// export default CreateUser;