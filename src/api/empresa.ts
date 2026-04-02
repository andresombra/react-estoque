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

export async function fetchEmpresa(token: string): Promise<Empresa[]> {
  if (!token) {
    throw new Error('Token JWT Bearer não fornecido.')
  }

  const response = await fetch(`${API_BASE_URL}/api/Empresa`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // Retirar credentials se backend não exigir cookies/sessões
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
