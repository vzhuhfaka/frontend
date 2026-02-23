import { Hash } from "lucide-react";


type TopicThemeProps = {
    name: string;
    isActive?: boolean;
    color?: string;
};

export const TopicTheme = ({ 
    name, 
    isActive = false,
    color = "bg-indigo-500"
}: TopicThemeProps) => {
    return (
        <div className={`
            flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all
            ${isActive 
                ? 'border-blue-200 bg-blue-50 shadow-sm' 
                : 'border-gray-100 bg-white hover:shadow-md hover:border-gray-200'
            }
        `}>
            <div className={`${color} rounded-lg p-2 text-white shadow-sm`}>
                <Hash size={16} />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                        {name}
                    </span>
                    {isActive && (
                        <span className="flex h-2 w-2">
                            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};