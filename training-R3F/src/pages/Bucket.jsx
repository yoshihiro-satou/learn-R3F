import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'

const Bucket = ({ onCapture }) => {
  const ref = useRef()

  useFrame(({ pointer, viewport }) => {
    if(ref.current) {
      // 1. マウスの座標を3D空間の座標に変換
      const targetX = (pointer.x * viewport.width) / 2

      // 2. bucket全体(見た目＋センサー)を移動させる
      // ※ lerp を使って滑らかに動かします(0.1 = 10%づつ追従)
      const currentPos = ref.current.translation()
      ref.current.setTranslation({
        x: THREE.MathUtils.lerp(currentPos.x, targetX, 0.1),
        y: 0,
        z: 0
      }, true)
    }
  })
  return (
    // group ではなく RigidBody 自体を ref で操作します
    <RigidBody
      ref={ref}
      type="fixed"
      colliders={false} // 自動コライダーはオフにして、中身で定義する
      restitution={2.1} // 反発係数を追加するともっと跳ねます！
    >
      {/* 見た目のバケツ */}
      <mesh receiveShadow position={[0, -0.4, 0]}>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      <CuboidCollider args={[1, 0.1, 1]} position={[0, -0.4, 0]} />
      {/* センサーエリア */}
      <CuboidCollider
        args={[0.8, 0.5, 0.8]}
        sensor
        onIntersectionEnter={({ other }) => {
          const hitId = other.rigidBodyObject.name
          onCapture(hitId, other)
        }}
      />
    </RigidBody>
  )
}
export default Bucket
