import { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Modal } from 'antd';
import { SendOutlined, MessageOutlined } from '@ant-design/icons';
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

const ChatBox = ({ isOpen, onClose }: ChatBoxProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Add user message
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

            // Add AI response
            const aiMessage: Message = {
                type: 'ai',
                content: response.data.answer,
                sql: response.data.sql
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message
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
            width={320}
            title={
                <div className="flex items-center gap-2 text-white">
                    <MessageOutlined className="text-[#1DB954]" />
                    <span>AI Assistant</span>
                </div>
            }
            className="chat-modal pt-10"

            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                top: 'auto',
                marginTop: 50,
                background: 'transparent'
            }}
            mask={false}
            modalRender={(modal) => (
                <div className="rounded-lg shadow-2xl" style={{
                    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
                }}>
                    {modal}
                </div>
            )}
            styles={{
                header: {
                    background: 'linear-gradient(135deg, #000000 0%, #002405 100%)',
                    borderBottom: '1px solid #121212'
                },
                content: {
                    background: 'linear-gradient(135deg, #080808 0%, #012907 100%)'
                },
                body: {
                    background: 'linear-gradient(135deg, #856a6a 0%, #af2727 100%)'
                }
            }}
        >
            <div className="flex flex-col h-[400px]" style={{
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
            }}>
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg p-2 ${message.type === 'user'
                                    ? 'text-white'
                                    : 'text-white'
                                    }`}
                                style={{
                                    background: message.type === 'user'
                                        ? 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)'
                                        : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                                }}
                            >
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="rounded-lg p-2" style={{
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                            }}>
                                <Spin size="small" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-3 border-t border-[#121212]">
                    <div className="flex gap-2">
                        <Input.TextArea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            autoSize={{ minRows: 1, maxRows: 3 }}
                            className="bg-[#cacaca] text-black border-none rounded-lg"
                            style={{ resize: 'none' }}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSend}
                            className="bg-[#1DB954] border-none hover:bg-[#1ed760]"
                            disabled={loading || !inputValue.trim()}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChatBox; 