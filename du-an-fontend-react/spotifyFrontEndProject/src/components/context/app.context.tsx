import { createContext, useContext, useState } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    setUser: (v: IUser) => void;
    setIsAuthenticated: (v: boolean) => void;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
}
const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode;

}
export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    return (
        <CurrentAppContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, isAppLoading, setIsAppLoading }}>
            {props.children}
        </CurrentAppContext.Provider>
    )
}

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be "
        )
    }
    return currentAppContext;

}