export function Footer() {
    return (
        <footer className="bg-unitali-blue-700 p-4 w-full text-white text-center">
            <p className="text-xs md:text-base">
                &copy; {new Date().getFullYear()} Unitali Restaurantes. Todos os direitos reservados.
            </p>
        </footer>
    );
}