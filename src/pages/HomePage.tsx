import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ButtonPrimary, HeaderPublic } from "../components";
import type { PlanType } from "../types";

const plans = [
    {
        id: 1,
        name: "Básico",
        price: "R$ 49/mês",
        features: {
            "Cadastro de produtos": true,
            "Cadastro de categorias": true,
            "Menu online": true,
            "Pedido via WhatsApp": true,
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
            "Menu online": true,
            "Pedido via WhatsApp": true,
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
            "Menu online": true,
            "Pedido via WhatsApp": true,
            "Gestão de pedidos": true,
            "Relatórios": true,
            "Suporte": true,
        },
    },
];

export const HomePage = () => {
    const setSelectedPlan = (selectedPlan: PlanType) => {
        console.log("Selected Plan:", selectedPlan);
    };

    return (
        <>
            <HeaderPublic />
            <main className="pt-20 bg-gray-50">
                {/* Hero Section */}
                <section className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-teal-600 mb-6">
                            Seu restaurante digital, simples e eficiente
                        </h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Gerencie produtos, categorias e pedidos em tempo real. Tenha controle total do seu negócio com nosso sistema online, fácil de usar e seguro.
                        </p>
                        <ul className="mb-6 text-gray-700 space-y-2">
                            <li>✔ Menu online para seus clientes acessarem de qualquer lugar</li>
                            <li>✔ Envio de pedidos diretamente pelo WhatsApp para o restaurante</li>
                            <li>✔ Cadastro rápido de produtos e categorias</li>
                            <li>✔ Suporte dedicado</li>
                        </ul>
                        <ButtonPrimary
                            id="know-plans"
                            onClick={() => {
                                const section = document.getElementById("planos");
                                if (section) {
                                    section.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        >
                            Conheça os planos
                        </ButtonPrimary>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80"
                            alt="Restaurante digital"
                            className="rounded-lg shadow-lg w-full max-w-md"
                        />
                    </div>
                </section>

                {/* Planos */}
                <section id="planos" className="m-auto py-12 bg-gray-100 pt-24">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">Escolha seu plano</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, idx) => (
                                <div
                                    key={plan.name}
                                    className={"bg-white rounded shadow p-3 flex flex-col items-center justify-between pt-5 relative transition-all duration-300 min-h-[440px]"
                                    }
                                >
                                    {idx === 1 && (
                                        <span
                                            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-200 text-green-800 text-md font-semibold px-4 py-1 rounded-full shadow"
                                            style={{ zIndex: 2 }}
                                        >
                                            Mais Vendido
                                        </span>
                                    )}
                                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                    <p className="text-lg font-bold mb-10">{plan.price}</p>
                                    <ul className="w-full mb-10">
                                        {Object.entries(plan.features).map(([feature, hasFeature]) => (
                                            <li key={feature} className="flex items-center gap-2 py-1">
                                                {hasFeature ? (
                                                    <FaCheckCircle className="text-green-600" />
                                                ) : (
                                                    <FaTimesCircle className="text-red-500" />
                                                )}
                                                <span className={hasFeature ? "text-gray-800" : "text-gray-400 line-through"}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <ButtonPrimary
                                        id={`subscribe-${plan.name.toLowerCase()}`}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        Assinar
                                    </ButtonPrimary>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Depoimentos */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-center mb-8">O que dizem nossos clientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded shadow text-center">
                            <p className="text-gray-700 italic mb-4">
                                “O menu online facilitou muito para meus clientes e os pedidos chegam direto no WhatsApp!”
                            </p>
                            <span className="font-semibold text-teal-600">João, Pizzaria Saborosa</span>
                        </div>
                        <div className="bg-white p-6 rounded shadow text-center">
                            <p className="text-gray-700 italic mb-4">
                                “Consigo controlar os pedidos e produtos de forma simples e rápida.”
                            </p>
                            <span className="font-semibold text-teal-600">Maria, Hamburgueria Top</span>
                        </div>
                        <div className="bg-white p-6 rounded shadow text-center">
                            <p className="text-gray-700 italic mb-4">
                                “O suporte é excelente e o sistema é muito intuitivo.”
                            </p>
                            <span className="font-semibold text-teal-600">Carlos, Restaurante Família</span>
                        </div>
                    </div>
                </section>

                {/* CTA final */}
                <section className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-teal-600">Pronto para transformar seu restaurante?</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Experimente grátis e veja como é fácil gerenciar seu negócio!
                    </p>
                    <ButtonPrimary
                        id="start-now"
                        className="max-w-xs mx-auto"
                        onClick={() => window.location.href = "/create-restaurant"}
                    >
                        Comece agora
                    </ButtonPrimary>
                </section>
            </main>
        </>
    );
};
