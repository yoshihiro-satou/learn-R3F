import { useState, useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics , RigidBody, CuboidCollider } from '@react-three/rapier'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'

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
        <CuboidCollider args={[1, 0.1, 1]} position={[0, -0.4, 0]} />
      </mesh>

      {/* センサーエリア */}
      <CuboidCollider
        args={[0.8, 0.5, 0.8]}
        sensor
        onIntersectionEnter={({ other }) => {
          const hitId = other.rigidBodyObject.name
          onCapture(hitId)
        }}
      />
    </RigidBody>
  )
}

const Example8 = () => {
  const [score, setScore] = useState(0)

  // ランダムな位置にボールを配置
  // const balls = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
  //   id: i,
  //   position: [(Math.random() - 0.5) * 4, 10 + i * 5, 0]
  // })), [])

  // 1. ボールを state で管理する
  const[balls, setBalls] = useState(() => {
     return Array.from({ length: 10 }, (_, i) => ({
      id: `ball-${i}`, //個別にIDをふる
      position: [(Math.random() - 0.5) * 4, 10 + i * 3, 0]
    }))
  })

  // 2. ボールを消去する
  const removeBall = (id) => {
    setBalls((prev) => prev.filter((ball) => ball.id !== id))
    setScore((s) => s + 1)
  }
  return (
    <Canvas shadows camera={{ position: [0, 5, 10]}}>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />

      {/* スコア表示(dreiのText) */}
      <Text position={[0, 4, 0]} fontSize={1} color="white">
        SCORE: {score}
      </Text>

      <Physics debug>
        {/* balls配列を map で描画 */}
        {balls.map((b) => (
          <RigidBody key={b.id} name={b.id} colliders="ball" position={b.position} restitution={0.4 + Math.random()}>
            <mesh castShadow >
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="cyan" />
            </mesh>
          </RigidBody>
        ))}

        <Bucket onCapture={removeBall} />

          {/* 床 */}
        <RigidBody type="fixed" position={[0, -2, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[20, 0.5, 20]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls />
    </Canvas>
  )
}
export default Example8;
