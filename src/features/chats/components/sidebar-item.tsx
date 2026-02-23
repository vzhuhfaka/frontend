
import { MessageCircle } from "lucide-react";

// Твои компоненты в улучшенном стиле
type SidebarChatProps = {
    chatName: string;
    lastMessageAuthor: string;
    lastMessage: string;
    time?: string;
    unread?: number;
    isActive?: boolean;
    color?: string;
};

export const SidebarChat = ({ 
    chatName, 
    lastMessageAuthor, 
    lastMessage, 
    time = "сейчас",
    unread = 0,
    isActive = false,
    color = "bg-blue-500"
}: SidebarChatProps) => {
    return (
        <div className={`
            flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-all
            ${isActive 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50 border border-transparent'
            }
        `}>
            <div className={`${color} rounded-lg p-2.5 text-white shadow-sm`}>
                <MessageCircle size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                        {chatName}
                    </h3>
                    <span className="text-xs text-gray-400">{time}</span>
                </div>
                
                <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[60px]">
                        {lastMessageAuthor}:
                    </span>
                    <p className="text-xs text-gray-500 truncate">
                        {lastMessage}
                    </p>
                </div>
            </div>
            
            {unread > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-bold text-white">
                    {unread}
                </div>
            )}
        </div>
    );
};