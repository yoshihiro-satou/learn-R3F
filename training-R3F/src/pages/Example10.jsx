import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Environment, Float } from '@react-three/drei'
import { FloatingObject } from './FloatingObject'

const Example10 = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgorund: '#000'}}>
      <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
        <Environment preset='city' />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        <Physics gravity={[0, 0, 0]} > {/* 無重力設定 */}
          <FloatingObject position={[-2, 0, 0]} color="hotpink" />
          <FloatingObject position={[0, 1, 0]} color="cyan" />
          <FloatingObject position={[2, -1, 0]} color="yellow" />
        </Physics>
      </Canvas>
    </div>
  )
}
export default Example10
