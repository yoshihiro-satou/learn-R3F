import { Canvas } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { InteractiveText } from './InteractiveText'

const Example11 = () => {
  return (
    <div style={{ width: '100vw', hight: '100vh', background: '#111'}}>
      <Canvas camera={{ position: [0, 0, 5]}}>
        <Environment preset='night' />

        {/* Float で囲むと、マウス反応とは別にふわふわと浮遊します */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <InteractiveText>
            GEMINI DESIGN
          </InteractiveText>
        </Float>
      </Canvas>
    </div>
  )
}
export default Example11
