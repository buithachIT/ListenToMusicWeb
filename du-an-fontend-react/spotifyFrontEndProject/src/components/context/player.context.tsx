import { createContext, useContext, useState } from "react";

interface PlayerContextProps {
    currentTrack: ITrack | null;
    setCurrentTrack: (track: ITrack) => void;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}
type TProp = {
    children: React.ReactNode;
}
const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
export const PlayerProvider = (props: TProp) => {
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying }}>
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