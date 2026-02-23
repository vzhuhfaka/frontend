import { type Message } from "@/hooks/chats/useMessages";

export const MessageItem = ({ message, myId }: { message: Message, myId: number | undefined }) => {
    const isOwn = message?.sender_id != null && message.sender_id === myId;
    
    // Получение инициалов автора
    const getAuthorInitial = () => {
        if (!message?.author) return '?';
        return message.author[0]?.toUpperCase() || '?';
    };

    // Форматирование времени
    const formatTime = (time: string | undefined) => {
        if (!time) return '';
        try {
            return new Date(time).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return time;
        }
    };

    if (!message) return null;
    
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                {!isOwn && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-xs font-bold text-white shrink-0">
                        {getAuthorInitial()}
                    </div>
                )}
                <div className="min-w-0"> {/* Добавляем min-w-0 для корректного переноса текста */}
                    {!isOwn && message?.author && (
                        <p className="mb-1 text-xs font-medium text-gray-600 truncate max-w-[200px]">
                            {message.author}
                        </p>
                    )}
                    <div className={`rounded-2xl px-4 py-2 break-words ${
                        isOwn 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                        <p className="text-sm whitespace-pre-wrap">{message?.content || ''}</p>
                    </div>
                    <p className={`mt-1 text-xs text-gray-400 ${isOwn ? 'text-right' : 'text-left'}`}>
                        {formatTime(message?.time)}
                    </p>
                </div>
            </div>
        </div>
    );
};