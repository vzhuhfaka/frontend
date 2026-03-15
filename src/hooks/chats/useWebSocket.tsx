import { useCallback, useEffect, useRef, useState } from "react"
import { paths } from "@/config/paths";

const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
}

export const useWebSocket = (chatId: number | null, topicId: number | null) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const BASE_RECONNECT_DELAY = 5000; // 1 секунда

    // Очищаем сообщения при смене чата или топика
    useEffect(() => {
        setMessages([]);
        
    }, [chatId, topicId]);

    const connect = useCallback(() => {
        if (!chatId || !topicId) return;

        const token = getAuthToken();
        if (!token) {
            console.error("No auth token found");
            return;
        }

        // Добавляем user_id в query параметры
        const url = `${paths.app.chats.wsMessages.getHref(chatId, topicId)}?token=${token}`;
         
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            
            // Отправляем join_chat
            ws.send(JSON.stringify({
                event: 'join_chat',
                data: {}
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Нормализуем сообщение от бэка
                const normalizeMessage = (msg: any): any => {
                    return {
                        id: msg.id || Date.now(),
                        content: msg.content || '',
                        author: msg.author || msg.user_name || 'Пользователь',
                        time: msg.time || msg.created_at || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                        sender_id: msg.sender_id || msg.user_id || 0,
                    };
                };

                // Обрабатываем разные типы сообщений
                if (data.event === 'new_message') {
                    const newMessage = normalizeMessage(data.data);
                    setMessages(prev => [...prev, newMessage]);
                } 
            } catch (e) {
                console.error('Parse error:', e);
            }
        };

        ws.onclose = (event) => {
            setIsConnected(false);
            if (!event.wasClean) {
                reconnect();
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

    }, [chatId, topicId]);

    useEffect(() => {
        connect();
        return () => {
            socketRef.current?.close();
        };
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const msg = {
                event: "send_message",
                data: { content }
            };
            socketRef.current.send(JSON.stringify(msg));
        } else {
            console.warn('WebSocket not connected');
        }
    }, []);

    const readMessages = useCallback((idMessages: number[]) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const msg = {
                event: "read_messages",
                data: { message_ids: idMessages }
            };
            console.log('Mark as read:', msg);
            socketRef.current.send(JSON.stringify(msg));
        }
    }, []);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const msg = {
                event: "typing",
                data: { is_typing: isTyping }
            };
            socketRef.current.send(JSON.stringify(msg));
        }
    }, []);

    const reconnect = useCallback(() => {
        setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connect();
        }, BASE_RECONNECT_DELAY);
    }, [connect]);

    return { 
        sendMessage, 
        readMessages,
        sendTyping,
        isConnected,
        messages 
    };
}