# Чат (Chats)

Модуль чата для системы управления проектами. Поддерживает реальное время через WebSocket, разделение на чаты и темы (топики), а также создание новых чатов и тем.


## 1 Маршруты

### 1.1 Конфигурация путей

Файл: `src/config/paths.ts`

```tsx
export const paths = {
    app: {
        chats: {
            main: {
                path: "chats",
                getHref: () => "/app/chats"
            },
            create: {
                path: "chats/create",
                getHref: () => "/app/chats/create"
            },
            createTopic: {
                path: "chats/:chatId/create/topic",
                getHref: (chatId: number) => `/app/chats/${chatId}/create/topic`
            },
            wsMessages: {
                getHref: (chatId: number, topicId: number) => 
                    `ws://localhost:8000/v1/ws/chats/${chatId}/topics/${topicId}/messages`
            }
        }
    }
} as const;

```
### 1.2 Использование
```tsx
import { paths } from '@/config/paths';

// Навигация к списку чатов
<Link to={paths.app.chats.main.getHref()} />

// Навигация к созданию чата
<Link to={paths.app.chats.create.getHref()} />

// Навигация к созданию темы для конкретного чата
<Link to={paths.app.chats.createTopic.getHref(chatId)} />

// WebSocket URL (используется внутри хуков)
const wsUrl = paths.app.chats.wsMessages.getHref(chatId, topicId);
// Результат: ws://localhost:8000/v1/ws/chats/123/topics/456/messages
```

## 2 Структура роутов
```
src/app/routes/app/
├── chats.tsx                 # Главная страница чата (/app/chats)
├── chats.create.tsx          # Создание нового чата (/app/chats/create)
└── chats.create-topic.tsx    # Создание темы (/app/chats/:chatId/create/topic)
```

## 3 Компоненты
```
src/features/chats/components/
├── sidebar-item.tsx          # Элемент списка чатов (SidebarChat)
├── topic-item.tsx            # Элемент темы (TopicTheme)
├── message-item.tsx          # Элемент сообщения (MessageItem)
├── header.tsx                # Заголовок страницы чатов
├── create-chat-form.tsx      # Форма создания чата
└── create-topic-form.tsx     # Форма создания темы
```

## 4 Кастомные хуки
### 4.1 useChats()
Получение списка всех доступных чатов.
```ts
import { useChats } from "@/hooks/chats/useChats";

const { chats, loading, error } = useChats();

// Chat interface
interface Chat {
    id: number;
    name: string;
    lastMessage: string;
    lastMessageAuthor: string;
    time: string;
    members: number;
    unread: number;
    isActive: boolean;
    color?: string;
}
```

### 4.2 useTopics(chatId)
Получение тем (топиков) для выбранного чата.
```ts
import { useTopics } from "@/hooks/chats/useTopics";

const { topics, loading, error } = useTopics(selectedChatId);

// Topic interface
interface Topic {
    id: number;
    name: string;
    isActive: boolean;
    chatId: number;
}
```

### 4.3 useMessages(chatId, topicId)
Получение истории сообщений для выбранной темы.
```ts
import { useMessages } from "@/hooks/chats/useMessages";

const { messages, loading, error } = useMessages(selectedChatId, selectedTopicId);

// Message interface
interface Message {
    id?: number;
    author?: string;
    content: string;
    time?: string;
    createdAt?: string;
    sender_id?: number;
}
```

### 4.4 useWebSocket(chatId, topicId, userId)
WebSocket соединение для реального времени.
```ts
import { useWebSocket } from "@/hooks/chats/useWebSocket";

const { 
    sendMessage,    // (content: string) => void
    readMessages,   // (messageIds: number[]) => void
    sendTyping,     // (isTyping: boolean) => void
    isConnected,    // boolean
    messages        // Message[] (новые сообщения в реальном времени)
} = useWebSocket(selectedChatId, selectedTopicId, authMe?.id);
```

### 4.5 События WebSocket:
- `join_chat` - подключение к чату (отправляется автоматически)
- `send_message` - отправка нового сообщения
- `new_message` - получение нового сообщения
- `read_messages` - отметка о прочтении
- `typing` - индикатор печатания

### 4.6 useAuthMe()
Получение информации о текущем пользователе.
```ts
import { useAuthMe } from "@/hooks/chats/useAuthMe";

