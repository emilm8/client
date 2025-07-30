import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import CategoryAdmin from './admin/components/CategoryAdmin'
import { Toaster } from 'react-hot-toast';
import Login from './auth/components/Login'
import Error from './components/Error'
import authVerify from './auth/authVerify'
import SubcategoryAdmin from './admin/components/SubcategoryAdmin'
import AdminHeader from './admin/components/HeaderSideBar'
import MainAdmin from './admin/components/MainAdmin'
import AddProduct from './admin/components/AddProduct'

function App() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        handleVerifyToken()
    }, [])

    async function handleVerifyToken() {
        const check = await authVerify()
        setAuth(check)
    }

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='*' element={<Error />} />

                {auth &&
                    <Route path='/admin/' element={<AdminHeader />}>
                        <Route index element={< MainAdmin />} />
                        <Route path='products' element={<AddProduct />} />
                        <Route path='category' element={<CategoryAdmin />} />
                        <Route path='subcategory' element={<SubcategoryAdmin />} />
                    </Route>
                }
            </Routes>
        </>
    )
}

export default App