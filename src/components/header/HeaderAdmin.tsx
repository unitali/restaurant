import { FaSignOutAlt } from 'react-icons/fa';
import { handleLogout } from '../../services/loginServices';

/**
 * Header component that displays a greeting message and a logout button.
 * It fetches the user's name from Firestore based on the current authenticated user.
 */
export function HeaderAdmin() {

    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center top-0 left-0 w-full z-50">
            <div className="text-white text-lg font-bold">
                Bem-vindo ao Painel Administrativo
            </div>
            <div className="flex items-center space-x-4">
                <FaSignOutAlt
                    onClick={handleLogout}
                    className="text-white cursor-pointer"
                    size={24}
                />
            </div>
        </header>
    );
}
