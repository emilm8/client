import React from 'react'
import { Link } from 'react-router-dom'

function MainAdmin() {
    return (
        <main>
            <section  className="min-h-[calc(100vh-96px)] py-6  dark:text-gray-900">
                <div className="container mx-auto flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
                    <h1 className="text-5xl font-bold leading-none text-center">Xoş gəldin!</h1>
                    <p className="text-xl text-center">Salam Admin,
                        <br />
                        Zəhmət olmasa, aşağıdakı məqamları yadda saxlayın:
                        <br />
                        Şifrənizi heç kimlə paylaşmayın.
                        <br />
                        İşinizi bitirdikdən sonra admin paneldən çıxış edin.
                        <br />
                        Əks halda, sayta uyğunsuz məzmunlar yüklənə bilər və təhlükəsizlik riski yaranar.
                        <br />
                        Sizin təhlükəsizliyiniz və saytın bütövlüyü üçün bu qaydalara riayət etməyiniz vacibdir. <br /> Anlayışınız üçün təşəkkür edirik.</p>
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
                        <Link to={"products"} className="px-8 py-3 text-lg font-semibold rounded bg-[#3c1e6e] text-white">Məhsul əlave et</Link>
                        <Link to={"category"} className="px-8 py-3 text-lg font-normal border rounded dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">Kateqoriya əlave et</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default MainAdmin