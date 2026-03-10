import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

export const HoleBoard = ({ isPlaying, onHolePass }) => {
  const ref = useRef()

  useFrame(({ pointer }) => {
    if(!isPlaying) return
    if(ref.current) {
      // 前回と同じマウスで回転
      const targetRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(-pointer.y * 0.5, 0, -pointer.x * 0.5)
      )
      ref.current.setNextKinematicRotation(targetRotation)
    }
  })

  // 共通の設定
  const boardThickness = 0.2 // 板の厚み
  const boardColor = '#666'

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} >

      {/* --- 床を4つのパーツで構成して、中央に 1x1 の穴を作る --- */}

      {/* 1. 左側のパーツ (幅 2.0) */}
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[2, boardThickness, 5]} />
        <meshStandardMaterial color={boardColor} />
      </mesh>
      <CuboidCollider args={[1, boardThickness / 2, 2.5]} position={[-1.5, 0, 0]} />

      {/* 2. 右側のパーツ (幅 2.0) */}
      <mesh position={[1.5, 0, 0]} >
        <boxGeometry args={[2, boardThickness, 5]} />
        <meshStandardMaterial color={boardColor} />
      </mesh>
      <CuboidCollider args={[1, boardThickness / 2, 2.5]} position={[1.5, 0, 0]} />

      {/* 3. 奥川のパーツ (穴の奥の隙間を埋める) */}
      <mesh position={[0, 0, -1.5]} >
        <boxGeometry args={[1, boardThickness, 2]} />
        <meshStandardMaterial color={boardColor} />
      </mesh>
      <CuboidCollider args={[0.5, boardThickness / 2, 1]} position={[0, 0, -1.5]} />

      {/* 4. 手前側のパーツ (穴の手前の隙間を埋める) */}
      <mesh position={[0, 0, 1.5]} >
        <boxGeometry args={[1, boardThickness, 2]} />
        <meshStandardMaterial color={boardColor} />
      </mesh>
      <CuboidCollider args={[0.5, boardThickness / 2, 1]} position={[0, 0, 1.5]} />

      {/* 5. 外枠  */}
      <CuboidCollider args={[2.5, 0.4, 0.1]} position={[0, 0.4, 2.4]} />
      <CuboidCollider args={[2.5, 0.4, 0.1]} position={[0, 0.4, -2.4]} />
      <CuboidCollider args={[0.1, 0.4, 2.5]} position={[2.4, 0.4, 0]} />
      <CuboidCollider args={[0.1, 0.4, 2.5]} position={[-2.4, 0.4, 0]} />

      {/* 6. 穴の直下に配置する「すり抜けセンサー」 */}
      <CuboidCollider
      args={[0.5, 0.1, 0.5]} // 穴(1x1)より少しだけ小さくすると自然
      position={[0, -0.2, 0]} // 板のすぐ下に配置
      sensor // 物理的に跳ね返させず、通り抜けるのを検知
      onIntersectionEnter={() => {
        // 親コンポーネントに「穴を通ったよ！」と伝える
        onHolePass()
      }}
      />
    </RigidBody>
  )
}
