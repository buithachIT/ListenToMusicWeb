
import SimpleBar from "simplebar-react";
import HomeContent from "../../components/layout/content.home";
import Sidebar from "../../components/layout/sidebar";

const HomePage = () => {

    return (
        <>
            <div className="flex flex-1 overflow-hidden bg-black text-white">
                {/* Sidebar */}
                <aside className="w-64 bg-[#121212] overflow-auto rounded-lg p-4 ml-2 mr-2">
                    <Sidebar />
                </aside>
                {/* Main content */}
                <SimpleBar className="flex-1 h-full pr-6 overflow-y-auto">
                    <HomeContent />
                </SimpleBar>
            </div>
        </>
    )
}
export default HomePage;