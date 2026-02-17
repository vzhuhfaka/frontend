import { MessageCircle, Hash, User, Send, Plus } from "lucide-react";

import { ContentLayout } from "@/components/layouts";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button";

import { SidebarChat } from "@/features/chats/components/sidebar-chat";
import { TopicTheme } from "@/features/chats/components/topic-theme";
import { MessageItem } from "@/features/chats/components/message-item";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useChats } from "@/hooks/chats/useChats";
import { useTopics } from "@/hooks/chats/useTopics";
import { useMessages } from "@/hooks/chats/useMessages";

import { type Chat } from "@/hooks/chats/useChats";
import { type Topic } from "@/hooks/chats/useTopics";

import { paths } from "@/config/paths";


const ChatsArea = () => {
    const navigate = useNavigate();
    
    // Состояния для выбранных элементов
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedChatName, setSelectedChatName] = useState<string>("");

    // Получаем данные
    const { chats, loading: chatsLoading, error: chatsError } = useChats();
    const { topics, loading: topicsLoading, error: topicsError } = useTopics(selectedChatId);
    const { messages, loading: messagesLoading, error: messagesError } = useMessages(selectedChatId, selectedTopicId);

    // Обработчик выбора чата
    const handleChatSelect = (chat: Chat) => {
        setSelectedChatId(chat.id);
        setSelectedChatName(chat.name);
        setSelectedTopicId(null); // Сбрасываем выбранный топик при смене чата
    };

    // Обработчик выбора топика
    const handleTopicSelect = (topic: Topic) => {
        setSelectedTopicId(topic.id);
    };

    // Автоматически выбираем первый топик при загрузке топиков
    useEffect(() => {
        if (topics.length > 0 && !selectedTopicId) {
            setSelectedTopicId(topics[0].id);
        }
    }, [topics, selectedTopicId]);

    if (chatsLoading) {
        return (
            <ContentLayout title="Чаты">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Загрузка чатов...</div>
                    </div>
                </div>
            </ContentLayout>
        );
    }

    if (chatsError) {
        return (
            <ContentLayout title="Чаты">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-red-500">{chatsError}</div>
                    </div>
                </div>
            </ContentLayout>
        );
    }

    // Находим выбранный чат
    const selectedChat = chats.find(chat => chat.id === selectedChatId) || chats[0];
    
    // Если нет выбранного чата, выбираем первый
    if (!selectedChatId && chats.length > 0) {
        setSelectedChatId(chats[0].id);
        setSelectedChatName(chats[0].name);
    }

    return (
        <ContentLayout title="Чаты">
            <div className="mx-auto max-w-7xl p-6">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-bold text-gray-900">
                            Чаты
                        </h1>
                        <p className="text-sm text-gray-500">
                            Общайтесь с участниками в реальном времени
                        </p>
                    </div>
                    <Button className="gap-2" onClick={() => {navigate(paths.app.chats.create.getHref())}}>
                        <Plus size={18} />
                        Создать чат
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Sidebar with Chats */}
                    <div className="lg:col-span-1">
                        <section className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Диалоги
                                        </h2>
                                        <p className="text-xs text-gray-400">
                                            {chats.length} активных чатов
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div className="divide-y divide-gray-50 p-2">
                                {chats.map((chat) => (
                                    <div 
                                        key={chat.id} 
                                        onClick={() => handleChatSelect(chat)}
                                        className="cursor-pointer transition-all hover:bg-gray-50"
                                    >
                                        <SidebarChat
                                            chatName={chat.name}
                                            lastMessageAuthor={chat.lastMessageAuthor}
                                            lastMessage={chat.lastMessage}
                                            time={chat.time}
                                            unread={chat.unread}
                                            isActive={selectedChatId === chat.id}
                                            color={chat.color}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                                <Button 
                                    variant="ghost" 
                                    className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900"
                                >
                                    <Plus size={16} />
                                    Присоединиться к чату
                                </Button>
                            </div>
                        </section>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {/* Topics Section */}
                        <section className="mb-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Темы {selectedChatName && `- ${selectedChatName}`}
                                    </h2>
                                    {topicsLoading ? (
                                        <p className="text-xs text-gray-400">Загрузка тем...</p>
                                    ) : topicsError ? (
                                        <p className="text-xs text-red-400">{topicsError}</p>
                                    ) : (
                                        <p className="text-xs text-gray-400">
                                            {topics.length} доступных тем
                                        </p>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Hash size={14} />
                                    Все темы
                                </Button>
                            </div>
                            
                            {selectedChatId ? (
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                    <Button onClick={()=>{}}>
                                        <Plus/>Создать тему
                                    </Button>
                                    {topics.map((topic) => (
                                        <div 
                                            key={topic.id} 
                                            onClick={() => handleTopicSelect(topic)}
                                            className="cursor-pointer"
                                        >
                                            <TopicTheme
                                                name={topic.name}
                                                isActive={selectedTopicId === topic.id}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl">
                                    <p className="text-gray-400">Выберите чат для просмотра тем</p>
                                </div>
                            )}
                        </section>

                        {/* Chat Area */}
                        <section>
                            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                {/* Chat Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 text-white shadow-sm">
                                            <MessageCircle size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {selectedChatName || "Выберите чат"}
                                            </h3>
                                            {selectedChat && (
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex h-2 w-2">
                                                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {selectedChat.members} участников онлайн
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <User size={14} />
                                            Участники
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="h-[400px] bg-gradient-to-b from-gray-50/50 to-white p-4 overflow-y-auto">
                                    {messagesLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-gray-400">Загрузка сообщений...</p>
                                        </div>
                                    ) : messagesError ? (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-red-400">{messagesError}</p>
                                        </div>
                                    ) : messages.length > 0 ? (
                                        <div className="space-y-4">
                                            {messages.map((message) => (
                                                <MessageItem key={message.id} message={message} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-gray-400">
                                                {selectedTopicId 
                                                    ? "Нет сообщений в этой теме" 
                                                    : "Выберите тему для просмотра сообщений"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="border-t border-gray-100 bg-white p-4">
                                    <div className="flex gap-3">
                                        <Input
                                            placeholder={selectedTopicId 
                                                ? "Написать сообщение..." 
                                                : "Выберите тему для отправки сообщения"}
                                            className="flex-1 bg-gray-50 border-gray-200 focus:bg-white"
                                            disabled={!selectedTopicId}
                                        />
                                        <Button 
                                            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                            disabled={!selectedTopicId}
                                        >
                                            <Send size={16} />
                                            Отправить
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        <p className="text-xs text-gray-400">
                                            Нажмите Enter для отправки
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-400">
                                                Поддерживается Markdown
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default ChatsArea;