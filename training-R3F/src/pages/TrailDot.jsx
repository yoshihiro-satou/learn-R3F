import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export const TrailDot = ({ position, color }) => {
  const ref = useRef()

  useFrame(() => {
    if(ref.current) {
      // 1. 少しづつ上に昇らせる（ゆらぎ）
      ref.current.position.y += 0.01
      // 2. だんだん小さく、透明にする
      ref.current.scale.multiplyScalar(0.96)
      ref.current.material.opacity *= 0.96
    }
  })

  return (
    <mesh position={position} ref={ref} >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        toneMapped={false}
      />
    </mesh>
  )
}
