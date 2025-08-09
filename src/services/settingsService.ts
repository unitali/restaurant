import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { SettingsType } from "../types";

export async function fetchSettingsById(restaurantId: string): Promise<SettingsType | null> {
    const settingsRef = doc(db, restaurantId, "settings");
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
        return settingsSnap.data() as SettingsType;
    }
    return null;
}

export async function updateSettings(restaurantId: string, settings: SettingsType): Promise<void> {
    const settingsRef = doc(db, restaurantId, "settings");
    await setDoc(settingsRef, settings, { merge: true });
}
