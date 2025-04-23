import { createContext, useContext, useState } from "react";

interface PlayerContextProps {
    currentTrack: ITrack | null;
    setCurrentTrack: (track: ITrack) => void;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    playlist: ITrack[];
    setPlayList: (t: ITrack[]) => void;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;

}
type TProp = {
    children: React.ReactNode;
}
const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
export const PlayerProvider = (props: TProp) => {
    const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlayList] = useState<ITrack[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    return (
        <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, playlist, setPlayList, currentIndex, setCurrentIndex }}>
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