import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export const Board = ({ isPlaying }) => {
  const ref = useRef()

  useFrame(({ pointer }) => {
    // スタート前は板を動かさない
    if(!isPlaying) return

    if(ref.current) {
      // 1. マウスの位置から「目標の回転角度」を計算
      // pointer.y は -1 ~ 1 なので、0.5をかけて最大約30度くらい傾くようにします
      const targetRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(-pointer.y * 0.5, 0, -pointer.x * 0.5)
      )

      // 2.板の回転をセット（物理ボディを直接回線させます
      ref.current.setNextKinematicRotation(targetRotation)
    }
  })

  return (
    // type="kinematicRotation" は、プログラムで回転を制御する設定です
    <RigidBody ref={ref} type="kinematicPosition" colliders={false}>
      {/* 1. 床（メインの板） */}
      <mesh receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <CuboidCollider args={[2.5, 0.1, 2.5]} />

      {/* 2. 枠 (4つの壁) */}
      {/* 奥側の壁 */}
      <mesh position={[0, 0.3, -2.4]} >
        <boxGeometry args={[5, 0.5, 0.2]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <CuboidCollider args={[2.5, 0.25, 0.1]} position={[0, 0.3, -2.4]} />

      {/* 手前側の壁 */}
      <mesh position={[0, 0.3, 2.4]} >
      <boxGeometry args={[5, 0.5, 0.2]} />
      <meshStandardMaterial color="#888" />
      </mesh>
      <CuboidCollider args={[2.5, 0.25, 0.1]} position={[0, 0.3, 2.4]} />

      {/* 左側の壁 */}
      <mesh position={[-2.4, 0.3, 0]} >
        <boxGeometry args={[0.2, 0.5, 5]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <CuboidCollider args={[0.1, 0.25, 2.5]} position={[-2.4, 0.3, 0]} />

      {/* 右側の壁 */}
      <mesh position={[2.4, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.5, 5]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <CuboidCollider args={[0.1, 0.25, 2.5]} position={[2.4, 0.3, 0]} />
    </RigidBody>
  )
}
