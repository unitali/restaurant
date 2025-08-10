import { fetchSignInMethodsForEmail, getAuth, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { webRoutes } from '../routes';

async function getUserDocByEmail(email: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0];
    }
    return null;
}

async function handleRedirectByEmail(email: string, navigate: any) {
    const userDoc = await getUserDocByEmail(email);
    if (userDoc) {
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
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
            toast.error("E-mail não autorizado. Entre em contato com o administrador.");
            return;
        }
        await signInWithEmailAndPassword(auth, email, password);
        await handleRedirectByEmail(email, navigate);
    } catch (error) {
        toast.error("E-mail ou senha inválidos.");
    }
}

export async function handleGoogleLogin(navigate: any) {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const email = result.user.email;
        if (!email) {
            await signOut(auth);
            toast.error("E-mail do usuário não encontrado/autorizado. Entre em contato com o administrador.");
            return;
        }
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
            try {
                await result.user.delete();
            } catch (e) {}
            await signOut(auth);
            toast.error("E-mail não autorizado. Entre em contato com o administrador.");
            return;
        }
        const userDoc = await getUserDocByEmail(email);
        if (!userDoc) {
            // Não deleta o usuário, apenas faz logout e mostra erro
            await signOut(auth);
            toast.error("Usuário não encontrado no sistema. Entre em contato com o administrador.");
            return;
        }
        await handleRedirectByEmail(email, navigate);
    } catch (error) {
        toast.error("Erro ao acessar com Google.");
    }
}

export async function handleGoogleRedirect(navigate: any) {
    const auth = getAuth();
    const result = await getRedirectResult(auth);
    if (result && result.user && result.user.email) {
        const email = result.user.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
            // Só deleta se o usuário foi recém-criado (não deveria acontecer aqui)
            if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
                try {
                    await result.user.delete();
                } catch (e) {}
            }
            await signOut(auth);
            toast.error("E-mail não autorizado. Entre em contato com o administrador.");
            return;
        }
        const userDoc = await getUserDocByEmail(email);
        if (!userDoc) {
            // Não deleta o usuário, apenas faz logout e mostra erro
            await signOut(auth);
            toast.error("Usuário não encontrado no sistema. Entre em contato com o administrador.");
            return;
        }
        await handleRedirectByEmail(email, navigate);
    }
}