import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonOutline, ButtonPrimary, Input } from "../components";
import { HeaderPublic } from "../components/HeaderPublic";
import { useAuth } from "../hooks/useAuth";
import { webRoutes } from "../routes";
import type { UserType } from "../types";
import { LoadingPage } from "./LoadingPage";

export function LoginPage() {
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        await loginWithEmail({ email, password });
        navigate(webRoutes.admin);
        setIsLoading(false);
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await loginWithGoogle();
        navigate(webRoutes.admin);
        setIsLoading(false);
    };

    return (
        <>
            <HeaderPublic />
            <main className="flex justify-center items-center min-h-screen">
                {isLoading ? <LoadingPage /> : (
                    <div className="w-full max-w-md bg-white p-8 rounded shadow">
                        <h2 className="text-xl font-bold mb-6">Acessar a Aplicação</h2>
                        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleLogin(user?.email || "", user?.password || ""); }}>
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
                        <hr className="my-4 text-unitali-blue-300" />
                        <ButtonOutline
                            id="google-login"
                            className="w-full" onClick={handleGoogleLogin}
                            children="Acessar com Google"
                        />
                    </div>
                )}
            </main>
        </>
    );
}
