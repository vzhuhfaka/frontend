import { useState, useEffect } from "react";

import { api } from "@/lib/api-client";

interface MessageSender {
    id: number;
    first_name: string;
    last_name: string;
}

export interface Message {
    id?: number;  // делаем опциональным для временных сообщений
    author?: string; 
    content: string;
    time?: string;
    createdAt?: string;
    sender: MessageSender;
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
                setError(null);

                const response = await api.get(
                    `/chats/${chatId}/messages?topic_id=${topicId}`
                ) as MessagesResponse;
                
                // Нормализуем данные сообщений
                const normalizedMessages = response.messages.map((msg: any) => {
                    // Бэкенд возвращает sender как объект {id, first_name, last_name}
                    const senderName = msg.sender
                        ? [msg.sender.first_name, msg.sender.last_name].filter(Boolean).join(' ')
                        : msg.author || 'Пользователь';
                    const senderId = msg.sender?.id ?? msg.sender_id ?? 0;

                    return {
                        ...msg,
                        author: msg.author || senderName,
                        sender_id: senderId,
                        // Убеждаемся что есть поле time для сортировки
                        time: msg.time || msg.created_at || msg.createdAt || new Date().toISOString()
                    };
                });
                
                setMessages(normalizedMessages);
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