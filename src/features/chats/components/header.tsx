import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { useNavigate } from "react-router"

import { paths } from "@/config/paths"

export const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="mb-1 text-2xl font-bold text-gray-900">
                    Чаты
                </h1>
                <p className="text-sm text-gray-500">
                    Общайтесь с участниками в реальном времени
                </p>
            </div>
            <Button className="gap-2" onClick={() => {navigate(paths.app.chats.create.getHref())}}>
                <Plus size={18} />
                Создать чат
            </Button>
        </div>
    )
}