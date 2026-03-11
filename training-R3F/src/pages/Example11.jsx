import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Billboard } from '@react-three/drei'
import { InteractiveText } from './InteractiveText'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { TrailDot } from './TrailDot'
import { StarField } from './StarField'
import { ClickExplosion } from './ClickExplosion'
import { ShakeController } from './ShakeController'

const MouseTracker = ({ onMove }) => {
  // マウスの動きを監視して、親に座標を伝えるだけのコンポーネント
  useFrame(({ pointer, viewport }) => {
    const x = (pointer.x * viewport.width) / 2
    const y = (pointer.y * viewport.height) / 2
    onMove([x, y, 0])
  })
  return null
}

const Example11 = () => {
  const[dots, setDots] = useState([])
  const[explosions, setExplosions] = useState([])
  const[isFlashing, setIsFlashing] = useState(false)
  const[shake, setShake] = useState(0)

  const handleClick = (e) => {
  // クリックした3D空間の座標を取得
    if (!e.point) return;

    setShake(true)
    // 揺れを開始（数値が大きいほど激しく揺れる)
    setShake(Math.random() * 0.2 + 0.1)

  // 背景を光らせる
  setIsFlashing(true)
  setTimeout(() => {
    setIsFlashing(false)
    setShake(0)
  }, 40) // 0.15秒だけ光る

  const point = [e.point.x, e.point.y, e.point.z]
  const id = Date.now()
  setExplosions(prev => [...prev, { id, position: point }])

  // 2秒後に配列から削除してメモリを解放
  setTimeout(() => {
    setExplosions(prev => prev.filter(ex => ex.id !== id))
  }, 2000)
}

  const addDot = (pos) => {
    const newDot = {id: Date.now() + Math.random(), position: pos}
    setDots((prev) => [...prev.slice(-40), newDot]) // 最大40個に制限して重くならないようにする
  }
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111'}}>
      <Canvas camera={{ position: [0, 0, 5]}} flat > {/* 画面をクリックしたら発動 */}
        <ambientLight intensity={0.5} />
        <color attach="background" args={[isFlashing ? '#ffaa00' : '#050505']} />
        <Environment preset='night' />
        <MouseTracker onMove={addDot} />

        <StarField isExploding={isFlashing}/>

        <ShakeController shakeIntebsity={shake} />

        {explosions.map(ex => (
          <ClickExplosion key={ex.id} position={ex.position} />
        ))}

        <Billboard follow={true} position={[0, 0, 2]}>
          <mesh
            onPointerDown={(e) => {
              e.stopPropagation() // 他のオブジェクトへのクリック伝達を防ぐ
              handleClick(e)
            }}
          >
            {/*args={[100, 100]} で画面全体をカバー */}
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial transparent opacity={0} /> {/* 完全透明にする */}
          </mesh>
        </Billboard>

        {dots.map((dot) => (
          <TrailDot key={dot.id} position={dot.position} color="cyan" />
        ))}
        {/* Float で囲むと、マウス反応とは別にふわふわと浮遊します */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <InteractiveText>
            GEMINI DESIGN
          </InteractiveText>
        </Float>
        <EffectComposer>
          <Bloom intensity={isFlashing ? 3 : 1.5} luminanceThreshold={1} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
export default Example11
