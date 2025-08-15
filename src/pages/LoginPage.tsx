import { useState } from "react";
import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary, Input } from "../components";
import { HeaderPublic } from "../components/PublicHeader";
import { useAuth } from "../hooks/useAuth";
import type { UserType } from "../types";
import { LoadingPage } from "./LoadingPage";

export function LoginPage() {
    const { loginWithEmail, loginWithGoogle } = useAuth();

    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await loginWithEmail({ email: user?.email || "", password: user?.password || "" });
        } catch (err: any) {
            toast.error("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <HeaderPublic />
            <main className="flex justify-center items-center min-h-screen">
                {loading ? <LoadingPage /> : (
                    <div className="w-full max-w-md bg-white p-8 rounded shadow">
                        <h2 className="text-xl font-bold mb-6">Acessar a Aplicação</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input
                                id="email"
                                type="email"
                                label="E-mail"
                                value={user?.email || ""}
                                onChange={e => setUser(prevUser => ({ ...prevUser, email: e.target.value } as UserType))}
                                required
                            />
                            <Input
                                id="password"
                                type="password"
                                label="Senha"
                                value={user?.password || ""}
                                onChange={e => setUser(prevUser => ({ ...prevUser, password: e.target.value } as UserType))}
                                required
                            />
                            <ButtonPrimary
                                id="submit"
                                type="submit"
                                children="Acessar com e-mail e senha"
                            />
                        </form>
                        <hr className="my-4 text-gray-300" />
                        <ButtonOutline
                            id="google-login"
                            className="w-full" onClick={() => loginWithGoogle()}
                            children="Acessar com Google"
                        />
                    </div>
                )}
            </main>
        </>
    );
}
