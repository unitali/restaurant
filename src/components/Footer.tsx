// src/components/Footer.tsx
export function Footer() {
    return (
        <footer className="bg-gray-800 p-4 w-full max-w-2xl mx-auto text-white text-center bottom-0 left-0">
            <p className="text-xs md:text-base">
                &copy; {new Date().getFullYear()} Unitali Restaurantes. Todos os direitos reservados.
            </p>
        </footer>
    );
}