import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export function useWindowResize() {
  const { camera, gl } = useThree()

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      gl.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [camera, gl])
}