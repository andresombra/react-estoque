import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Empresa } from '../api/empresa'
import { fetchEmpresaById, updateEmpresa } from '../api/empresa'

type LocationState = {
  token?: string
}

export default function EmpresaEditar() {
  const { empresaId } = useParams<{ empresaId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null
  const token = state?.token ?? localStorage.getItem('empresaToken') ?? ''

  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [contato, setContato] = useState('')
  const [endereco, setEndereco] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!empresaId) {
      setError('ID da empresa não informado.')
      return
    }

    if (!token) {
      setError('Token JWT Bearer não encontrado. Volte à lista e abra a edição novamente.')
      return
    }

    const id = Number(empresaId)
    if (Number.isNaN(id)) {
      setError('ID da empresa inválido.')
      return
    }

    setLoading(true)
    setError(null)
    fetchEmpresaById(token, id)
      .then((data) => {
        setEmpresa(data)
        setNome(data.nome)
        setEmail(data.email)
        setContato(data.contato)
        setEndereco(data.endereco)
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Erro desconhecido ao carregar a empresa.')
        }
      })
      .finally(() => setLoading(false))
  }, [empresaId, token])

  async function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!empresa) {
      setError('Nenhuma empresa carregada para atualização.')
      return
    }

    if (!token) {
      setError('Token JWT Bearer não encontrado.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const updated = await updateEmpresa(token, {
        ...empresa,
        nome,
        email,
        contato,
        endereco,
      })
      setEmpresa(updated)
      setSuccess('Empresa atualizada com sucesso.')
      navigate('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro desconhecido ao salvar a empresa.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="container py-4">
      <h2>Editar Empresa</h2>

      <div className="mb-3">
        <Link to="/" className="btn btn-secondary">
          Cancelar
        </Link>
      </div>

      {loading && <div className="alert alert-info">Carregando dados da empresa...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {empresa && (
        <form onSubmit={handleConfirm}>
          <div className="mb-3">
            <label className="form-label">ID</label>
            <input type="text" className="form-control" value={empresa.empresaId} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contato</label>
            <input
              type="text"
              className="form-control"
              value={contato}
              maxLength={15}
              onChange={(event) => setContato(event.target.value.slice(0, 15))}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Endereço</label>
            <input
              type="text"
              className="form-control"
              value={endereco}
              onChange={(event) => setEndereco(event.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data de Cadastro</label>
            <input type="text" className="form-control" value={new Date(empresa.dataCadastro).toLocaleString()} disabled />
          </div>

          <button type="submit" className="btn btn-primary me-2" disabled={saving}>
            {saving ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} disabled={saving}>
            Cancelar
          </button>
        </form>
      )}
    </section>
  )
}
