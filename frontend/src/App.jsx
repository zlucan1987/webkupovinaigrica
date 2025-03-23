import { Route, Routes } from 'react-router-dom';
import { RouteNames } from './constants';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import ManualTokenLogin from './pages/auth/ManualTokenLogin';
import UserProfile from './pages/auth/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
import ProductImageManagement from './pages/admin/ProductImageManagement';
import AdminRoleTest from './components/AdminRoleTest';
import KupciPregled from './pages/kupci/KupciPregled.jsx';
import KupciDodaj from './pages/kupci/KupciDodaj.jsx';
import KupciPromjena from './pages/kupci/KupciPromjena.jsx';
import ProizvodiPregled from './pages/proizvodi/ProizvodiPregled.jsx';
import ProizvodiDodaj from './pages/proizvodi/ProizvodiDodaj.jsx';
import ProizvodiPromjena from './pages/proizvodi/ProizvodiPromjena.jsx';
import RacuniPregled from './pages/racuni/RacuniPregled.jsx';
import RacuniDodaj from './pages/racuni/RacuniDodaj.jsx';
import RacuniPromjena from './pages/racuni/RacuniPromjena.jsx';
import StavkePregled from './pages/stavke/StavkePregled.jsx';
import StavkeDodaj from './pages/stavke/StavkeDodaj.jsx';
import StavkePromjena from './pages/stavke/StavkePromjena.jsx';
import SalesGraph from './components/SalesGraph.jsx';
import Webkupovinaigrica from './components/NavBarWebkupovinaigrica.jsx';
import './App.css';
import './pages.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './GamingTheme.css'; // Import our gaming theme
import Footer from './components/Footer';
import EntryPage from './components/EntryPage.jsx';
import SwaggerPage from './components/SwaggerPage.jsx';
import EraDiagram from './components/EraDiagram.jsx';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <CartProvider>
            <div className="app-container">
            <Webkupovinaigrica />

            <Routes>
                <Route path={RouteNames.HOME} element={<EntryPage />} />
          <Route path={RouteNames.LOGIN} element={<Login />} />
          <Route path={RouteNames.REGISTER} element={<Register />} />
          <Route path={RouteNames.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={RouteNames.MANUAL_TOKEN} element={<ManualTokenLogin />} />
                <Route path={RouteNames.USER_PROFILE} element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.KUPAC_PREGLED} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <KupciPregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.KUPAC_NOVI} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <KupciDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.KUPAC_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <KupciPromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PROIZVOD_PREGLED} element={
                    <ProtectedRoute>
                        <ProizvodiPregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PROIZVOD_NOVI} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <ProizvodiDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PROIZVOD_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <ProizvodiPromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.RACUN_PREGLED} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <RacuniPregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.RACUN_NOVI} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <RacuniDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.RACUN_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <RacuniPromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.STAVKA_PREGLED} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <StavkePregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.STAVKA_NOVA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <StavkeDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.STAVKA_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <StavkePromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.SWAGGER} element={
                    <ProtectedRoute>
                        <SwaggerPage />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.ERA_DIAGRAM} element={<EraDiagram />} />
                <Route path={RouteNames.SALES_GRAPH} element={
                    <ProtectedRoute>
                        <SalesGraph />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.USER_MANAGEMENT} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.ADMIN_ROLE_TEST} element={
                    <ProtectedRoute>
                        <AdminRoleTest />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PRODUCT_IMAGE_MANAGEMENT} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <ProductImageManagement />
                    </ProtectedRoute>
                } />
            </Routes>
            <Footer />
            </div>
        </CartProvider>
    );
}

export default App;
