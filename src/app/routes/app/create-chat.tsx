import { ContentLayout } from "@/components/layouts"

import { CreateChatForm } from "@/features/chats/components/create-chat-form"

import { useNavigate } from "react-router"

import { paths } from "@/config/paths"

const createChat = () => {
    const navigate = useNavigate()

    return (
        <ContentLayout title="Create chat">
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <CreateChatForm
                    onSuccess={() => {navigate(paths.app.chats.main.getHref())}}
                    onCancel={() => {navigate(paths.app.chats.main.getHref())}}
                />
            </div>
        </ContentLayout>
    )
}

export default createChat