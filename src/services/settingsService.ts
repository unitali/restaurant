import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { SettingsType } from "../types";

export async function fetchSettingsById(restaurantId: string): Promise<SettingsType | null> {
    const settingsRef = doc(db, "restaurants", restaurantId, "settings");
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
        return settingsSnap.data() as SettingsType;
    }
    return null;
}

export async function updateSettings(restaurantId: string, settings: SettingsType): Promise<void> {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    await updateDoc(restaurantRef, { settings });
}
