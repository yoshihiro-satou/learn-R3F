import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { OrbitControls } from '@react-three/drei'

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], restitution: 0.5, ...props }))
  return (
    <mesh receiveShadow ref={ref}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

function Cube({color, ...props}) {
  const [ref] = useBox(() => ({ mass: 1, ...props }))
  return (
    <mesh castShadow ref={ref}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function App() {
  const [ready, set] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => set(true), 1000)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [-5, 5, 10], fov: 50 }} style={{ background: '#111' }}>
      <ambientLight intensity={0.7}/>
      <spotLight angle={0.25} penumbra={0.5} position={[10, 10, 5]} castShadow intensity={400} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001}/>
      <Physics>
        <Plane />
        <Cube position={[0, 5, 0]} color={"orange"} args={[1, 1, 1]}/>
        <Cube position={[0.45, 7, -0.25]} color={"red"} args={[1, 1, 1]}/>
        <Cube position={[-0.45, 9, 0.25]} color={"pink"} args={[1, 1, 1]}/>
        {ready && (
          <>
            <Cube position={[-0.45, 10, 0.25]} color={"orange"} args={[1, 1, 1]}/>
            <Cube position={[-0.25, 15, 0.25]} color={"red"} args={[1, 1, 1]}/>
            <Cube position={[-0.45, 17, 0.25]} color={"blue"} args={[2, 2, 2]}/>
          </>
        )}
      </Physics>
      <OrbitControls />
    </Canvas>
  )
}
