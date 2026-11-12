import { BrowserRouter, Routes, Route } from 'react-router'
import './styles.css'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import CampaniaDetalle from './pages/CampaniaDetalle'
import AdminTipos from './pages/AdminTipos'
import NotFound from './pages/NotFound'
import Contenedor from './components/Contenedor'
import ProtectedRoute from './components/ProtectedRoute'
import RolRoute from './components/RolRoute'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Toaster } from 'sonner'

const App = () => {

  return (
    <Provider store= {store}>
    <Toaster position="bottom-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Contenedor />}>
            <Route element={<RolRoute rolesPermitidos={["marketer"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campanias/:id" element={<CampaniaDetalle />} />
            </Route>
            <Route element={<RolRoute rolesPermitidos={["admin"]} />}>
              <Route path="/admin/tipos" element={<AdminTipos />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App