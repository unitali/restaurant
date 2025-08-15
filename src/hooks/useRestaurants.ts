import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import type { CompanyType, RestaurantType } from "../types";
import { today } from "../utils/date";
import { getShortUrl } from "../utils/shortUrl";

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
            console.error("Erro ao buscar restaurantes:", err);
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
            console.error("Erro ao buscar restaurante por ID:", err);
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
            const menuUrl = await getShortUrl(docRef.id);

            if (menuUrl) {
                await updateDoc(docRef, { "company.shortUrlMenu": menuUrl });
            }

            toast.success("Restaurante criado com sucesso!");
            return docRef.id;

        } catch (err) {
            console.error("Erro ao criar restaurante:", err);
            setError(err instanceof Error ? err : new Error("Ocorreu um erro desconhecido."));
            toast.error("Não foi possível criar o restaurante.");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRestaurantCompany = useCallback(async (data: Partial<CompanyType>) => {
        if (!currentRestaurant?.id) return;
        setLoading(true);
        setError(null);
        try {
            const restaurantRef = doc(db, "restaurants", currentRestaurant.id);
            const companyDataToUpdate = { ...data, updatedAt: today() };
            const updatePayload: { [key: string]: any } = {};
            for (const [key, value] of Object.entries(companyDataToUpdate)) {
                updatePayload[`company.${key}`] = value;
            }

            await updateDoc(restaurantRef, updatePayload);
            setCurrentRestaurant(prev => prev ? { ...prev, company: { ...prev.company, ...companyDataToUpdate } } : null);
            toast.success("Dados do restaurante atualizados!");

        } catch (err) {
            console.error("Erro ao atualizar restaurante:", err);
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
        updateRestaurantCompany,
    };
}