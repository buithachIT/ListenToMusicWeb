import { App } from "antd";
import { useCurrentApp } from "../components/context/app.context";

const HomePage = () => {
    const { user } = useCurrentApp();
    return (
        <>
            <div>Đây là home</div>
            <div>{JSON.stringify(user)}</div>
        </>
    )
}
export default HomePage;