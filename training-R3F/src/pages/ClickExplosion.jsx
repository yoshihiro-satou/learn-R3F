import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ClickExplosion = ({ position }) => {
  const count = 30
  const meshRef = useRef()

  // 1. 各粒子の「飛び出す方向（ベクトル）」をランダムに作成
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      )
      temp.push({ velocity })
    }
    return temp
  }, [])

  // 2. 毎フレーム、粒子を外側へ移動させる
  useFrame(() => {
    meshRef.current.children.forEach((child, i) => {
      const { velocity } = particles[i]
      child.position.add(velocity) // 座標に速度を足す
      child.scale.multiplyScalar(0.95) // だんだん小さく
      child.material.opacity *= 0.95 // だんだん透明に
    })
  })

  return (
    <group ref={meshRef} position={position}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial 
            color="#ffaa00" 
            emissive="#ff4400" 
            emissiveIntensity={4} 
            transparent 
            toneMapped={false} 
          />
        </mesh>
      ))}
    </group>
  )
}
