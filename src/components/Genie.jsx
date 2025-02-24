import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Trail, Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

export function Genie({ isVisible }) {
  const genieRef = useRef()
  const trailRef = useRef()
  const particlesRef = useRef()
  const ringRef = useRef()

  const [magicParticles] = useMemo(() => {
    return [random.inSphere(new Float32Array(200), { radius: 0.8 })]
  }, [])

  useFrame((state, delta) => {
    if (genieRef.current && isVisible) {
      genieRef.current.rotation.y += delta * 0.5
      if (particlesRef.current) {
        particlesRef.current.rotation.y -= delta * 0.2
        particlesRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 0.3
        ringRef.current.scale.x = ringRef.current.scale.y = 
          1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      }
    }
  })

  if (!isVisible) return null

  return (
    <Float
      speed={2}
      rotationIntensity={0.4}
      floatIntensity={0.5}
      position={[2, 2, 0]}
    >
      <group ref={genieRef}>
        {/* Enhanced Genie head with Trail effect */}
        <Trail
          ref={trailRef}
          width={0.3}
          length={6}
          color={"#4A90E2"}
          attenuation={(t) => t * t}
        >
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.3, 64, 64]} />
            <meshPhysicalMaterial
              color="#4A90E2"
              metalness={0.3}
              roughness={0.4}
              emissive="#0066cc"
              emissiveIntensity={0.8}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
              sheen={1}
              sheenRoughness={0.3}
              sheenColor="#6495ED"
            />
          </mesh>
        </Trail>

        {/* Enhanced Genie body with more segments */}
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.25, 0.5, 64, 32]} />
          <meshPhysicalMaterial
            color="#4A90E2"
            metalness={0.3}
            roughness={0.4}
            emissive="#0066cc"
            emissiveIntensity={0.6}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            sheen={1}
            sheenRoughness={0.3}
            sheenColor="#6495ED"
          />
        </mesh>

        {/* Enhanced Genie tail with more magical effects */}
        <group ref={particlesRef}>
          <mesh position={[0, -0.8, 0]}>
            <coneGeometry args={[0.3, 1, 64, 32]} />
            <meshPhysicalMaterial
              color="#4A90E2"
              transparent
              opacity={0.8}
              metalness={0.3}
              roughness={0.4}
              emissive="#0066cc"
              emissiveIntensity={0.8}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
              sheen={1}
              sheenRoughness={0.3}
              sheenColor="#6495ED"
            />
          </mesh>
          <Points positions={magicParticles} stride={3} frustumCulled={false}>
            <PointMaterial
              transparent
              color="#00ffff"
              size={0.03}
              sizeAttenuation={true}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </Points>
        </group>

        {/* Enhanced Genie accessories with animated rings */}
        <group ref={ringRef}>
          {[0.3, 0.5, 0.7].map((radius, index) => (
            <mesh key={index} position={[0, 0.5, 0]} rotation={[0, 0, index * Math.PI / 3]}>
              <torusGeometry args={[radius, 0.02, 32, 64]} />
              <meshPhysicalMaterial
                color="#FFD700"
                metalness={0.9}
                roughness={0.1}
                emissive="#FFD700"
                emissiveIntensity={0.8}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  )
}