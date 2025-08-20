import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

interface InputFeildProps {
    label?: string;
    labelStyle?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    icon?: any;
    iconPosition?: 'left' | 'right';
    className?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    error?: string;
}


export default function InputFeild({ label, labelStyle, icon, secureTextEntry = false,
    placeholder,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    error,
    ...props

}: InputFeildProps) {

    return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View className="my-2 w-full">
                <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`} >{label}   {error && <Text className="text-sm text-danger-600" >({error})</Text>}</Text>
                
                <View className={`flex flex-row justify-start items-center relative bg-neutral-100 dark:bg-slate-500 rounded-full border ${error ? "border-red-600" : "border-neutral-100"} focus:border-primary-500 ${containerStyle}`} >
                    {icon && <Image source={icon} className={`w-6 h-6  ml-4 ${iconStyle}`} />}
                    <TextInput
                        className={`rounded-full p-4 font-JakartaSemiBold text-black  text-[15px] flex-1 ${inputStyle}`}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry}
                        {...props}
                    />
                </View>
              
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
}