import type { User } from "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  linkWithCredential,
  OAuthCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { webRoutes } from "../routes";

let pendingGoogleCredential: OAuthCredential | null = null;

function normalizeEmail(email: string | null | undefined) {
  return (email || "").trim().toLowerCase();
}

async function findUserDoc(uid: string, rawEmail: string | null | undefined) {
  const emailNorm = normalizeEmail(rawEmail);

  if (uid) {
    const byUidRef = doc(db, "users", uid);
    const byUidSnap = await getDoc(byUidRef);
    if (byUidSnap.exists()) {
      const data = byUidSnap.data();
      if (emailNorm && !data.emailLower) {
        try { await updateDoc(byUidRef, { emailLower: emailNorm }); } catch {}
      }
      return byUidSnap;
    }
  }

  if (emailNorm) {
    const qLower = query(collection(db, "users"), where("emailLower", "==", emailNorm));
    const snapLower = await getDocs(qLower);
    if (!snapLower.empty) {
      const docSnap = snapLower.docs[0];
      if (!docSnap.data().emailLower) {
        try { await updateDoc(docSnap.ref, { emailLower: emailNorm }); } catch {}
      }
      return docSnap;
    }
  }

  if (rawEmail) {
    const qEmail = query(collection(db, "users"), where("email", "==", rawEmail));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) {
      const docSnap = snapEmail.docs[0];
      const data = docSnap.data();
      if (emailNorm && !data.emailLower) {
        try { await updateDoc(docSnap.ref, { emailLower: emailNorm }); } catch {}
      }
      return docSnap;
    }
  }

  return null;
}

async function ensureRestaurantClaim(user: User) {
  try {
    const fns = getFunctions(undefined, "southamerica-east1");
    const refresh = httpsCallable(fns, "refreshRestaurantClaim");
    await refresh({});
  } catch {}
  for (let i = 0; i < 5; i++) {
    await user.getIdToken(true);
    const t = await user.getIdTokenResult();
    if (t.claims.restaurantId) return t.claims.restaurantId as string;
    await new Promise(r => setTimeout(r, 800));
  }
  return null;
}

function redirect(userDoc: any, navigate: any) {
  const data = userDoc.data() as { profile?: string; restaurantId?: string };
  if (data.restaurantId) localStorage.setItem("restaurantId", data.restaurantId);
  const dest = data.profile === "admin" ? webRoutes.admin : webRoutes.client;
  navigate(dest, { replace: true });
  toast.success("Login realizado com sucesso!");
}

function isNew(user: User) {
  return user.metadata.creationTime === user.metadata.lastSignInTime;
}

async function tryLinkPendingGoogle(user: User) {
  if (!pendingGoogleCredential) return;
  try {
    await linkWithCredential(user, pendingGoogleCredential);
    pendingGoogleCredential = null;
  } catch {
    toast.error("Falha ao vincular Google.");
  }
}

export async function handleEmailLogin(
  { email, password }: { email: string; password: string },
  navigate: any
) {
  const auth = getAuth();
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await findUserDoc(res.user.uid, res.user.email);
    if (!userDoc) {
      await signOut(auth);
      toast.error("Acesso negado. Contate o administrador.");
      return;
    }
    await tryLinkPendingGoogle(res.user);
    redirect(userDoc, navigate);
    ensureRestaurantClaim(res.user); // assíncrono
  } catch {
    toast.error("E-mail ou senha inválidos.");
  }
}

export async function handleGoogleLogin(navigate: any) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, provider);
    const userDoc = await findUserDoc(res.user.uid, res.user.email);
    if (!userDoc) {
      if (isNew(res.user)) { try { await res.user.delete(); } catch {} }
      await signOut(auth);
      toast.error("Erro ao fazer login com Google.");
      return;
    }
    redirect(userDoc, navigate);
    ensureRestaurantClaim(res.user);
  } catch {
    toast.error("Erro ao fazer login com Google.");
  }
}

export async function handleLogout(navigate: any) {
  const auth = getAuth();
  await signOut(auth);
  localStorage.removeItem("restaurantId");
  navigate(webRoutes.login, { replace: true });
  toast.success("Logout efetuado com sucesso.");
}