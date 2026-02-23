import { ContentLayout } from "@/components/layouts"

import { CreateTopicForm } from "@/features/chats/components/create-topic-form"

import { useNavigate, useParams } from "react-router"

import { paths } from "@/config/paths"

const createTopic = () => {
    const navigate = useNavigate()
    const { chatId } = useParams<{ chatId: string }>();

    if (!chatId) {
        return (
            <ContentLayout title="Create topic">
                <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                    <p className="text-red-500 text-lg">Chat ID is missing</p>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout title="Create topic">
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <CreateTopicForm
                    onSuccess={() => {navigate(paths.app.chats.main.getHref())}}
                    onCancel={() => {navigate(paths.app.chats.main.getHref())}}
                    chatId={chatId}
                />
            </div>
        </ContentLayout>
    )
}

export default createTopic