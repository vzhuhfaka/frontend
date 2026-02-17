import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input/input";

import { useCreateChat } from "@/hooks/chats/useCreateChat";

// Схема валидации
const createChatSchema = z.object({
    chatName: z.string().min(1, "Название чата обязательно").max(50, "Название не должно превышать 50 символов"),
});

type CreateChatInput = z.infer<typeof createChatSchema>;

type CreateChatFormProps = {
    onSuccess?: () => void;
    onCancel?: () => void;
};

export const CreateChatForm = ({ onSuccess, onCancel }: CreateChatFormProps) => {
    const { createChat, error, loading } = useCreateChat();
    
    const form = useForm<CreateChatInput>({
        resolver: zodResolver(createChatSchema),
        defaultValues: {
            chatName: "",
        },
    });

    const onSubmit = async (values: CreateChatInput) => {
        try {
            console.log("Создание чата:", values);
            
            // Вызываем создание чата
            await createChat({ name: values.chatName });
            
            // Очищаем форму и вызываем onSuccess
            form.reset();
            onSuccess?.();
        } catch (e) {
            // Ошибка уже обработана в хуке
            console.error("Error in form submission:", e);
        }
    };

    return (
        <div className="bg-white w-full max-w-[560px] px-12 py-8 rounded-2xl">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Создание чата</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="chatName"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Введите название чата"
                                        {...field}
                                        error={!!fieldState.error}
                                        className="h-12 border-gray-300"
                                    />
                                </FormControl>
                                <FormMessage className="text-[#FB2C36]" />
                            </FormItem>
                        )}
                    />

                    {/* Отображаем ошибку, если есть */}
                    {error && (
                        <div className="text-[#FB2C36] text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#030213] text-white text-lg font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Создание..." : "Создать чат"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-gray-200 text-lg font-semibold"
                        onClick={() => onCancel?.()}
                        disabled={loading}
                    >
                        Отмена
                    </Button>
                </form>
            </Form>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-left">
                <button className="text-blue-600 text-sm flex items-center gap-2">
                    <span className="rounded-full border border-blue-600 w-4 h-4 flex items-center justify-center text-[10px]">
                        ?
                    </span>
                    О чатах
                </button>
            </div>
        </div>
    );
};