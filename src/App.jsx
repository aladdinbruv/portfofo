import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Suspense, useState, useRef, useEffect } from 'react'
import { OrbitControls, Environment, Float, Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import * as THREE from 'three'
import './App.css'
import { PortfolioOverlay } from './components/PortfolioOverlay'
import './components/PortfolioOverlay.css'
import { Genie } from './components/Genie'
import { Palace } from './components/Palace'
import { TreasureChest } from './components/TreasureChest'

function ParticleEffect() {
  const ref = useRef()
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }))

  return (
    <group position={[2, 1, 0]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#FFD700"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

function Experience() {
  const [showGenie, setShowGenie] = useState(false)
  const [currentSection, setCurrentSection] = useState('about')
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: "3D Portfolio",
      description: "Interactive portfolio with Three.js animations",
      position: [-4, 0.5, -6]
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React",
      position: [0, 0.5, -6]
    },
    {
      id: 3,
      title: "WebGL Game",
      description: "Browser-based 3D game using Three.js",
      position: [4, 0.5, -6]
    }
  ]
  
  const sectionPositions = {
    about: { carpet: [0, 0, 0], camera: [0, 2, 12] },
    experience: { carpet: [-8, 0, -4], camera: [-8, 4, 8] },
    skills: { carpet: [8, 0, -4], camera: [8, 4, 8] },
    projects: { carpet: [0, 0, -8], camera: [0, 6, 4] },
    education: { carpet: [-4, 0, 4], camera: [-4, 4, 16] },
    contact: { carpet: [4, 0, 4], camera: [4, 4, 16] }
  }
  
  useEffect(() => {
    const handleSectionChange = (section) => {
      setCurrentSection(section)
    }
  
    window.addEventListener('sectionChange', (e) => handleSectionChange(e.detail))
    return () => window.removeEventListener('sectionChange', handleSectionChange)
  }, [])

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    window.dispatchEvent(new CustomEvent('projectSelect', { detail: project }))
  }
  
  return (
    <>
      <Palace />
      <FlyingCarpet position={sectionPositions[currentSection].carpet} />
      <group onClick={() => setShowGenie(!showGenie)}>
        <MagicLamp />
      </group>
      <Genie isVisible={showGenie} />
      <ParticleEffect />
      {projects.map((project) => (
        <TreasureChest
          key={project.id}
          position={project.position}
          project={project}
          onClick={handleProjectClick}
        />
      ))}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="sunset" />
      <CameraControls currentSection={currentSection} positions={sectionPositions} />
    </>
  )
}

function CameraControls({ currentSection, positions }) {
  const { camera } = useThree()
  
  useFrame(() => {
    const targetPosition = positions[currentSection].camera
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.02)
  })
  
  return <OrbitControls enableZoom={false} />
}

function MagicLamp() {
  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      position={[2, 1, 0]}
    >
      <group>
        {/* Base of the lamp */}
        <mesh>
          <cylinderGeometry args={[0.4, 0.6, 1.2, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Neck of the lamp */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.15, 0.4, 0.4, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Spout */}
        <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.1, 0.15, 0.5, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Decorative rings */}
        {[-0.4, -0.2, 0, 0.2].map((y, index) => (
          <mesh key={index} position={[0, y, 0]}>
            <torusGeometry args={[0.42, 0.02, 16, 32]} />
            <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

function FlyingCarpet({ position = [0, 0, 0] }) {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      position={position}
    >
      <mesh>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#8B4513" />
        {/* Main carpet pattern */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.8, 0.02, 1.8]} />
          <meshStandardMaterial color="#DAA520" />
        </mesh>
        {/* Border pattern */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[2.9, 0.01, 1.9]} />
          <meshStandardMaterial color="#B8860B" />
        </mesh>
        {/* Center medallion */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.01, 8]} />
          <meshStandardMaterial color="#CD853F" />
        </mesh>
        {/* Corner patterns */}
        {[[-1.2, 0.08, -0.7], [1.2, 0.08, -0.7], [-1.2, 0.08, 0.7], [1.2, 0.08, 0.7]].map((pos, index) => (
          <mesh key={index} position={pos}>
            <cylinderGeometry args={[0.2, 0.2, 0.01, 6]} />
            <meshStandardMaterial color="#CD853F" />
          </mesh>
        ))}
      </mesh>
    </Float>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{
          position: [0, 2, 8],
          fov: 75
        }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <PortfolioOverlay />
    </div>
  )
}

export default App
