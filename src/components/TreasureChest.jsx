import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import * as THREE from 'three'

export function TreasureChest({ position, project, onClick }) {
  const chestRef = useRef()
  const lidRef = useRef()
  const particlesRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  
  const [particles] = useMemo(() => {
    return [random.inSphere(new Float32Array(100), { radius: 0.8 })]
  }, [])

  useFrame((state) => {
    if (lidRef.current && isOpen) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        -Math.PI / 2,
        0.1
      )
    } else if (lidRef.current) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        0,
        0.1
      )
    }

    if (chestRef.current) {
      chestRef.current.scale.x = THREE.MathUtils.lerp(
        chestRef.current.scale.x,
        hovered ? 1.1 : 1,
        0.1
      )
      chestRef.current.scale.y = THREE.MathUtils.lerp(
        chestRef.current.scale.y,
        hovered ? 1.1 : 1,
        0.1
      )
      chestRef.current.scale.z = THREE.MathUtils.lerp(
        chestRef.current.scale.z,
        hovered ? 1.1 : 1,
        0.1
      )
    }

    if (particlesRef.current && isOpen) {
      particlesRef.current.rotation.y += 0.01
      particlesRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const handleClick = () => {
    setIsOpen(!isOpen)
    onClick(project)
  }

  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      position={position}
    >
      <group
        ref={chestRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Enhanced chest base with detailed texturing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1, 1]} />
          <meshPhysicalMaterial
            color="#8B4513"
            metalness={0.4}
            roughness={0.6}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Enhanced chest lid with better materials */}
        <group ref={lidRef} position={[0, 0.5, 0.5]}>
          <mesh position={[0, 0, -0.5]}>
            <boxGeometry args={[1.5, 0.2, 1]} />
            <meshPhysicalMaterial
              color="#8B4513"
              metalness={0.4}
              roughness={0.6}
              clearcoat={0.3}
              clearcoatRoughness={0.2}
              envMapIntensity={1.2}
            />
          </mesh>
        </group>

        {/* Enhanced decorative elements */}
        <group>
          {/* Central lock */}
          <mesh position={[0, 0, 0.51]}>
            <boxGeometry args={[0.3, 0.3, 0.05]} />
            <meshPhysicalMaterial
              color="#FFD700"
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
          {/* Corner decorations */}
          {[[-0.7, 0.4], [0.7, 0.4], [-0.7, -0.4], [0.7, -0.4]].map(([x, y], index) => (
            <mesh key={index} position={[x, y, 0.51]}>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
              <meshPhysicalMaterial
                color="#DAA520"
                metalness={0.8}
                roughness={0.2}
                clearcoat={0.5}
              />
            </mesh>
          ))}
        </group>

        {/* Enhanced magical particles when open */}
        {isOpen && (
          <group ref={particlesRef}>
            <Points positions={particles} stride={3} frustumCulled={false}>
              <PointMaterial
                transparent
                color="#FFD700"
                size={0.04}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </Points>
            {/* Additional sparkle effect */}
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshPhysicalMaterial
                color="#FFD700"
                transparent
                opacity={0.2}
                metalness={1}
                roughness={0}
                envMapIntensity={2}
              />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  )
}