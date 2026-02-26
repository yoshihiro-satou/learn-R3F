import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const Box = (props) => {
  // この参照により、THREE.Mesh オブジェクトに直接アクセスできます。
  const ref = useRef()
  // ホバーおよびクリックイベントの状態を保持します
  const [hoverd, hover] = useState(false)
  const [clicked, click] = useState(false)
  // このコンポーネントをレンダリングループに登録し、フレームごとにメッシュを回転します
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // ビューを返します。これらは JSX で表現された通常の Threejs 要素です。
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hoverd ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Example1 = () => {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2 } />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls />
    </Canvas>
  )
}
export default Example1;
