export function Footer() {
    return (
        <footer className="bg-gray-800 p-4 md:w-full mx-auto text-white text-center bottom-0 left-0">
            <p className="text-xs md:text-base">
                &copy; {new Date().getFullYear()} Unitali Restaurantes. Todos os direitos reservados.
            </p>
        </footer>
    );
}