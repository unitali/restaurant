export function BannerMenu() {
    return (
        <div className="relative w-full flex flex-col items-center">
            <div className="w-full h-32 bg-teal-100 rounded mb-4 flex items-center justify-center relative">
                <span className="text-teal-700 text-xl font-bold">Banner do Restaurante</span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10">
                <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-20 h-20 border-4 border-teal-100">
                    <img src="/logo.png"
                        alt="Logo do restaurante"
                        className="w-16 h-16 object-contain rounded-full" />
                </div>
            </div>
        </div>
    );
}
