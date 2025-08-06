import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ButtonOutline, ButtonPrimary, Input } from "../components";
import { handleEmailLogin, handleGoogleLogin } from "../services/loginServices";
import type { UserType } from "../types";
import { LoadingPage } from "./LoadingPage";

export function LoginPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await handleEmailLogin({ email: user?.email || "", password: user?.password || "" }, navigate);
        } catch (err: any) {
            toast.error("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            {loading ? <LoadingPage /> : (
                <div className="w-full max-w-md bg-white p-8 rounded shadow">
                    <h2 className="text-xl font-bold mb-6">Acessar a Aplicação</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            label="E-mail"
                            value={user?.email || ""}
                            onChange={e => setUser(prevUser => ({ ...prevUser, email: e.target.value } as UserType))}
                            required
                        />
                        <Input
                            type="password"
                            label="Senha"
                            value={user?.password || ""}
                            onChange={e => setUser(prevUser => ({ ...prevUser, password: e.target.value } as UserType))}
                            required
                        />
                        <ButtonPrimary type="submit">Acessar com e-mail e senha</ButtonPrimary>
                    </form>
                    <hr className="my-4 text-gray-300" />
                    <ButtonOutline className="w-full" onClick={() => handleGoogleLogin(navigate)}>Acessar com Google</ButtonOutline>
                </div>
            )}
        </div>
    );
}
