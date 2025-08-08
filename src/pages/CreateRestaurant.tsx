import { createUserWithEmailAndPassword, deleteUser, fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, ButtonPrimary } from "../components";
import { db } from "../config/firebase";
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
    createdAt: today(),
    expiredAt: plusDays(today(), 30),
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
        let createdUser = null;
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

            const result = await createUserWithEmailAndPassword(auth, userAdmin.email, userAdmin.password!);
            createdUser = result.user;


            // Agora o usuário está autenticado!
            const restaurantId = await createRestaurant(restaurantData);

            await setDoc(doc(db, "users", createdUser.uid), {
                email: userAdmin.email,
                profile: userAdmin.profile,
                restaurantId,
            });

            toast.success("Restaurante e admin criados com sucesso!");
            setRestaurant(restaurantInitialState);
            setUserAdmin(userInitialState);
            navigate(webRoutes.admin, { replace: true });
        } catch (err: any) {
            if (createdUser) {
                try {
                    await deleteUser(createdUser);
                } catch (deleteErr) {
                    console.error("Erro ao remover usuário do Auth:", deleteErr);
                }
            }
            if (err.code === "auth/email-already-in-use") {
                toast.error("E-mail já cadastrado");
            } else {
                console.error("Erro ao criar restaurante ou admin:", err);
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
                            id="restaurantName"
                            label="Nome do restaurante"
                            value={restaurant.name}
                            onChange={e => setRestaurant({ ...restaurant, name: e.target.value })}
                            required
                        />
                        <Input
                            id="restaurantAddress"
                            label="Endereço"
                            value={restaurant.address}
                            onChange={e => setRestaurant({ ...restaurant, address: e.target.value })}
                            required
                        />
                        <Input
                            id="restaurantPhone"
                            type="tel"
                            label="Telefone"
                            value={restaurant.phone}
                            onChange={e => setRestaurant({ ...restaurant, phone: e.target.value })}
                            required
                        />
                        <Input
                            id="adminEmail"
                            type="email"
                            label="E-mail do admin"
                            value={userAdmin.email}
                            onChange={e => setUserAdmin({ ...userAdmin, email: e.target.value })}
                            required
                        />
                        <Input
                            id="adminPassword"
                            type="password"
                            label="Senha do admin"
                            value={userAdmin.password}
                            onChange={e => setUserAdmin({ ...userAdmin, password: e.target.value })}
                            required
                        />
                        <Input
                            id="adminConfirmPassword"
                            type="password"
                            label="Confirmar Senha do admin"
                            value={userAdmin.confirmPassword}
                            onChange={e => setUserAdmin({ ...userAdmin, confirmPassword: e.target.value })}
                            required
                        />
                        <ButtonPrimary
                            id="createRestaurantButton"
                            className="w-full"
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