
export const paths = {
    home: {
        path: "/",
        getHref: () => "/",
    },

    auth: {
        register: {
            path: "/auth/register",
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        },
        login: {
            path: "/auth/login",
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        },
        reset: {
            path: "/auth/reset",
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/reset${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        },
    },

    app: {
        root: {
            path: "/app",
            getHref: () => "/app",
        },
        spaces: {
            path: "",
            getHref: () => "/app",
        },
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
                getHref: (chatId: number, topicId: number) => `ws://localhost:8000/v1/ws/chats/${chatId}/topics/${topicId}/messages`
            }
        }
    },
} as const;
