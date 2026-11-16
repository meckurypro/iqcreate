// src/App.tsx
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Work from './pages/Work'
import Process from './pages/Process'
import Contact from './pages/Contact'
import { Privacy, Terms } from './pages/Legal'

// The admin dashboard is loaded on demand so it adds nothing to the public site's bundle.
const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  return <Routes>
    <Route path="admin" element={<Suspense fallback={null}><Admin/></Suspense>}/>
    <Route element={<Layout/>}><Route index element={<Home/>}/><Route path="services" element={<Services/>}/><Route path="work" element={<Work/>}/><Route path="process" element={<Process/>}/><Route path="contact" element={<Contact/>}/><Route path="privacy" element={<Privacy/>}/><Route path="terms" element={<Terms/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route>
  </Routes>
}
