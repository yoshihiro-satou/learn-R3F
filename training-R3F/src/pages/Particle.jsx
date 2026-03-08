import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const Particle = ({ position, color }) => {
  const ref = useRef()
  // 飛び散る方向をランダムに決定
  const velocity = useRef([
    (Math.random() - 0.5) * 0.2,
    Math.random() * 0.2,
    (Math.random() - 0.5) * 0.2
  ])

  useFrame(() => {
    if(ref.current) {
      // 1. 移動させる
      ref.current.position.x += velocity.current[0]
      ref.current.position.y += velocity.current[1]
      ref.current.position.z += velocity.current[2]

      // 2. 重力で少しづつ落とす
      velocity.current[1] -= 0.005

      // 3. だんだん小さく、透明にする
      ref.current.scale.multiplyScalar(0.95)
      ref.current.material.opacity *= 0.95
    }
  })
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color={color} transparent />
    </mesh>
  )
}
export default Particle;
