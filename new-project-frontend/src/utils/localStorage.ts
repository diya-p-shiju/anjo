enum LOCALSTORAGE {

    LANGUAGE = "LANGUAGE",
    USER = "USER",
    ACL = "ACL",
    THEME = "THEME",
    ACCESS_TOKEN = "ACCESS_TOKEN",
    REFRESH_TOKEN = "REFRESH_TOKEN",
    REFRESH_TOKEN_TIME = "REFRESH_TOKEN_TIME",

    //Legacy
    LEGACY_ACCESS_TOKEN = "LEGACY_ACCESS_TOKEN",

}



export default class Storage {
    static setItem<T>(key: LOCALSTORAGE, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error saving item to localStorage with key "${key}":`, error);
        }
    }

    static getItem<T>(key: LOCALSTORAGE): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        } catch (error) {
            console.error(`Error retrieving item from localStorage with key "${key}":`, error);
            return null;
        }
    }

    static removeItem(key: LOCALSTORAGE): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from localStorage with key "${key}":`, error);
        }
    }

    static clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
}

