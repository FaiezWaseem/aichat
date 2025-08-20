import { ActivityIndicator, Text, TouchableOpacity } from "react-native"


interface ButtonProps {
    title: string;
    onPress: () => void;
    bgVariant?: "primary" | "secondary" | "tertiary" | "danger" | "success" | "warning" | "info" | "light" | "dark" | "outline" | "link";
    textVariant?: "primary" | "secondary" | "danger" | "success" | "warning" | "default";
    IconLeft?: any;
    IconRight?: any;
    className?: string;
    txtClassName?: string;
    isLoading ?: boolean;
}

function getTextVariantStyle(variant: string) {
    switch (variant) {
        case "primary":
            return "text-black";
        case "secondary":
            return "text-gray-100";
        case "danger":
            return "text-red-100";
        case "success":
            return "text-green-100";
        case "warning":
            return "text-yellow-100";
        default:
            return "text-white";
    }
}
function getBgVariantStyle(variant: string) {
    switch (variant) {
        case "primary":
            return "bg-[#0286FF]";
        case "secondary":
            return "bg-gray-500";
        case "tertiary":
            return "bg-[#000000]";
        case "danger":
            return "bg-red-500";
        case "success":
            return "bg-green-500";
        case "warning":
            return "bg-yellow-500";
        case "info":
            return "bg-[#00FFFF]";
        case "light":
            return "bg-[#FFFFFF]";
        case "dark":
            return "bg-[#000000]";
        case "outline":
            return "bg-transparent border-neutral-300 border-[0.5px]";
        default:
            return "bg-[#0286FF]";
    }
}
export default function Button({
    title,
    onPress,
    bgVariant = "primary",
    textVariant = "default",
    IconLeft,
    IconRight,
    className,
    txtClassName,
    isLoading = false,
    ...props
}: ButtonProps) {
    return (
        <TouchableOpacity
            className={`w-full rounded-full flex flex-row items-center py-3 justify-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${className}`}
            onPress={onPress}
            disabled={isLoading}
            {...props}
        >
            {IconLeft && <IconLeft />}
            {!isLoading && <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)} ${txtClassName}`}>{title}</Text>}
            {isLoading && <ActivityIndicator />}
            {IconRight && <IconRight />}
        </TouchableOpacity>
    )
}