const { authMe, loading, error } = useAuthMe();

// AuthResponse interface
interface AuthResponse {
    id: number;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
}
```

### 4.7 useCreateChat()
Создание нового чата.
```ts
import { useCreateChat } from "@/hooks/chats/useCreateChat";

const { createChat, error, loading, resCode } = useCreateChat();

const handleCreate = async () => {
    await createChat({ name: "Новый чат" });
    // Редирект на /app/chats
};
```

### 4.8 useCreateTopic(chatId)
Создание новой темы в чате.
```ts
import { useCreateTopic } from "@/hooks/chats/useCreateTopic";

const { createTopic, error, loading, resCode } = useCreateTopic(chatId);

const handleCreate = async () => {
    await createTopic({ name: "Новая тема" });
    // Редирект на /app/chats
};
```

## 5 WebSocket API
### 5.1 События от клиента → сервер

| Событие         | Payload                                    | Описание                                                      |
|-----------------|--------------------------------------------|---------------------------------------------------------------|
| `send_message`  | `{ "content": "Текст", "topic_id": 5 }`    | Отправка нового сообщения                                     |
| `edit_message`  | `{ "message_id": 10, "content": "Новый текст" }` | Редактирование сообщения (только отправитель)                |
| `delete_message`| `{ "message_id": 10 }`                     | Удаление сообщения (только отправитель или админ)             |
| `read_messages` | `{ "message_ids": [10, 11, 12] }`          | Уведомление сервера, что пользователь прочитал сообщения      |
| `join_chat`     | `{}`                                       | Присоединиться к чату (подписка на события)                   |
| `leave_chat`    | `{}`                                       | Выйти из чата                                                 |

### 5.2 События от сервера → клиент

| Событие           | Payload                                                                                     | Описание                             |
|-------------------|---------------------------------------------------------------------------------------------|--------------------------------------|
| `new_message`     | `{ "id": 10, "chat_id": 1, "sender_id": 3, "content": "Привет", "topic_id": 2, "created_at": "2026-02-16T12:00:00Z" }` | Новое сообщение в чате               |
| `message_edited`  | `{ "message_id": 10, "content": "Новый текст" }`                                            | Сообщение было отредактировано       |
| `message_deleted` | `{ "message_id": 10 }`                                                                      | Сообщение было удалено               |
| `user_joined`     | `{ "user_id": 3, "first_name": "Иван" }`                                                    | Новый участник вошёл в чат           |
| `user_left`       | `{ "user_id": 3 }`                                                                          | Пользователь покинул чат             |
| `message_read`    | `{ "user_id": 3, "message_ids": [10, 11] }`                                                 | Пользователь прочитал сообщения   

## 6 Пример использования
```tsx
import { useState } from "react";
import { useChats, useTopics, useMessages, useWebSocket, useAuthMe } from "@/hooks/chats";

const ChatExample = () => {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    
    const { authMe } = useAuthMe();
    const { chats } = useChats();
    const { topics } = useTopics(selectedChatId);
    const { messages: history } = useMessages(selectedChatId, selectedTopicId);
    const { messages: realtime, sendMessage, isConnected } = useWebSocket(
        selectedChatId, 
        selectedTopicId,
        authMe?.id
    );

    // Все сообщения (история + новые)
    const allMessages = [...history, ...realtime];

    return (
        <div>
            <div>Статус: {isConnected ? "Connected" : "Disconnected"}</div>
            {/* Список сообщений */}
            {allMessages.map(msg => (
                <div key={msg.id}>{msg.author}: {msg.content}</div>
            ))}
            {/* Отправка сообщения */}
            <button onClick={() => sendMessage("Привет!")}>
                Отправить
            </button>
        </div>
    );
};
```