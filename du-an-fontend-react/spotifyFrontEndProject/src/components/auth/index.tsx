import { useCurrentApp } from "../context/app.context";
import { Button, Result } from 'antd';
import { useLocation, Link } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    console.log(location.pathname);
    console.log("Check authenticated>>", isAuthenticated);
    if (isAuthenticated == false) {
        return (
            <Result
                status="404"
                title="Not login"
                subTitle="Vui lòng đăng nhập để sử dụng tính năng!"
                extra={<Button type="primary"><Link to="/login">Đăng nhập</Link></Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated == true && isAdminRoute == true) {
        const role_id = user?.role_id;
        console.log("Check role", user?.role_id)
        if (role_id == 2 || role_id == 3) {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary"><Link to="/">Back home</Link></Button>}
                />
            )
        }

    }

    return (
        <>
            {props.children}
        </>
    )
}
export default ProtectedRoute;