import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'

// 20個のボール用のデータを作成
  // 横幅(x) をバラバラにして。高さ(y)も時間差が出るようにばらけさせる
const balls = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 10, 10 + i * 2, 0]
  }))
const Example7 = () => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
      {/* 1. 見た目を豪華にする (drei) */}
      <Environment preset='city' />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />

      {/* 2. 物理エンジンの世界を開始 */}
      <Physics debug>
        {/* パドル */}
        <Paddle />
        {/* ボール */}
        {balls.map((ball) => (
          <Ball key={ball.id} position={ball.position}/>
        ))}
        {/* 固定された床 */}
        <RigidBody type="fixed">
          <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow >
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls />
      <ContactShadows position={[0, -1.9, 0]} opacity={0.4} scale={20} blur={2} />
    </Canvas>
  )
}

const Paddle = () => {
  const ref = useRef()

  const currentX = useRef(0)

  const offsetY = useRef(0)

  useFrame(({ pointer, viewport }) => {
    if(ref.current) {
      // 1. マウスが指し示している目標のX座標
      const targetX = (pointer.x * viewport.width) / 2

      // 2. 現在のXから目標のXへ、少しづつ近づける(0.1 = 10%ずつ)
      // これにより、パドルに「追従」する遅れ(重み)が生まれる
      currentX.current = THREE.MathUtils.lerp(currentX.current, targetX, 0.05)

      offsetY.current = THREE.MathUtils.lerp(offsetY.current, 0, 0.1)

      // 3. 物理エンジンに位置を伝える
      // y座標にMath.sinを少し混ぜると、移動に合わせて上下にふわふわさせることも可能
      ref.current.setTranslation({
        x: currentX.current,
        y: offsetY.current,
        z:0
      }, true)

      // 4. 傾き(rotation)もlerpで滑らかにする
      const targetRotation = (pointer.x * Math.PI) / 10
      ref.current.setRotation(
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, 0, -targetRotation)
        ),
        true
      )
    }
  })

  return (
    <RigidBody
      ref={ref}
      type="fixed"
      colliders="cuboid"
      onCollisionEnter={() => {
        offsetY.current = -0.3
      }}
      restitution={1}>
      <mesh >
        <boxGeometry args={[3, 0.5, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  )
}

const Ball = ({ position = [0, 10, 0]}) => {
  const ref = useRef()

  const resetBall = () => {
    if(ref.current) {
      // 位置を駆虫に戻し。速度をゼロにリセット
      ref.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true)
      ref.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  }
    return (
      <RigidBody
        ref={ref}
        colliders="ball"
        position={position}
        restitution={1.1}
        onCollisionEnter={({ other }) => {
          // もし「床」に当たったらリセット(今回は簡易的に判定)
          if(other.rigidBodyObject.bodyType() === 1) {
            resetBall() // 必要に応じて呼び出し
          }
        }}
        >
          <mesh castShadow >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="hotpink"/>
          </mesh>
        </RigidBody>
    )
  }

export default Example7;
