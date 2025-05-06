import { createContext, useContext, useState, ReactNode } from "react";

// Type playlist
export interface IPlaylist {
    playlist_id: number;
    name: string;
    user?: IUser;
    userid?: string;
}

// Context type
interface AlbumContextProps {
    albums: IPlaylist[];
    setAlbums: (albums: IPlaylist[]) => void;
}

// Tạo context
const AlbumContext = createContext<AlbumContextProps | undefined>(undefined);

// Provider
export const AlbumProvider = ({ children }: { children: ReactNode }) => {
    const [albums, setAlbums] = useState<IPlaylist[]>([]);

    return (
        <AlbumContext.Provider value={{ albums, setAlbums }}>
            {children}
        </AlbumContext.Provider>
    );
};

// Custom hook 
export const useAlbum = () => {
    const context = useContext(AlbumContext);
    if (!context) {
        throw new Error("useAlbum must be used within AlbumProvider");
    }
    return context;
};
