import { createUserWithEmailAndPassword, deleteUser, fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { webRoutes } from "../routes";
import type { CompanyType, RestaurantType, UserType } from "../types";
import { plusDays, today } from "../utils/date";


export function useRestaurants() {
    const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
    const [currentRestaurant, setCurrentRestaurant] = useState<RestaurantType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchAllRestaurants = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const snapshot = await getDocs(collection(db, "restaurants"));
            const fetchedRestaurants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as RestaurantType));
            setRestaurants(fetchedRestaurants);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            toast.error("Não foi possível carregar os restaurantes.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRestaurantById = useCallback(async (restaurantId: string) => {
        if (!restaurantId) return null;
        setLoading(true);
        setError(null);
        try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            const docSnap = await getDoc(restaurantRef);

            if (docSnap.exists()) {
                const restaurantData = { id: docSnap.id, ...docSnap.data() } as RestaurantType;
                setCurrentRestaurant(restaurantData);
                return restaurantData;
            } else {
                throw new Error("Restaurante não encontrado");
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            toast.error("Não foi possível carregar os dados do restaurante.");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createRestaurant = useCallback(async (props: CompanyType) => {
        setLoading(true);
        setError(null);
        try {
            const data: Omit<RestaurantType, 'id'> = {
                company: {
                    ...props,
                    createdAt: props.createdAt || today(),
                    status: props.status || "active",
                },
                categories: [],
                settings: {
                    primaryColor: "#2563eb",
                    primaryTextColor: "#ffffff",
                    secondaryColor: "#fbbf24",
                    secondaryTextColor: "#000000",
                },
                orders: [],
                products: [],
            };

            const docRef = await addDoc(collection(db, "restaurants"), data);
            toast.success("Restaurante criado com sucesso!");
            return docRef.id;

        } catch (err) {
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            toast.error("Não foi possível criar o restaurante.");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createRestaurantWithAdmin = useCallback(
        async (
            restaurant: CompanyType,
            userAdmin: UserType,
            onSuccess?: () => void,
            onError?: (err: any) => void
        ) => {
            setLoading(true);
            const navigate = useNavigate();
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
                const auth = getAuth();
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
                const restaurantId = await createRestaurant(restaurantData);
                if (!restaurantId) throw new Error("Erro ao criar restaurante.");
                await setDoc(doc(db, "users", createdUser.uid), {
                    email: userAdmin.email,
                    profile: userAdmin.profile,
                    restaurantId,
                });
                toast.success("Restaurante e usuário criados com sucesso!");
                navigate(webRoutes.admin, { replace: true });

                if (onSuccess) onSuccess();
            } catch (err: any) {
                const error = err instanceof Error ? err : new Error("Erro ao fazer logout.");
                setError(error);
                if (createdUser) {
                    try {
                        await deleteUser(createdUser);
                    } catch (deleteErr) {
                        const error = err instanceof Error ? err : new Error("Erro ao remover usuário do Auth:");
                        setError(error);
                        console.error(error.message, deleteErr);
                    }
                }
                if (err.code === "auth/email-already-in-use") {
                    const error = err instanceof Error ? err : new Error("E-mail já cadastrado");
                    setError(error);
                } else {
                    const error = err instanceof Error ? err : new Error("Erro ao criar restaurante ou admin. Tente Novamente.");
                    setError(error);
                }
                if (onError) onError(err);

            } finally {
                setLoading(false);
                toast.error(error ? error.message : "Erro ao criar restaurante ou admin. Tente Novamente.");
            }
        },
        [createRestaurant]
    );

    const updateRestaurantCompany = useCallback(async (restaurantId: string, data: Partial<CompanyType>) => {
        setLoading(true);
        setError(null);
        try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            const updatePayload: { [key: string]: any } = {};
            for (const [key, value] of Object.entries(data)) {
                updatePayload[`company.${key}`] = value;
            }
            await updateDoc(restaurantRef, updatePayload);
            setCurrentRestaurant(prev => prev
                ? { ...prev, company: { ...prev.company, ...data } }
                : null
            );
            if (data.isOpen !== undefined) {
                toast.success(`Restaurante ${data.isOpen ? 'aberto' : 'fechado'} com sucesso!`);
            } else {
                toast.success("Dados atualizados com sucesso!");
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            toast.error("Não foi possível atualizar os dados.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        restaurants,
        currentRestaurant,
        loading,
        error,
        fetchAllRestaurants,
        fetchRestaurantById,
        createRestaurant,
        createRestaurantWithAdmin,
        updateRestaurantCompany,
    };
}