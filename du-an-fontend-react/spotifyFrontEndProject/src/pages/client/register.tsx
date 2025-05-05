import React, { useState } from "react";
import { Form, Input, Button, Divider, FormProps, App } from "antd";
import { MailOutlined, GoogleOutlined, FacebookOutlined, AppleOutlined, UserOutlined, KeyOutlined, PhoneOutlined } from "@ant-design/icons";
import './register.scss';
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../../services/api";

type FieldType = {
    fullname: string;
    email: string;
    phone: string;
    password: string;
}
const RegisterForm: React.FC = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { email, fullname, phone, password } = values;
        console.log("check values>>", values);

        const res = await registerAPI(email, fullname, phone, password);
        console.log("API response:", res);
        console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

        if (res.data) {
            message.success("Đăng ký user thành công!")
            navigate("/login");
        } else {
            message.error(res.message);
        }
        setIsSubmit(false);
    };

    return (
        <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: 450, padding: 32, textAlign: "center" }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" width={50} alt="" />
                <h2 style={{ color: "#fff", fontSize: "28px" }}>Đăng ký để <br /> bắt đầu nghe</h2>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ remember: true }}
                    style={{ textAlign: "left" }}
                >
                    {/* Email */}
                    <Form.Item<FieldType>
                        label={<span style={{ color: "#fff", fontSize: "16px" }}>Địa chỉ email</span>}
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email!", type: "email" }]}
                    >
                        <Input className="cus-placeholder" placeholder="name@domain.com" prefix={<MailOutlined />} style={{ backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px" }} />
                    </Form.Item>

                    {/* Fullname */}
                    <Form.Item<FieldType>
                        label={<span style={{ color: "#fff", fontSize: "16px" }}>Họ tên</span>}
                        name="fullname"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên của bạn!", type: "string" }]}
                    >
                        <Input className="cus-placeholder" placeholder="Your full name" prefix={<UserOutlined />} style={{ backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px" }} />
                    </Form.Item>

                    {/* phone */}
                    <Form.Item<FieldType>
                        label={<span style={{ color: "#fff", fontSize: "16px" }}>Số điện thoại</span>}
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn!", type: "string" }]}
                    >
                        <Input className="cus-placeholder" placeholder="Your full name" prefix={<PhoneOutlined />} style={{ backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px" }} />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item<FieldType>
                        label={<span style={{ color: "#fff", fontSize: "16px" }}>Mật khẩu</span>}
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!", type: "string" }]}
                    >
                        <Input className="cus-placeholder" placeholder="Your password" prefix={<KeyOutlined />} style={{ backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px" }} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={isSubmit} block style={{ backgroundColor: "#1DB954", color: "#000000", borderColor: "#1DB954", height: "50px", fontSize: "16px", fontWeight: 'bold' }}>
                        Đăng ký
                    </Button>
                </Form>

                <Divider style={{ borderColor: "#ffffff", opacity: 1, color: "white", margin: "24px 0" }}>
                    hoặc
                </Divider>

                <Button icon={<GoogleOutlined />} block style={{ display: "flex", justifyContent: "space-evenly", backgroundColor: "#000000", color: "#fff", marginBottom: 12, height: "50px", fontSize: "16px", fontWeight: 'bold' }}>
                    Đăng ký bằng Google
                </Button>
                <Button icon={<FacebookOutlined />} block style={{ display: "flex", justifyContent: "space-evenly", marginBottom: 12, backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px", fontWeight: 'bold' }}>
                    Đăng ký bằng Facebook
                </Button>
                <Button icon={<AppleOutlined />} block style={{ display: "flex", justifyContent: "space-evenly", backgroundColor: "#000000", color: "#ffffff", height: "50px", fontSize: "16px", fontWeight: 'bold' }}>
                    Đăng ký bằng Apple
                </Button>

                <p style={{ marginTop: 20, color: "#fff", fontSize: "14px" }}>
                    Bạn đã có tài khoản? <Link to="/login" style={{ color: 'white', fontWeight: "bold" }}>
                        Đăng nhập tại đây</Link>
                </p>
            </div>
        </div >
    );
};

export default RegisterForm;