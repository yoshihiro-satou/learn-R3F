import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const Box = (props) => {
  // この参照により、THREE.Mesh オブジェクトに直接アクセスできます。
  const ref = useRef()
  // ホバーおよびクリックイベントの状態を保持します
  const [hoverd, setHoverd] = useState(false)
  const [clicked, setClicked] = useState(false)
  // このコンポーネントをレンダリングループに登録し、フレームごとにメッシュを回転します
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // ビューを返します。これらは JSX で表現された通常の Threejs 要素です。
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hoverd ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Example1 = () => {
  return <h1>Example1</h1>
}
export default Example1;
