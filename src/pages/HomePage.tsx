
import { HeaderPublic, PlanCard } from "../components";

const plans = [
    {
        id: 1,
        name: "Basico",
        price: "R$ 49/mês",
        features: {
            "Cadastro de produtos": true,
            "Cadastro de categorias": true,
            "Gestão de pedidos": false,
            "Relatórios": false,
            "Suporte": false,
        },
    },
    {
        id: 2,
        name: "Padrão",
        price: "R$ 99/mês",
        features: {
            "Cadastro de produtos": true,
            "Cadastro de categorias": true,
            "Gestão de pedidos": true,
            "Relatórios": false,
            "Suporte": true,
        },
    },
    {
        id: 3,
        name: "Completo",
        price: "R$ 149/mês",
        features: {
            "Cadastro de produtos": true,
            "Cadastro de categorias": true,
            "Gestão de pedidos": true,
            "Relatórios": true,
            "Suporte": true,
        },
    },
];

export const HomePage = () => {
    return (
        <>
            <HeaderPublic />
            <main className="pt-20 ">
                <section className="m-auto py-12 bg-gray-100">
                    <div className=" max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">Escolha seu plano</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {plans.map((plan, idx) => (
                                <PlanCard key={idx} plan={plan} index={idx} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};
