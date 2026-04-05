export interface Usuario {
  id: number
  empresaId: number
  email: string
  data: string
  situacao: string
  plano: number
  adm: number
}

export interface Empresa {
  empresaId: number
  nome: string
  email: string
  dataCadastro: string
  contato: string
  endereco: string
  usuarios?: Usuario[]
}

const API_BASE_URL = 'https://localhost:5000'

function createAuthorizationHeaders(token: string) {
  if (!token) {
    throw new Error('Token JWT Bearer não fornecido.')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchEmpresa(token: string): Promise<Empresa[]> {
  const response = await fetch(`${API_BASE_URL}/api/Empresa`, {
    method: 'GET',
    headers: createAuthorizationHeaders(token),
    credentials: 'omit',
    mode: 'cors',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Erro ao buscar Empresa: ${response.status} ${response.statusText} - ${text}`)
  }

  const data = (await response.json()) as Empresa[]
  return data
}

export async function fetchEmpresaById(token: string, id: number): Promise<Empresa> {
  const response = await fetch(`${API_BASE_URL}/api/Empresa/${id}`, {
    method: 'GET',
    headers: createAuthorizationHeaders(token),
    credentials: 'omit',
    mode: 'cors',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Erro ao buscar Empresa ${id}: ${response.status} ${response.statusText} - ${text}`)
  }

  const data = (await response.json()) as Empresa
  return data
}

export async function updateEmpresa(token: string, empresa: Empresa): Promise<Empresa> {
  const response = await fetch(`${API_BASE_URL}/api/Empresa/${empresa.empresaId}`, {
    method: 'PUT',
    headers: createAuthorizationHeaders(token),
    credentials: 'omit',
    mode: 'cors',
    body: JSON.stringify(empresa),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Erro ao atualizar Empresa ${empresa.empresaId}: ${response.status} ${response.statusText} - ${text}`)
  }

  if (response.status === 204) {
    return empresa
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return empresa
  }

  const data = (await response.json()) as Empresa
  return data
}
