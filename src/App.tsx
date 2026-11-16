import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Work from './pages/Work'
import Process from './pages/Process'
import Contact from './pages/Contact'
import { Privacy, Terms } from './pages/Legal'

export default function App() {
  return <Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="services" element={<Services/>}/><Route path="work" element={<Work/>}/><Route path="process" element={<Process/>}/><Route path="contact" element={<Contact/>}/><Route path="privacy" element={<Privacy/>}/><Route path="terms" element={<Terms/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>
}
