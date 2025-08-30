import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import heroImage from "../assets/hero_image.png";
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

const depoiments = [
    {
        text: "O menu online facilitou muito para meus clientes e os pedidos chegam direto no WhatsApp!",
        author: "João, Pizzaria Saborosa"
    },
    {
        text: "Consigo controlar os pedidos e produtos de forma simples e rápida.",
        author: "Maria, Hamburgueria Top"
    },
    {
        text: "O suporte é excelente e o sistema é muito intuitivo.",
        author: "Carlos, Restaurante Família"
    }
]

export const HomePage = () => {
    const setSelectedPlan = (selectedPlan: PlanType) => {
        console.log("Selected Plan:", selectedPlan);
    };

    return (
        <>
            <HeaderPublic />
            <main className="pt-20 bg-white">
                {/* Hero Section */}
                <motion.section className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
                    <motion.div
                        className="flex-1 "
                        initial={{ x: -80, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-unitali-blue-500 mb-6">
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
                            className="bg-green text-white hover:bg-red"
                            onClick={() => {
                                const section = document.getElementById("planos");
                                if (section) {
                                    section.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        >
                            Conheça os planos
                        </ButtonPrimary>
                    </motion.div>
                    <motion.div
                        className="flex-1 flex justify-center"
                        initial={{ x: 80, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src={heroImage}
                            alt="Restaurante digital"
                            className="rounded-lg shadow-lg w-full max-w-md"
                        />
                    </motion.div>
                </motion.section>

                {/* Como funciona o app */}
                <motion.section
                    className="max-w-6xl mx-auto px-4 py-12 bg-unitali-blue-50"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-center mb-8 text-unitali-blue-500">Como funciona o nosso sistema?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-white rounded shadow p-6 flex flex-col items-center"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-4xl mb-4 text-unitali-green-500">{idx + 1}</span>
                                <h3 className="font-semibold mb-2 text-center text-unitali-blue-700">
                                    {[
                                        "Receba o link do seu menu online",
                                        "Cliente acessa o menu digital",
                                        "Pedido enviado pelo WhatsApp",
                                        "Restaurante recebe e confirma"
                                    ][idx]}
                                </h3>
                                <p className="text-gray-700 text-center">
                                    {[
                                        "Após criar sua conta, você recebe um link exclusivo do seu restaurante para compartilhar com seus clientes.",
                                        "O cliente acessa o menu online pelo link, visualiza os produtos, categorias e escolhe o que deseja pedir.",
                                        "Ao finalizar o pedido, o cliente clica em 'Enviar pelo WhatsApp' e o pedido chega diretamente no WhatsApp do restaurante.",
                                        "O restaurante recebe o pedido instantaneamente no WhatsApp, podendo confirmar e dar andamento de forma prática e rápida."
                                    ][idx]}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Planos */}
                <motion.section
                    id="planos"
                    className="m-auto py-12 pt-24"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-center mb-12 text-unitali-blue-500">Escolha seu plano</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-5">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.name}
                                className="bg-white rounded shadow p-3 flex flex-col items-center justify-between pt-5 relative transition-all duration-300 min-h-[440px]"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                viewport={{ once: true }}
                            >
                                {idx === 1 && (
                                    <span
                                        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-200 text-green-800 text-md font-semibold px-4 py-1 rounded-full shadow"
                                        style={{ zIndex: 2 }}
                                    >
                                        Mais Vendido
                                    </span>
                                )}
                                <h3 className="text-xl text-unitali-blue-600 font-semibold mb-2">{plan.name}</h3>
                                <p className="text-lg font-bold mb-10">{plan.price}</p>
                                <ul className="w-full mb-10">
                                    {Object.entries(plan.features).map(([feature, hasFeature]) => (
                                        <li key={feature} className="flex items-center gap-2 py-1">
                                            {hasFeature ? (
                                                <FaCheckCircle className="text-green-600" />
                                            ) : (
                                                <FaTimesCircle className="text-red-500" />
                                            )}
                                            <span className={hasFeature ? "text-unitali-blue-600" : "text-unitali-blue-400 line-through"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <ButtonPrimary
                                    id={`subscribe-${plan.name.toLowerCase()}`}
                                    onClick={() => setSelectedPlan(plan)}
                                    children="Assinar"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>


                {/* Depoimentos */}
                <motion.section
                    className="max-w-6xl mx-auto px-4 py-12 bg-unitali-blue-50"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold text-center mb-8 text-unitali-blue-500">O que dizem nossos clientes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {depoiments.map((dep, idx) => (
                            <motion.div
                                key={dep.author}
                                className="bg-white p-6 rounded shadow text-center"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-unitali-blue-700 italic mb-4">{dep.text}</p>
                                <span className="font-semibold text-red">{dep.author}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA final */}
                <motion.section
                    className="max-w-6xl mx-auto px-4 py-12 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl font-bold mb-4 text-unitali-blue-500">Pronto para transformar seu restaurante?</h2>
                    <p className="text-lg text-unitali-blue-700 mb-6">
                        Experimente grátis e veja como é fácil gerenciar seu negócio!
                    </p>
                    <ButtonPrimary
                        id="start-now"
                        className="max-w-xs mx-auto"
                        onClick={() => window.location.href = "/create-restaurant"}
                    >
                        Comece agora
                    </ButtonPrimary>
                </motion.section>
            </main>
        </>
    );
};
