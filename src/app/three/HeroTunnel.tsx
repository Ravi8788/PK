import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { textureUrl } from '@/app/lib/cloudinary'
import type { DeviceTier } from '@/app/hooks/useDeviceTier'
import { SceneErrorBoundary } from './ErrorBoundary'
import { splitFragment, splitVertex } from './materials/shaders'

interface HeroTunnelProps {
  images: string[]
  progressRef: React.MutableRefObject<number>
  pointerRef: React.MutableRefObject<{ x: number; y: number }>
  velocityRef: React.MutableRefObject<number>
  tier: DeviceTier
  autoDrift: boolean
  active: boolean
}

const COLORS = ['#16161e', '#101016', '#1c1c14', '#12121a']

function Placeholder({ index }: { index: number }) {
  const color = useMemo(() => new THREE.Color(COLORS[index % COLORS.length]), [index])
  return (
    <mesh>
      <planeGeometry args={[1.85, 1.12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function PhotoPlane({
  url,
  split,
  skew,
}: {
  url: string
  split: React.MutableRefObject<number>
  skew: React.MutableRefObject<number>
}) {
  const texture = useTexture(textureUrl(url))
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uSplit: { value: 0 },
      uSkew: { value: 0 },
      uHasMap: { value: 1 },
      uColor: { value: new THREE.Color('#101016') },
    }),
    [texture],
  )

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
  }, [texture])

  useFrame(() => {
    if (!material.current) return
    material.current.uniforms.uSplit.value = split.current
    material.current.uniforms.uSkew.value = skew.current
  })

  return (
    <mesh>
      <planeGeometry args={[1.85, 1.12]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={splitVertex}
        fragmentShader={splitFragment}
      />
    </mesh>
  )
}

function TunnelScene({
  images,
  progressRef,
  pointerRef,
  velocityRef,
  tier,
  autoDrift,
}: Omit<HeroTunnelProps, 'active'>) {
  const count = tier === 'high' ? 12 : 6
  const look = useRef(new THREE.Vector2())
  const { camera } = useThree()
  const split = useRef(0)
  const skew = useRef(0)

  const urls = useMemo(() => images.filter(Boolean).slice(0, count), [images, count])

  useFrame((_, delta) => {
    if (autoDrift) {
      progressRef.current = (progressRef.current + delta * 0.045) % 1
    }
    const depth = count * 1.28
    const targetZ = 3.4 - progressRef.current * depth
    look.current.x = THREE.MathUtils.damp(look.current.x, pointerRef.current.x * 0.55, 3.2, delta)
    look.current.y = THREE.MathUtils.damp(look.current.y, pointerRef.current.y * 0.35, 3.2, delta)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, look.current.x, 3, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -look.current.y, 3, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, autoDrift ? 1.4 : 3.4, delta)
    camera.lookAt(look.current.x * 0.2, 0, camera.position.z - 5)
    const fast = tier === 'high' ? Math.min(Math.abs(velocityRef.current) / 2.2, 1) : 0
    split.current = THREE.MathUtils.damp(split.current, fast * 0.018, 4, delta)
    skew.current = THREE.MathUtils.damp(skew.current, fast * 0.08 * Math.sign(velocityRef.current || 1), 4, delta)
  })

  return (
    <group>
      {urls.map((url, index) => {
        const angle = index * 0.82
        return (
          <group
            key={`${url}-${index}`}
            position={[Math.cos(angle) * 1.9, Math.sin(angle) * 0.78, -index * 1.32]}
            rotation={[0, Math.sin(angle) * 0.28, 0]}
          >
            {url ? (
              <SceneErrorBoundary fallback={<Placeholder index={index} />}>
                <Suspense fallback={<Placeholder index={index} />}>
                  <PhotoPlane url={url} split={split} skew={skew} />
                </Suspense>
              </SceneErrorBoundary>
            ) : (
              <Placeholder index={index} />
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function HeroTunnel({
  images,
  progressRef,
  pointerRef,
  velocityRef,
  tier,
  autoDrift,
  active,
}: HeroTunnelProps) {
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
      camera={{ position: [0, 0, 3.4], fov: 52 }}
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', touchAction: 'pan-y' }}
    >
      <TunnelScene
        images={images}
        progressRef={progressRef}
        pointerRef={pointerRef}
        velocityRef={velocityRef}
        tier={tier}
        autoDrift={autoDrift}
      />
    </Canvas>
  )
}
