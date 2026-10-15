import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export type DeviceTier = 'high' | 'mid' | 'low'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function readDeviceTier(reduced: boolean): DeviceTier {
  if (typeof window === 'undefined') return 'mid'
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  const fine = window.matchMedia('(pointer: fine)').matches
  const wide = window.innerWidth >= 1100
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory
  const saveData = Boolean(nav.connection?.saveData)
  const webgl = hasWebGL()

  if (reduced || !webgl || saveData) return 'low'
  if (fine && wide && cores >= 6 && (memory === undefined || memory >= 4)) return 'high'
  return 'mid'
}

export function useDeviceTier() {
  const reduced = useReducedMotion()
  const [tier, setTier] = useState<DeviceTier>(() => readDeviceTier(reduced))

  useEffect(() => {
    const update = () => setTier(readDeviceTier(reduced))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [reduced])

  return tier
}
