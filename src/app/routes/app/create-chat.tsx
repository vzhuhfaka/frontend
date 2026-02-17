import { ContentLayout } from "@/components/layouts"

import { CreateChatForm } from "@/features/chats/components/create-chat-form"

import { useNavigate } from "react-router"

import { paths } from "@/config/paths"

const createChat = () => {
    const navigate = useNavigate()

    return (
        <ContentLayout title="Create chat">
            <CreateChatForm
                onSuccess={() => {navigate(paths.app.chats.main.getHref())}}
                onCancel={() => {navigate(paths.app.chats.main.getHref())}}
            />
        </ContentLayout>
    )
}

export default createChat