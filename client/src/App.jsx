import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import Layout from './Layout'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import CoffeesPage from './pages/CoffeesPage'
import CoffeesFormPage from './pages/CoffeesFormPage'
import CoffeePage from './pages/CoffeePage'
import QuantMassPage from './pages/QuantMassPage'
import QuantMassFormPage from './pages/QuantMassFormPage'
import { MetabolitePage } from './pages/MetabolitePage'
import { MetaboliteFormPage } from './pages/MetaboliteFormPage'
import PCAPage from './pages/PCApage'
import PCAResult from './pages/PCAResult'
axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/admin/:subpage?' element={<AdminPage />} />
          <Route path='/admin/coffee' element={<CoffeesPage />} />
          <Route path='/admin/coffee/new' element={<CoffeesFormPage />} />
          <Route path='/admin/coffee/:id' element={<CoffeesFormPage />} />
          <Route path='/admin/quantMass' element={<QuantMassPage />} />
          <Route path='/admin/quantMass/new' element={<QuantMassFormPage />} />
          <Route path='/admin/quantMass/:id' element={<QuantMassFormPage />} />
          <Route path='/admin/metabolite' element={<MetabolitePage />} />
          <Route path='/admin/metabolite/new' element={<MetaboliteFormPage />} />
          <Route path='/admin/metabolite/:id' element={<MetaboliteFormPage />} />
          <Route path='/coffee/:id' element={<CoffeePage />} />
          <Route path='/pca' element={<PCAPage />} />
          <Route path='/pca/result' element={<PCAResult />} />

        </Route>
      </Routes>
    </UserContextProvider>

  )
}

export default App
