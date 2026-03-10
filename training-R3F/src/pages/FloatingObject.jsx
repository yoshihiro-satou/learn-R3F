import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export const FloatingObject = ({ position, color }) => {
  const rbRef = useRef()

  useFrame(({ pointer, viewport }) => {
    if (rbRef.current) {
      // 1. マウスの3D座標を計算
      const mouseX = (pointer.x * viewport.width) / 2
      const mouseY = (pointer.y * viewport.height) / 2
      const mouseVec = new THREE.Vector3(mouseX, mouseY, 0)
      
      // 2. 現在のオブジェクトの位置を取得
      const currentPos = rbRef.current.translation()
      const currentVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)

      // 3. マウスとの距離を測り、近ければ「斥力（せきりょく）」を与える
      const dist = mouseVec.distanceTo(currentVec)
      if (dist < 2) {
        const dir = currentVec.sub(mouseVec).normalize()
        rbRef.current.applyImpulse({ 
          x: dir.x * 0.5, 
          y: dir.y * 0.5, 
          z: 0 
        }, true)
      }

      // 4. 中央に戻ろうとする力（バネのような効果）
      rbRef.current.applyImpulse({
        x: (position[0] - currentPos.x) * 0.1,
        y: (position[1] - currentPos.y) * 0.1,
        z: (position[2] - currentPos.z) * 0.1
      }, true)
    }
  })

  return (
    <RigidBody 
      ref={rbRef} 
      position={position} 
      colliders="ball" 
      linearDamping={0.5} // 空気抵抗（これがないと止まらない）
      angularDamping={0.5}
    >
      <mesh onClick={() => rbRef.current.applyImpulse({ x: 0, y: 5, z: -2 }, true)}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
      </mesh>
    </RigidBody>
  )
}
