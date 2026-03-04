import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, Physics, RigidDody } from '@react-three/rapier'
import { useRef } from 'react'

const Example6 = () => {
  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} />
      <Physics gravity={[0, -30, 0]}>
        <Ball />
        <Paddle />
        <Enemy color="orange" position={[2.75, 1.5, 0]} />
        <Enemy color="hotpink" position={[-2.75, 3.5, 0]} />
      </Physics>
    </Canvas>
  )
}
const Ball = () => {
  const ref = useRef()
  const { viewport } = useThree()
  const onCollisionEnter = () => (ref.current.setTranlation({ x: 0, y: 0, z: 0}), ref.current.setLinvel({ x: 0, y: 10, z: 0 }))
  return (
    <RigidDody ref={ref} colliders="ball" mass={1}>

    </RigidDody>
  )
}
export default Example6;
