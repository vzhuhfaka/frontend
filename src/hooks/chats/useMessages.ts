import { useState, useEffect } from "react";

import { api } from "@/lib/api-client";

interface Message {
    id: number;
    author: string;
    content: string;
    time: string;
    isOwn: boolean;
    topicId?: number;
}

interface MessagesResponse {
    chatId: number;
    topicId: number | null;
    totalMessages: number;
    messages: Message[];
}

// Хук для получения истории сообщений
export const useMessages = (chatId: number | null, topicId: number | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chatId || !topicId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/chats/${chatId}/messages?topic_id=${topicId}`
                ) as MessagesResponse;
                
                setMessages(response.messages);
                setError(null);
            } catch (err) {
                setError("Failed to load messages");    
                console.error("Error fetching messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [chatId, topicId]);

    return { messages, loading, error };
};