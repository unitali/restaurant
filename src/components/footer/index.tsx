// src/components/Footer.tsx
export function Footer() {
    return (
        <footer className="bg-gray-800 p-4 text-white text-center fixed bottom-0 left-0 w-full">
            <p>&copy; {new Date().getFullYear()} Unitali Restaurantes. Todos os direitos reservados.</p>
        </footer>
    );
}