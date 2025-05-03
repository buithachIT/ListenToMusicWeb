import SimpleBar from "simplebar-react";
import ArtistContent from "../../components/layout/content.artist";
import Sidebar from "../../components/layout/sidebar";
import NowPlayingSidebar from "../../components/layout/nowplaying.sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ArtistPage = () => {
    const { artistId, artistName } = useParams();
    const navigate = useNavigate();
    const parsedArtistId = artistId ? parseInt(artistId, 10) : null;

    console.log('Artist Page - URL params:', { artistId, artistName });
    console.log('Artist Page - parsedArtistId:', parsedArtistId);

    useEffect(() => {
        if (!parsedArtistId || !artistName) {
            console.log('Invalid artist parameters, redirecting to home');
            navigate('/');
        }
    }, [parsedArtistId, artistName, navigate]);

    if (!parsedArtistId || !artistName) {
        return <div className="text-white p-4">Invalid artist ID</div>;
    }

    return (
        <>
            <div className="flex flex-1 overflow-hidden bg-black text-white">
                {/* Sidebar */}
                <aside className="w-80 bg-[#121212] overflow-auto rounded-lg p-4 ml-2 mr-2">
                    <Sidebar />
                </aside>
                {/* Main content */}
                <SimpleBar className="flex-1 h-full pr-6 overflow-y-auto">
                    <ArtistContent
                        artistId={parsedArtistId}
                        artistName={decodeURIComponent(artistName)}
                    />
                </SimpleBar>
                <NowPlayingSidebar />
            </div>
        </>
    );
};

export default ArtistPage; 