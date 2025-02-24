import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

function MoroccanFloor() {
  const floorRef = useRef()
  
  // Load the Zellige tile texture
  const tileTexture = useTexture({
    map: '/textures/moroccan_tile.jpg'
  })

  // Repeat the texture pattern
  tileTexture.map.wrapS = tileTexture.map.wrapT = THREE.RepeatWrapping
  tileTexture.map.repeat.set(10, 10)
  
  useFrame((state) => {
    if (floorRef.current) {
      // Subtle animation for the floor material
      floorRef.current.material.envMapIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <mesh
      ref={floorRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        {...tileTexture}
        roughness={0.8}
        metalness={0.2}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

export default MoroccanFloor