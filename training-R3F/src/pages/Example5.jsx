import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import '../index.css'

const Box = ({ text, color, ...props}) => {
  const [hoverd, set] = useState(false)
  return (
    <mesh {...props} onPointerOver={() => set(true)} onPointerOut={() => set(false)}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hoverd ? 'hotpink' : color }/>
      <Html position={[0, 0, 1]} className='label' center >
        {text}
      </Html>
    </mesh>
  )
}
const ScrollContainer = ({scroll, children}) => {
  const { viewport } = useThree()
  const group = useRef()
  useFrame((state, delta) => {
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, viewport.height * scroll.current, 4, delta)
  })
  return <group ref={group}>{children}</group>
}
const Scene= () => {
  const viewport = useThree((state) => state.viewport)
  return (
    <>
      <Box text={<span>This is HTML</span>} color="aquamarine" />
      <Box text={<h1>H1 caption</h1>} color="lightblue" position={[0, -viewport.height, 0]} />
    </>
  )
}

const Example5 = () => {
  const scrollRef  = useRef()
  const scroll = useRef(0)
  return (
    <>
      <Canvas eventSource={document.getElementById('root')} eventPrefix="client" >
        <ambientLight intensity={0.7}/>
        <pointLight position={[10, 0, 10]} intensity={100}/>
        <ScrollContainer scroll={scroll}>
          <Scene />
        </ScrollContainer>
      </Canvas>
      <div
        ref={scrollRef}
        onScroll={(e) => (scroll.current = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight))}
        className='scroll'
      >
        <div style={{ height: '200vh', pointerEvents: 'none'}}></div>
      </div>
    </>
  )
}
export default Example5;
