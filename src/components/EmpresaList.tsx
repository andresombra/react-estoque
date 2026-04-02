import { useState } from 'react'
import { fetchEmpresa } from '../api/empresa'
import type { Empresa } from '../api/empresa'
import MsgPadraoModal from './MsgPadraoModal'

export default function EmpresaList() {
  const [token, setToken] = useState('')
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null)

  async function handleLoad() {
    setError(null)
    setLoading(true)

    try {
      const data = await fetchEmpresa(token)
      setEmpresas(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro desconhecido')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleShowDetails(nmEmpresa: string) {
    setSelectedEmpresa(nmEmpresa)
    setShowMessage(true)
  }

  return (
    <section className="container py-4">
      <h2 className="mb-3">Empresas</h2>

      <div className="mb-3">
        <label className="form-label">JWT Bearer Token</label>
        <input
          type="text"
          className="form-control"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Cole seu token aqui"
        />
      </div>

      <button className="btn btn-primary mb-3" onClick={handleLoad} disabled={loading || !token}>
        {loading ? 'Carregando...' : 'Buscar /api/Empresa'}
      </button>

      {error && <div className="alert alert-danger">Erro: {error}</div>}
<h3>TEMP</h3>
      {empresas.length > 0 ? (
        <table className="table table-bordered table-striped mt-3 responsive">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Data Cadastro</th>
              <th>Contato</th>
              <th>Endereço</th>
              <th>Usuários</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.empresaId}>
                <td>{empresa.empresaId}</td>
                <td>{empresa.nome}</td>
                <td>{empresa.email}</td>
                <td>{new Date(empresa.dataCadastro).toLocaleString()}</td>
                <td>{empresa.contato}</td>
                <td>{empresa.endereco}</td>
                <td>
                  {empresa.usuarios?.length ? (
                    <ul className="list-unstyled mb-0">
                      {empresa.usuarios.map((usuario) => (
                        <li key={usuario.id}>
                          {usuario.email} (Plano: {usuario.plano}, Situação: {usuario.situacao}, ADM: {usuario.adm})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Sem usuários'
                  )}
                </td>
                <td><button className="btn btn-sm btn-outline-primary" onClick={() => handleShowDetails(empresa.nome)}>Detalhes</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Nenhuma empresa carregada.</p>
      )}

      <MsgPadraoModal
        show={showMessage}
        onClose={() => {
          setShowMessage(false)
          setSelectedEmpresa(null)
        }}
        title={`Detalhes da Empresa${selectedEmpresa ? `: ${selectedEmpresa}` : ''}`}
        message="mensagem teste apos click"
      />
    </section>
  )
}
