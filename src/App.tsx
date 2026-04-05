import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmpresaList from './components/EmpresaList'
import EmpresaEditar from './components/EmpresaEditar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
        <h1 className="text-3xl font-semibold mb-6">
          API Empresa (JWT Bearer) - https://localhost:5000/api/Empresa
        </h1>
        <Routes>
          <Route path="/" element={<EmpresaList />} />
          <Route path="/editar/:empresaId" element={<EmpresaEditar />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
