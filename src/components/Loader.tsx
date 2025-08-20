import * as React from "react"
import { View, Text } from "react-native"
import { ActivityIndicator } from "react-native"

export default ({ isVisible, message, showMessage }: {
    isVisible: boolean
    message?: string
    showMessage?: boolean
    subWidth?: number | string
    backLayer?: string
}) => {
    if (isVisible) {
        return <View
            className={`flex-1 w-full h-full justify-center items-center absolute z-50 bg-transparent`}
        >
            <View className={`px-2 py-5 bg-[#121212] flex-col min-w-[180px] justify-center items-center rounded-lg`}>
                <ActivityIndicator size="large" color="white" />
                {showMessage && <Text className="text-white font-md my-4" >{message ? message : "Loading..."}</Text>}
            </View>
        </View>
    } else {
        return <View></View>
    }
}