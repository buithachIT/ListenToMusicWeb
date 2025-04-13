import { App, Button, Divider, Form, FormProps, Input } from "antd";
import "../auth/login.scss"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { KeyOutlined, MailOutlined } from "@ant-design/icons";
import { loginAPI } from "../../../services/api";
import { useCurrentApp } from "../../../components/context/app.context";

type FieldType = {
    username: string;
    password: string;
}
const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, isAuthenticated, setUser, user } = useCurrentApp()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;
        console.log(values);
        console.log("check url login>>", import.meta.env.VITE_BACKEND_URL)
        const res = await loginAPI(username, password);

        if (res.data) {
            setIsAuthenticated(true);
            console.log("check authenticated in login", isAuthenticated);

            localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwicGhvbmUiOiIxMjM0NTY3ODkiLCJmdWxsTmFtZSI6IkknbSBVc2VyIiwicm9sZSI6IlVTRVIiLCJzdWIiOiI2N2I2MGRhZWRjY2RmNTM3OGUzZjA2ZjYiLCJhdmF0YXIiOiJlZTExY2JiMTkwNTJlNDBiMDdhYWMwY2EwNjBjMjNlZS5wbmciLCJpYXQiOjE3Mzk5ODQ5MDMsImV4cCI6MjYwMzk4NDkwM30.HqA4cfuCPYMNmhkoiFnbww7clvibSzuZLJFPY7iYhu8');
            setUser(res.data.user);
            console.log("check res user>> ", user)
            message.success("Thành công!");
            navigate('/')
        } else {
            console.log("Check res if false>>", res)
            message.error(res.detail);
        }
    }

    return (
        <div className="login-container">
            <main className='main'>
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" width={50} alt="" />
                            <h2>Đăng nhập vào Spotify</h2>
                            <Divider />
                        </div>
                        <Form name="form-login" onFinish={onFinish} autoComplete="off">
                            <Form.Item<FieldType> labelCol={{ span: 24 }} label={<span style={{ color: 'white' }}>Username</span>} name="username" rules={[{ required: true, message: "Không được để trống username!" }]} >
                                <Input className="cus-placeholder" placeholder="name@domain.com" prefix={<MailOutlined />} style={{ backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px" }} />
                            </Form.Item>

                            {/* password */}
                            <Form.Item<FieldType> labelCol={{ span: 24 }} label={<span style={{ color: 'white' }}>Password</span>} name="password" rules={[{ required: true, message: "Không được để trống password!" }]} >
                                <Input.Password className="cus-placeholder" placeholder="Your password" prefix={<KeyOutlined />} style={{ backgroundColor: "#000000", color: "#fff", height: "50px", fontSize: "16px" }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType='submit' loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider />
                            <p style={{ color: "white", marginRight: '20px' }}>Chưa có tài khoản?
                                <span>
                                    <Link to='/register' style={{ color: "white", fontWeight: "bold", marginLeft: '10px' }}>Đăng ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main >
        </div >
    )
}
export default LoginPage;