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

    // Session Management Methods
    static async createSession(sessionName: string) {
        try {
            const sessionId = Date.now().toString();
            const session = {
                id: sessionId,
                name: sessionName,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                messages: []
            };
            
            const sessions = await this.getAllSessions();
            sessions.push(session);
            await AsyncStorage.setItem('@chat_sessions', JSON.stringify(sessions));
            
            return session;
        } catch (e) {
            console.error('Failed to create session:', e);
            return null;
        }
    }

    static async getAllSessions() {
        try {
            const saved = await AsyncStorage.getItem('@chat_sessions');
            if (saved) {
                return JSON.parse(saved);
            }
            return [];
        } catch (e) {
            console.error('Failed to load sessions:', e);
            return [];
        }
    }

    static async getSession(sessionId: string) {
        try {
            const sessions = await this.getAllSessions();
            return sessions.find((session: any) => session.id === sessionId) || null;
        } catch (e) {
            console.error('Failed to get session:', e);
            return null;
        }
    }

    static async saveSessionMessages(sessionId: string, messages: any[]) {
        try {
            const sessions = await this.getAllSessions();
            const sessionIndex = sessions.findIndex((session: any) => session.id === sessionId);
            
            if (sessionIndex !== -1) {
                sessions[sessionIndex].messages = messages.slice(-50); // Keep last 50 messages
                sessions[sessionIndex].lastUpdated = new Date().toISOString();
                await AsyncStorage.setItem('@chat_sessions', JSON.stringify(sessions));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Failed to save session messages:', e);
            return false;
        }
    }

    static async deleteSession(sessionId: string) {
        try {
            const sessions = await this.getAllSessions();
            const filteredSessions = sessions.filter((session: any) => session.id !== sessionId);
            await AsyncStorage.setItem('@chat_sessions', JSON.stringify(filteredSessions));
            return true;
        } catch (e) {
            console.error('Failed to delete session:', e);
            return false;
        }
    }

    static async renameSession(sessionId: string, newName: string) {
        try {
            const sessions = await this.getAllSessions();
            const sessionIndex = sessions.findIndex((session: any) => session.id === sessionId);
            
            if (sessionIndex !== -1) {
                sessions[sessionIndex].name = newName;
                sessions[sessionIndex].lastUpdated = new Date().toISOString();
                await AsyncStorage.setItem('@chat_sessions', JSON.stringify(sessions));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Failed to rename session:', e);
            return false;
        }
    }

    static async getCurrentSessionId() {
        try {
            return await AsyncStorage.getItem('@current_session_id');
        } catch (e) {
            console.error('Failed to get current session ID:', e);
            return null;
        }
    }

    static async setCurrentSessionId(sessionId: string) {
        try {
            await AsyncStorage.setItem('@current_session_id', sessionId);
            return true;
        } catch (e) {
            console.error('Failed to set current session ID:', e);
            return false;
        }
    }
}

export default Storage;