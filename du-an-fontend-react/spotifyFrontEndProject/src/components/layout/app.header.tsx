import { useCurrentApp } from "../context/app.context";

const AppHeader = () => {
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
    return (
        <div>App header
            <div>
                {JSON.stringify(user)}
            </div>
        </div>

    )
}
export default AppHeader
