import ChatBox from '../components/layout/chatbox';

const ChatBoxPage = () => {
    return (
        <div className="h-screen bg-[#121212]">
            <div className="max-w-4xl mx-auto h-full">
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-[#282828]">
                        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
                        <p className="text-gray-400">Hỏi đáp về âm nhạc</p>
                    </div>
                    <div className="flex-1">
                        <ChatBox />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBoxPage; 