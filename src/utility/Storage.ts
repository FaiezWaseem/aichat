import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
    static DEFAULT = 0;
    static JSON = 1;
    static save(key :string, value : any, type=Storage.DEFAULT){
        if(type == Storage.JSON){
            AsyncStorage.setItem(key, JSON.stringify(value));
        }
        else {
            AsyncStorage.setItem(key, value);
        }
    }

    static async get(key : string, type=Storage.DEFAULT){
        try {
            let data = await AsyncStorage.getItem(key) || undefined;
            if (data != undefined) {
                if(type == Storage.JSON){
                    return JSON.parse(data);
                }
                return data;
            }
            else{
                return undefined;
            }
        }
        catch (err){
            return undefined;
        }
    }

    static async clear(){
        await AsyncStorage.clear();
    }

    static async saveChatMessages(messages: any[]) {
        try {
            // Keep only the last 20 messages
            const limitedMessages = messages.slice(-20);
            await AsyncStorage.setItem('@chat_messages', JSON.stringify(limitedMessages));
        } catch (e) {
            console.error('Failed to save chat messages:', e);
        }
    }

    static async getChatMessages() {
        try {
            const saved = await AsyncStorage.getItem('@chat_messages');
            if (saved) {
                return JSON.parse(saved);
            }
            return [];
        } catch (e) {
            console.error('Failed to load chat messages:', e);
            return [];
        }
    }

    static async clearChatMessages() {
        try {
            await AsyncStorage.removeItem('@chat_messages');
        } catch (e) {
            console.error('Failed to clear chat messages:', e);
        }
    }
}

export default Storage;