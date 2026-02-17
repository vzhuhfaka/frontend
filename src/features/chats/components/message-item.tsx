type Message = {
    id: number;
    author: string;
    content: string;
    time: string;
    isOwn?: boolean;
};

export const MessageItem = ({ message }: { message: Message }) => {
    const isOwn = message.isOwn;
    
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
                {!isOwn && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-xs font-bold text-white">
                        {message.author[0]}
                    </div>
                )}
                <div>
                    {!isOwn && (
                        <p className="mb-1 text-xs font-medium text-gray-600">{message.author}</p>
                    )}
                    <div className={`rounded-2xl px-4 py-2 ${
                        isOwn 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                        <p className="text-sm">{message.content}</p>
                    </div>
                    <p className={`mt-1 text-xs text-gray-400 ${isOwn ? 'text-right' : 'text-left'}`}>
                        {message.time}
                    </p>
                </div>
            </div>
        </div>
    );
};