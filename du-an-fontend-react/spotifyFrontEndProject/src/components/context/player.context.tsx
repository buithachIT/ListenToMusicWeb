import { createContext, useContext, useState } from "react";

interface PlayerContextProps {
    currentTrack: ITrack | null;
    setCurrentTrack: (track: ITrack) => void;
}
type TProp = {
    children: React.ReactNode;
}
const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
export const PlayerProvider = (props: TProp) => {
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null)
    return (
        <PlayerContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {props.children}
        </PlayerContext.Provider>
    )
}
export const usePlayer = () => {
    const contextPlayer = useContext(PlayerContext);
    if (!contextPlayer) {
        throw new Error('usePlayer must be used within PlayerProvider');
    }
    return contextPlayer;
}