import List from '@/app/components/List'
import { Position } from '@/app/types'

function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

export default async function Page() {
  const baseURL = getEnvVar('BASE_URL')
  const uuid = getEnvVar('UUID')
  const candidateId = getEnvVar('CANDIDATE_ID')
  const applicationId = getEnvVar('APPLICATION_ID')
  
  let positions: Position[] = []

  try {
    const res = await fetch(`${baseURL}/api/jobs/get-list`, { cache: 'no-store' })

    if (!res.ok) throw new Error(`Error al obtener posiciones: ${res.status}`)

    positions = await res.json()
  } catch (error) {
    console.error(error)
    return (
      <main>
        <p>No se pudieron cargar las posiciones. Intentá de nuevo más tarde.</p>
      </main>
    )
  }

  return (
    <main>
      <List
        positions={positions}
        uuid={uuid}
        candidateId={candidateId}
        baseURL={baseURL}
        applicationId={applicationId}
      />
    </main>
  )
}