'use client'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'

function CoreMesh() {
  const meshRef = useRef(null)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.08
    meshRef.current.rotation.y += delta * 0.12
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.3, 4]} />
      <MeshDistortMaterial
        color="#8b5cf6"
        emissive="#4c1d95"
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.6}
        distort={0.35}
        speed={1.6}
      />
    </mesh>
  )
}

function OrbitNode({ radius, speed, size, color, offset = 0 }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.6) * radius * 0.4,
      Math.sin(t) * radius
    )
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  )
}

export default function Scene3DInner() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-4, -2, -3]} intensity={0.8} color="#22d3ee" />
      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
          <CoreMesh />
        </Float>
        <OrbitNode radius={2.3} speed={0.5} size={0.09} color="#22d3ee" offset={0} />
        <OrbitNode radius={2.7} speed={0.35} size={0.07} color="#a78bfa" offset={2} />
        <OrbitNode radius={2.0} speed={0.65} size={0.06} color="#f472b6" offset={4} />
        <Sparkles count={90} scale={6} size={2} speed={0.3} color="#c4b5fd" />
      </Suspense>
    </Canvas>
  )
}
