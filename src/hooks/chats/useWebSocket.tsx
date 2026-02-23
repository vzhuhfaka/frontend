import { useCallback, useEffect, useRef, useState } from "react"
import { paths } from "@/config/paths";

export const useWebSocket = (chatId: number | null, topicId: number | null) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const connect = useCallback(() => {
        if (!chatId || !topicId) return;

        const url = paths.app.chats.wsMessages.getHref(chatId, topicId);
        console.log('Connecting to:', url);
        
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
            
            // Отправляем join_chat
            ws.send(JSON.stringify({
                event: 'join_chat',
                data: {}
            }));
        };

        ws.onmessage = (event) => {
            console.log('📩 Received:', event.data);
            try {
                const data = JSON.parse(event.data);
                setMessages(prev => [...prev, data]);
            } catch (e) {
                console.error('Parse error:', e);
            }
        };

        ws.onclose = (event) => {
            console.log('❌ Disconnected:', event.code, event.reason);
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('🔴 WebSocket error:', error);
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
            console.log('📤 Sending:', msg);
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
            console.log('👁️ Mark as read:', msg);
            socketRef.current.send(JSON.stringify(msg));
        }
    }, []);

    return { 
        sendMessage, 
        readMessages,
        isConnected,
        messages 
    };
}