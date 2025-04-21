import { fetchAccountAPI } from "../../services/api";
import { createContext, useContext, useEffect, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode
}

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                console.log("Check res in context", res.data.user);
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            else {
                console.log("Lỗi fetch", res.message)
            }

            setIsAppLoading(false)
        }

        fetchAccount();
    }, [])
    console.log("Check user in context>>", user)
    console.log("AppProvider mounted", isAuthenticated, user);

    return (
        <>
            {isAppLoading === false ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser,
                    isAppLoading, setIsAppLoading
                }}>
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <PacmanLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            }

        </>

    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};

