import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, ButtonPrimary } from "../components";
import { db } from "../firebase";
import { createRestaurant } from "../services/restaurantsService";
import { webRoutes } from "../routes";
import type { RestaurantType, UserType } from "../types";
import { plusDays, today } from "../utils/date";
import { LoadingPage } from "./LoadingPage";

const restaurantInitialState: RestaurantType = {
    id: "",
    name: "",
    address: "",
    phone: "",
    createdAt: new Date(),
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active",
};

const userInitialState: UserType = {
    id: "",
    email: "",
    profile: "admin",
    restaurantId: "",
    password: "",
    confirmPassword: "",
    createdAt: new Date(),
};


export function CreateRestaurant() {
    const [restaurant, setRestaurant] = useState<RestaurantType>(restaurantInitialState);
    const [userAdmin, setUserAdmin] = useState<UserType>(userInitialState);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {

            if (userAdmin.password !== userAdmin.confirmPassword) {
                toast.error("As senhas não coincidem");
                return;
            }

            if (!restaurant.name || !restaurant.address || !restaurant.phone) {
                toast.error("Preencha todos os campos do restaurante");
                return;
            }
            if (!userAdmin.email || !userAdmin.password) {
                toast.error("Preencha todos os campos do admin");
                return;
            }

            if (userAdmin.password.length < 6) {
                toast.error("A senha deve ter pelo menos 6 caracteres");
                return;
            }

            const userExists = await fetchSignInMethodsForEmail(auth, userAdmin.email);
            if (userExists.length > 0) {
                toast.error("E-mail já cadastrado");
                return;
            }

            const restaurantData = {
                ...restaurant,
                createdAt: today(),
                expiredAt: plusDays(today(), 15),
            };

            const restaurantId = await createRestaurant(restaurantData);

            const result = await createUserWithEmailAndPassword(auth, userAdmin.email, userAdmin.password!);
            await setDoc(doc(db, "users", result.user.uid), {
                email: userAdmin.email,
                profile: userAdmin.profile,
                restaurantId,
            });

            toast.success("Restaurante e admin criados com sucesso!");
            setRestaurant(restaurantInitialState);
            setUserAdmin(userInitialState);
            navigate(webRoutes.admin, { replace: true });
        } catch (err: any) {
            if (err.code === "auth/email-already-in-use") {
                toast.error("E-mail já cadastrado");
            } else {
                toast.error("Erro ao criar restaurante ou admin");
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen">
            {loading ? <LoadingPage /> : (
                <div className="w-full max-w-md bg-white p-8 rounded shadow">
                    <h2 className="text-xl font-bold mb-6">Criar Restaurante e Admin</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            label="Nome do restaurante"
                            value={restaurant.name}
                            onChange={e => setRestaurant({ ...restaurant, name: e.target.value })}
                            required
                        />
                        <Input
                            type="text"
                            label="Endereço"
                            value={restaurant.address}
                            onChange={e => setRestaurant({ ...restaurant, address: e.target.value })}
                            required
                        />
                        <Input
                            type="text"
                            label="Telefone"
                            value={restaurant.phone}
                            onChange={e => setRestaurant({ ...restaurant, phone: e.target.value })}
                            required
                        />
                        <Input
                            type="email"
                            label="E-mail do admin"
                            value={userAdmin.email}
                            onChange={e => setUserAdmin({ ...userAdmin, email: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            label="Senha do admin"
                            value={userAdmin.password}
                            onChange={e => setUserAdmin({ ...userAdmin, password: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            label="Confirmar Senha do admin"
                            value={userAdmin.confirmPassword}
                            onChange={e => setUserAdmin({ ...userAdmin, confirmPassword: e.target.value })}
                            required
                        />
                        <ButtonPrimary className="w-full"
                            type="submit"
                            children={
                                <>Iniciar Período de Teste</>
                            }
                        />
                    </form>
                </div>
            )
            }
        </div>
    );
}