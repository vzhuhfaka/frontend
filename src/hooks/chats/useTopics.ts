import { useState, useEffect } from "react";

import { api } from "@/lib/api-client";

export interface Topic {
    id: number;
    name: string;
    isActive: boolean;
    chatId: number;
}

// Хук для получения топиков чата
export const useTopics = (chatId: number | null) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chatId) {
            setTopics([]);
            return;
        }

        const fetchTopics = async () => {
            try {
                setLoading(true);
                const data = await api.get(`/chats/${chatId}/topics`) as Topic[];
                // Добавляем chatId к каждому топику
                const topicsWithChatId = data.map(topic => ({
                    ...topic,
                    chatId
                }));
                setTopics(topicsWithChatId);
                setError(null);
            } catch (err) {
                setError("Failed to load topics");
                console.error("Error fetching topics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [chatId]);

    return { topics, loading, error };
}; 