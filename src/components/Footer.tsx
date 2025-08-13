// src/components/Footer.tsx
export function Footer() {
    return (
        <footer className="bg-gray-800 p-2 md:p-4 text-white text-center bottom-0 left-0 w-full">
            <p className="text-xs md:text-base">
                &copy; {new Date().getFullYear()} Unitali Restaurantes. Todos os direitos reservados.
            </p>
        </footer>
    );
}