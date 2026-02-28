import { useEffect, useState } from "react"
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'

const Plane = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props}))
  return (
    <mesh receiveShadow ref={ref}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

const Example3 = () => {
return (
  <Canvas dpr={[1, 2]} shadows camera={{ position: [-5, 5, 5], fov: 50}} >
    <ambientLight />
    <spotLight angle={0.25} penubra={0.5} position={[10, 10, 5]} castShadow />
    <Physics>
      <Plane />
    </Physics>
  </Canvas>
)
}
export default Example3
