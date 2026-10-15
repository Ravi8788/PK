import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { textureUrl } from '@/app/lib/cloudinary'
import type { DeviceTier } from '@/app/hooks/useDeviceTier'
import { SceneErrorBoundary } from './ErrorBoundary'

interface CurvedWallProps {
  images: string[]
  onSelect: (index: number) => void
  active: boolean
  tier: DeviceTier
}

function Card({
  url,
  index,
  hovered,
  onHover,
  onSelect,
}: {
  url: string
  index: number
  hovered: boolean
  onHover: (index: number | null) => void
  onSelect: (index: number) => void
}) {
  const texture = useTexture(textureUrl(url))
  const material = useRef<THREE.MeshBasicMaterial>(null)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    if (material.current) material.current.map = texture
  }, [texture])

  return (
    <mesh
      scale={hovered ? 1.08 : 1}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(index)
      }}
      onPointerOut={() => onHover(null)}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(index)
      }}
    >
      <planeGeometry args={[1.35, 1.7]} />
      <meshBasicMaterial ref={material} map={texture} toneMapped={false} />
    </mesh>
  )
}

function Wall({ images, onSelect }: { images: string[]; onSelect: (index: number) => void }) {
  const group = useRef<THREE.Group>(null)
  const drag = useRef(0)
  const target = useRef(0)
  const velocity = useRef(0)
  const lastScroll = useRef(window.scrollY)
  const moved = useRef(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const { gl } = useThree()

  useEffect(() => {
    const element = gl.domElement
    element.style.touchAction = 'pan-y'
    let dragging = false
    let startX = 0
    let origin = 0
    const down = (event: PointerEvent) => {
      dragging = true
      moved.current = 0
      startX = event.clientX
      origin = target.current
    }
    const move = (event: PointerEvent) => {
      if (!dragging) return
      const delta = event.clientX - startX
      moved.current = Math.abs(delta)
      target.current = origin + delta / 170
    }
    const up = () => {
      dragging = false
    }
    element.addEventListener('pointerdown', down)
    element.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      element.removeEventListener('pointerdown', down)
      element.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  useFrame((_, delta) => {
    const nextScroll = window.scrollY
    const instant = (nextScroll - lastScroll.current) / 40
    lastScroll.current = nextScroll
    velocity.current = THREE.MathUtils.damp(velocity.current, instant, 3.5, delta)
    drag.current = THREE.MathUtils.damp(drag.current, target.current, 5, delta)
    if (!group.current) return
    group.current.position.x = drag.current
    group.current.rotation.z = THREE.MathUtils.clamp(velocity.current * 0.035, -0.16, 0.16)
    group.current.rotation.y = THREE.MathUtils.clamp(velocity.current * -0.02, -0.12, 0.12)
  })

  const mid = (images.length - 1) / 2

  return (
    <group ref={group}>
      {images.map((url, index) => {
        const offset = index - mid
        return (
          <group
            key={`${url}-${index}`}
            position={[offset * 1.55, 0, -Math.abs(offset) * 0.32]}
            rotation={[velocityTilt(offset), offset * -0.14, 0]}
          >
            <SceneErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <Card
                  url={url}
                  index={index}
                  hovered={hovered === index}
                  onHover={setHovered}
                  onSelect={(selected) => {
                    if (moved.current > 10) return
                    onSelect(selected)
                  }}
                />
              </Suspense>
            </SceneErrorBoundary>
          </group>
        )
      })}
    </group>
  )
}

function velocityTilt(offset: number) {
  return offset * 0.01
}

export default function CurvedWall({ images, onSelect, active, tier }: CurvedWallProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <Canvas
      dpr={[1, tier === 'high' ? 1.75 : 1.25]}
      gl={{ antialias: tier === 'high', powerPreference: 'high-performance', alpha: true }}
      frameloop={active && visible ? 'always' : 'demand'}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
    >
      <Wall images={images} onSelect={onSelect} />
    </Canvas>
  )
}
