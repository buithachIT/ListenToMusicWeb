import SimpleBar from "simplebar-react";
import SearchContent from "../../components/layout/content.search";
import Sidebar from "../../components/layout/sidebar";
import NowPlayingSidebar from "../../components/layout/nowplaying.sidebar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (!query) {
            navigate('/');
        }
    }, [query, navigate]);

    return (
        <>
            <div className="flex flex-1 overflow-hidden bg-black text-white">
                {/* Sidebar */}
                <aside className="w-80 bg-[#121212] overflow-auto rounded-lg p-4 ml-2 mr-2">
                    <Sidebar />
                </aside>
                {/* Main content */}
                <SimpleBar className="flex-1 h-full pr-6 overflow-y-auto">
                    <SearchContent searchQuery={query} />
                </SimpleBar>
                <NowPlayingSidebar />
            </div>
        </>
    );
};

export default SearchPage; 