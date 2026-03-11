import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

export const StarField = ({ count = 2000 }) => {
  const pointsRef = useRef()

  // 1. 大量の星の座標を生成（useMemoで再計算を防ぐ）
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3) // x, y, z の3つで1組
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20 // X座標 (-10〜10)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20 // Y座標
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 // Z座標
    }
    return positions
  }, [count])

  // 2. 星空をゆっくり回転させる
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005
      pointsRef.current.rotation.x += 0.0002
    }
  })

  return (
    <points ref={pointsRef}>
      {/* ジオメトリに座標データを流し込む */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      {/* 点としての見た目を設定 */}
      <pointsMaterial
        size={0.03}
        color="white"
        transparent
        opacity={0.8}
        sizeAttenuation={true} // 遠くの点を小さく見せる
      />
    </points>
  )
}
