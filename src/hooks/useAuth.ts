import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    type User
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where, type DocumentSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";

async function findUserDoc(uid: string, email: string | null): Promise<DocumentSnapshot | null> {
    const normalizedEmail = (email || "").trim().toLowerCase();
    if (uid) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) return userSnap;
    }
    if (normalizedEmail) {
        const q = query(collection(db, "users"), where("emailLower", "==", normalizedEmail));
        const snap = await getDocs(q);
        if (!snap.empty) return snap.docs[0];
    }
    return null;
}

async function ensureRestaurantClaim(user: User): Promise<string | null> {
    try {
        const functions = getFunctions(undefined, "southamerica-east1");
        const refreshClaim = httpsCallable(functions, "refreshRestaurantClaim");
        await refreshClaim({});
        for (let i = 0; i < 5; i++) {
            await user.getIdToken(true);
            const tokenResult = await user.getIdTokenResult();
            if (tokenResult.claims.restaurantId) {
                localStorage.setItem("restaurantId", tokenResult.claims.restaurantId as string);
                return tokenResult.claims.restaurantId as string;
            }
            await new Promise(r => setTimeout(r, 800));
        }
    } catch (error) {
        console.error("Falha ao garantir a claim do restaurante:", error);
    }
    return null;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [userDoc, setUserDoc] = useState<DocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (userState) => {
            setLoading(true);
            if (userState) {
                const doc = await findUserDoc(userState.uid, userState.email);
                setUser(userState);
                setUserDoc(doc);
            } else {
                setUser(null);
                setUserDoc(null);
                localStorage.removeItem("restaurantId");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithEmail = useCallback(
        async (
            { email, password }: { email: string; password: string },
            onSuccess?: () => void
        ): Promise<DocumentSnapshot | null> => {
            setLoading(true);
            setError(null);
            const auth = getAuth();
            try {
                const res = await signInWithEmailAndPassword(auth, email, password);
                const doc = await findUserDoc(res.user.uid, res.user.email);
                if (!doc) {
                    await signOut(auth);
                    throw new Error("Acesso negado. Contate o administrador.");
                }
                await ensureRestaurantClaim(res.user);
                toast.success("Login realizado com sucesso!");
                if (onSuccess) onSuccess();
                return doc;
            } catch (err) {
                const error = err instanceof Error ? err : new Error("E-mail ou senha inválidos.");
                setError(error);
                toast.error(error.message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const loginWithGoogle = useCallback(
        async (onSuccess?: () => void): Promise<DocumentSnapshot | null> => {
            setLoading(true);
            setError(null);
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            try {
                const res = await signInWithPopup(auth, provider);
                const doc = await findUserDoc(res.user.uid, res.user.email);
                if (!doc) {
                    if (res.user.metadata.creationTime === res.user.metadata.lastSignInTime) {
                        try { await res.user.delete(); } catch { }
                    }
                    await signOut(auth);
                    throw new Error("Sua conta Google não está autorizada.");
                }
                await ensureRestaurantClaim(res.user);
                toast.success("Login com Google realizado com sucesso!");
                if (onSuccess) onSuccess();
                return doc;
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Erro ao fazer login com Google.");
                setError(error);
                toast.error(error.message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const logout = useCallback(async () => {
        setLoading(true);
        const auth = getAuth();
        try {
            await signOut(auth);
            toast.success("Logout efetuado com sucesso.");
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Erro ao fazer logout.");
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);


    return { user, userDoc, loading, error, loginWithEmail, loginWithGoogle, logout };
}