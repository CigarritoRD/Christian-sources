import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../auth/ProtectedRoute'

import Home from '../pages/Home'
import Explore from '../pages/Explore'
import Search from '../pages/Search'
import ResourceDetail from '../pages/ResourceDetail'
import Library from '../pages/Library'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/explorar" element={<Explore />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/recurso/:slug" element={<ResourceDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Privadas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil/biblioteca" element={<Library />} />
      </Route>
    </Routes>
  )
}
