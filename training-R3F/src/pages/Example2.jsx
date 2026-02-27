import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Text, TrackballControls } from "@react-three/drei";
import { generate } from 'random-words'

const Word = ({ children, ...props }) => {
  const color = new THREE.Color()
  const fontProps = { font: '/Inter_18pt-Bold.ttf', fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)
  // ホバー時にマウスカーソルを変更します
  useEffect(() => {
    if(hovered) document.body.style.cursor = 'pointer'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])
  useFrame(({ camera }) => {
    ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
  })
  return (
    <Billboard {...props}>
      <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => console.log('clicked')} {...fontProps} children={children} />
    </Billboard>
  )
}
const Cloud = ({ count = 4, radius = 20 }) => {
  // 球面分布で count x count 個のランダムな単語を作成する
  const words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    for(let i = 1; i < count + 1; i++)
      for(let j = 0; j < count; j++) temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), generate()])
    return temp
  }, [count, radius])
  return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />)
}
const RotatingCloud = ({ count, radius }) => {
  const groupRef = useRef()
  useFrame((state, delta) => {
    if(groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.rotation.z += delta * 0.1
    }
  })
  return (
    <group rotation={[10, 10.5, 10]}  ref={groupRef}>
      <Cloud count={count} radius={radius} />
    </group>
  )
}


const Example2 = () => {
  return (
    <Canvas dpr={[1, 2]} camera={{position: [0, 0, 35], fog: 90 }}>
      <color attach="background" args={['#101015']} />
      <fog attach="fog" args={["#202025", 0, 80]}/>
      <Suspense fallback={null}>
        <RotatingCloud count={8} radius={20} />
      </Suspense>
      <TrackballControls />
    </Canvas>
  )
}
export default Example2;
