'use client'

import { useState } from 'react'
import { Position } from '@/app/types'

interface PositionItemState {
  repoUrl: string
  submitted: boolean
  loading: boolean
  error: string | null
}

interface Props {
  positions: Position[]
  uuid: string
  candidateId: string
  baseURL: string
  applicationId: string
}

const STEP_COLORS = [
  'bg-blue-500',
  'bg-teal-600',
  'bg-cyan-700',
  'bg-blue-800',
  'bg-teal-500',
]

export default function List({ positions, uuid, candidateId, baseURL, applicationId }: Props) {
  const [states, setStates] = useState<Record<string, PositionItemState>>(
    () => Object.fromEntries(
      positions.map((p) => [p.id, { repoUrl: '', submitted: false, loading: false, error: null }])
    )
  )

  const handleChange = (id: string, value: string) => {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], repoUrl: value, error: null },
    }))
  }

  const handleSubmit = async (position: Position) => {
    const state = states[position.id]

    if (!state.repoUrl.trim()) {
      setStates((prev) => ({
        ...prev,
        [position.id]: { ...prev[position.id], error: 'Ingresá la URL de tu repositorio.' },
      }))
      return
    }

    if (!state.repoUrl.startsWith('https://github.com/')) {
      setStates((prev) => ({
        ...prev,
        [position.id]: { ...prev[position.id], error: 'La URL debe ser un repositorio de GitHub válido.' },
      }))
      return
    }

    setStates((prev) => ({
      ...prev,
      [position.id]: { ...prev[position.id], loading: true, error: null },
    }))

    try {
      
      const res = await fetch(`${baseURL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, candidateId, jobId: position.id, repoUrl: state.repoUrl, applicationId: applicationId }),
      })

      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)

      setStates((prev) => ({
        ...prev,
        [position.id]: { ...prev[position.id], loading: false, submitted: true },
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado. Intentá de nuevo.'
      setStates((prev) => ({
        ...prev,
        [position.id]: { ...prev[position.id], loading: false, error: message },
      }))
    }
  }

  return (
    <section className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-10">Open Positions</h1>

        <ul className="flex flex-col gap-6">
          {positions.map((position, index) => {
            const state = states[position.id]
            const color = STEP_COLORS[index % STEP_COLORS.length]
            const isEven = index % 2 === 0

            return (
              <li
                key={position.id}
                className={`flex items-stretch gap-0 ${isEven ? 'ml-0 mr-8' : 'ml-8 mr-0'}`}
              >
                {!isEven && (
                  <div className={`${color} flex items-center justify-center w-14 rounded-l-2xl shrink-0`}>
                    <span className="text-white text-2xl font-bold">{index + 1}</span>
                  </div>
                )}

                {/* Card */}
                <div className="flex-1 bg-white rounded-2xl shadow-md px-6 py-5"
                  style={{ boxShadow: '4px 6px 20px rgba(0,0,0,0.10)' }}
                >
                  <h2 className="text-base font-semibold text-gray-800 mb-4">{position.title}</h2>

                  {state.submitted ? (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700 text-sm font-medium">
                      <span>✓</span>
                      <span>¡Postulación enviada!</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        type="url"
                        placeholder="https://github.com/tu-usuario/tu-repo"
                        value={state.repoUrl}
                        onChange={(e) => handleChange(position.id, e.target.value)}
                        disabled={state.loading}
                        className={`w-full px-3 py-2 text-sm font-mono border rounded-lg outline-none text-gray-900 disabled:opacity-50
                          ${state.error ? 'border-red-400' : 'border-gray-300 focus:border-blue-400'}`}
                      />
                      {state.error && (
                        <p className="text-xs text-red-500">{state.error}</p>
                      )}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSubmit(position)}
                          disabled={state.loading}
                          className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-opacity cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed ${color} hover:opacity-80`}
                        >
                          {state.loading ? 'Enviando...' : 'Enviar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isEven && (
                  <div className={`${color} flex items-center justify-center w-14 rounded-r-2xl shrink-0`}>
                    <span className="text-white text-2xl font-bold">{index + 1}</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}