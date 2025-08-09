import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { webRoutes } from '../routes';

async function handleRedirect(userId: string, navigate: any) {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
        const { profile, restaurantId } = userDoc.data() as { profile: string; restaurantId: string };
        localStorage.setItem("restaurantId", restaurantId);
        if (profile === "admin") {
            navigate(webRoutes.admin, { replace: true });
        } else {
            navigate(webRoutes.client, { replace: true });
        }
        toast.success("Login realizado com sucesso!");
    } else {
        toast.error("Usuário não encontrado.");
    }
}

export async function handleLogout(navigate: any) {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("restaurantId");
    navigate(webRoutes.login, { replace: true });
}

export async function handleEmailLogin({ email, password }: { email: string; password: string }, navigate: any) {
    const auth = getAuth();
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleRedirect(result.user.uid, navigate);
    } catch (error) {
        toast.error("E-mail ou senha inválidos.");
    }
}

export async function handleGoogleLogin(navigate: any) {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        await handleRedirect(result.user.uid, navigate);
    } catch (error) {
        toast.error("Erro ao acessar com Google.");
    }
}