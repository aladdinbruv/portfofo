import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

export function Palace() {
  const palaceRef = useRef()
  const domeRef = useRef()
  const decorRef = useRef()

  useFrame((state) => {
    if (palaceRef.current) {
      palaceRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
    if (domeRef.current) {
      domeRef.current.rotation.y += 0.001
    }
    if (decorRef.current) {
      decorRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={palaceRef} position={[0, 0, -15]}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Enhanced central dome with intricate patterns */}
        <group ref={domeRef}>
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial 
              color="#FFD700"
              metalness={0.7}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1.5}
            />
          </mesh>
          {/* Dome decorative rings */}
          {[0.2, 0.4, 0.6, 0.8].map((y, index) => (
            <mesh key={index} position={[0, 4 - y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2 * (1 - y/2), 0.05, 32, 64]} />
              <meshPhysicalMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Enhanced main building with detailed facade */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[8, 4, 6]} />
          <meshPhysicalMaterial 
            color="#F5DEB3"
            metalness={0.3}
            roughness={0.7}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Enhanced towers with more detailed geometry */}
        {[[-4, 0, -3], [4, 0, -3], [-4, 0, 3], [4, 0, 3]].map((pos, index) => (
          <group key={index} position={pos}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.8, 0.9, 6, 32]} />
              <meshPhysicalMaterial 
                color="#DEB887"
                metalness={0.4}
                roughness={0.6}
                clearcoat={0.3}
              />
            </mesh>
            {/* Tower windows */}
            {[1, 2, 3, 4].map((y) => (
              <mesh key={y} position={[0, y, 0.81]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.3, 0.5, 0.1]} />
                <meshPhysicalMaterial color="#4A4A4A" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* Enhanced tower tops */}
            <mesh position={[0, 6.5, 0]}>
              <coneGeometry args={[1, 1.5, 32]} />
              <meshPhysicalMaterial 
                color="#FFD700"
                metalness={0.7}
                roughness={0.2}
                clearcoat={1}
              />
            </mesh>
          </group>
        ))}

        {/* Enhanced arches with more segments and better shape */}
        {[-2, 0, 2].map((x, index) => (
          <group key={index} position={[x, 1.5, 3]}>
            <mesh>
              <torusGeometry args={[1, 0.2, 32, 48, Math.PI]} />
              <meshPhysicalMaterial 
                color="#DEB887"
                metalness={0.5}
                roughness={0.5}
                clearcoat={0.3}
              />
            </mesh>
            {/* Arch decorations */}
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.3]} />
              <meshPhysicalMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Enhanced decorative elements */}
        <group ref={decorRef} position={[0, 2, 3.1]}>
          {[-3, -1, 1, 3].map((x, index) => (
            <group key={index} position={[x, 0, 0]}>
              <mesh>
                <boxGeometry args={[0.4, 0.4, 0.15]} />
                <meshPhysicalMaterial 
                  color="#FFD700"
                  metalness={0.9}
                  roughness={0.1}
                  clearcoat={1}
                />
              </mesh>
              {/* Additional ornamental details */}
              <mesh position={[0, 0, 0.1]}>
                <torusGeometry args={[0.15, 0.03, 16, 32]} />
                <meshPhysicalMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
      </Float>

      {/* Enhanced gardens with more detailed vegetation */}
      {[[-6, 0, -6], [6, 0, -6], [-6, 0, 6], [6, 0, 6]].map((pos, index) => (
        <group key={index} position={pos}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[1, 1.2, 1, 32]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </mesh>
          {/* Garden decorative elements */}
          {[0, Math.PI/2, Math.PI, Math.PI*3/2].map((rotation, i) => (
            <mesh key={i} position={[Math.cos(rotation)*0.7, 0.8, Math.sin(rotation)*0.7]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#90EE90" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}