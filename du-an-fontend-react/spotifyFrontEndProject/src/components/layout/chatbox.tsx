import { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Modal } from 'antd';
import { SendOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Message {
    type: 'user' | 'ai';
    content: string;
    sql?: string;
}

interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Position {
    x: number;
    y: number;
}

const ChatBox = ({ isOpen, onClose }: ChatBoxProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length) {
            localStorage.setItem('chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('chat_history');
            if (saved) {
                setMessages(JSON.parse(saved));
            } else {
                setMessages([{
                    type: 'ai',
                    content: 'Xin chào! Tôi là trợ lý AI của Spotify. Tôi có thể giúp bạn tìm kiếm bài hát, nghệ sĩ hoặc album. Bạn muốn tìm gì?'
                }]);
            }
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('.modal-header')) {
            setIsDragging(true);
            const modal = modalRef.current;
            if (modal) {
                const rect = modal.getBoundingClientRect();
                setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && modalRef.current) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            // Giới hạn vị trí trong viewport
            const maxX = window.innerWidth - modalRef.current.offsetWidth;
            const maxY = window.innerHeight - modalRef.current.offsetHeight;

            // Đảm bảo không kéo ra ngoài màn hình
            const boundedX = Math.max(0, Math.min(newX, maxX));
            const boundedY = Math.max(0, Math.min(newY, maxY));

            setPosition({
                x: boundedX,
                y: boundedY
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            type: 'user',
            content: inputValue
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/chatbox/', {
                question: inputValue,
            });

            const aiMessage: Message = {
                type: 'ai',
                content: response.data.answer,
                sql: response.data.sql
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                type: 'ai',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={380}
            title={
                <div className="flex items-center justify-between modal-header cursor-move select-none">
                    <div className="flex items-center gap-2 text-white">
                        <MessageOutlined className="text-[#1DB954] text-xl" />
                        <span className="text-lg font-semibold">AI Assistant</span>
                    </div>
                    <Button
                        type="text"
                        icon={<CloseOutlined className="text-white hover:text-[#1DB954]" />}
                        onClick={onClose}
                        className="hover:bg-white/10 rounded-full"
                    />
                </div>
            }
            className="chat-modal"
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                margin: 0,
                background: 'transparent',
                transform: 'none',
                zIndex: 1000
            }}
            mask={false}
            modalRender={(modal) => (
                <div
                    ref={modalRef}
                    onMouseDown={handleMouseDown}
                    className={`rounded-2xl shadow-2xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                    style={{
                        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        userSelect: 'none',
                        touchAction: 'none',
                        willChange: 'transform'
                    }}
                >
                    {modal}
                </div>
            )}
            styles={{
                header: {
                    background: 'linear-gradient(135deg, #000000 0%, #002405 100%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px 16px 0 0',
                    padding: '16px 20px'
                },
                content: {
                    background: 'linear-gradient(135deg, #080808 0%, #012907 100%)',
                    borderRadius: '0 0 16px 16px',
                    padding: 0
                },
                body: {
                    background: 'transparent'
                }
            }}
        >
            <div className="flex flex-col h-[400px]">
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-3 shadow-lg transform transition-all duration-200 hover:scale-[1.02] ${message.type === 'user'
                                    ? 'bg-gradient-to-r from-[#1DB954] to-[#1ed760]'
                                    : 'bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d]'
                                    }`}
                            >
                                <div className="whitespace-pre-wrap text-sm text-white">{message.content}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="rounded-2xl p-3 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] shadow-lg">
                                <Spin size="small" className="text-[#1DB954]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex gap-2">
                        <Input.TextArea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            className="bg-white/10 text-black border-none rounded-xl placeholder:text-white/50 focus:ring-2 focus:ring-[#1DB954] transition-all duration-200"
                            style={{ resize: 'none' }}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSend}
                            className="bg-[#1DB954] border-none hover:bg-[#1ed760] rounded-xl h-10 w-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            disabled={loading || !inputValue.trim()}
                        />
                    </div>
                </div>
            </div>

            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out;
                    }
                `}
            </style>
        </Modal>
    );
};

export default ChatBox; 