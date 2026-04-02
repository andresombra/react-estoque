import EmpresaList from './components/EmpresaList'
import './App.css'

function App() {
  return (
    <div className="App" style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>API Empresa (JWT Bearer) - https://localhost:5000/api/Empresa</h1>
      <EmpresaList />
    </div>
  )
}

export default App
