import { useEffect, useState } from 'react';
import { ButtonPrimary, CheckBox, Input } from '.';
import { useRestaurant } from '../contexts/RestaurantContext';
import { useRestaurants } from '../hooks/useRestaurants';
import { LoadingPage } from '../pages/LoadingPage';
import { daysLabels, daysOfWeek } from "../utils/date";


type OpeningDaysState = {
    [key: string]: {
        open: boolean;
        hours: string;
    };
};

export function CompanyOpeningHours() {
    const { restaurantId, restaurant } = useRestaurant();
    const { updateRestaurant, loading } = useRestaurants();
    const [edit, setEdit] = useState(false);

    const [openingDays, setOpeningDays] = useState<OpeningDaysState>(
        daysOfWeek.reduce((acc, day) => {
            acc[day] = { open: false, hours: "" };
            return acc;
        }, {} as OpeningDaysState)
    );

    useEffect(() => {
        if (restaurant?.openingHours) {
            setOpeningDays(() => {
                const bd = restaurant.openingHours || {};
                return daysOfWeek.reduce((acc, day) => {
                    acc[day] =  bd[day]
                        ? { open: !!bd[day].open, hours: bd[day].hours || "" }
                        : { open: false, hours: "" };
                    return acc;
                }, {} as OpeningDaysState);
            });
        }
    }, [restaurant?.openingHours]);

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!edit) return;
        const { name, checked } = e.target;
        setOpeningDays(prev => ({
            ...prev,
            [name]: {
                ...prev[name],
                open: checked,
            },
        }));
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!edit) return;
        const { name, value } = e.target;
        const day = name.replace('-hours', '');
        setOpeningDays(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                hours: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (edit) {
            await updateRestaurant(restaurantId, { openingHours: openingDays });
            setEdit(false);
        } else {
            setEdit(true);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <div className="shadow p-6 rounded bg-white max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Horário de Funcionamento</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                {daysOfWeek.map((dayName, index) => (
                    <div
                        key={dayName}
                        className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full"
                    >
                        <div className="flex items-center min-w-[140px]">
                            <CheckBox
                                key={`checkbox-${index}`}
                                label={daysLabels[dayName]}
                                name={dayName}
                                checked={openingDays[dayName].open}
                                onChange={handleCheckChange}
                                disabled={!edit}
                            />
                        </div>
                        {openingDays[dayName].open ? (
                            <div className="flex-1">
                                <Input
                                    id={`${dayName}-hours`}
                                    label="Horário de Funcionamento"
                                    placeholder="Ex: 18:00 - 23:00"
                                    name={`${dayName}-hours`}
                                    value={openingDays[dayName].hours}
                                    onChange={handleHoursChange}
                                    className="w-48"
                                    disabled={!edit}
                                />
                            </div>
                        ) : (
                            <span className='text-gray-400'>(Fechado)</span>
                        )}
                    </div>
                ))}
                <ButtonPrimary
                    id='save-opening-hours'
                    type="submit"
                    className='mt-5'
                    children={edit ? "Salvar" : "Editar"}
                />
            </form>
        </div>
    )
}