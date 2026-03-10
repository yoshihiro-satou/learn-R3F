import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { Board } from './Board'
import { HoleBoard } from './HoleBoard'
import Particle from './Particle'

const Example9 = () => {
  const[isPlaying, setIsPlaying] = useState(false)
  const[key, setKey] = useState(0) // リセット用のキー
  const[particles, setParticles] = useState([])

  const startGame = () => {
    setKey(prev => prev + 1) // 物理世界をリセット
    setIsPlaying(true)
  }

  const handleGameOver = () => {
    setIsPlaying(false)
    alert('落ちました！')
  }

  // 穴を通過した時のエフェクト生成
  const handleHolePass = () => {
    // 穴の位置(0, 0, 0)にパーティクルを出す
    const newParticles = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      position: [0, -0.5, 0], // 穴の少し下から噴き出す
      color: "#00ffff" // すり抜けっぽいネオンカラー
    }))

    setParticles(prev => [...prev, ...newParticles])

    // 1秒後に消去
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)))
    }, 1000)
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 45 }}>
        <color attach="background" args={['#222']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} castShadow />

        <Physics key={key} paused={!isPlaying} >
          {/* 1. プレイヤーが操る板 */}
          <HoleBoard isPlaying={isPlaying} onHolePass={handleHolePass}/>

          {/* パーティクルを表示 */}
          {particles.map(p => (
            <Particle key={p.id} position={p.position} color={p.color}/>
          ))}
          {/* 2. 転がるボール */}
          <RigidBody position={[-1.5, 2, 0]} colliders='ball' restitution={0.5}>
            <mesh castShadow>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="orange" />
            </mesh>
          </RigidBody>

          {/* 3. 落下検知センサー （板よりずっと下に配置）*/}
          <RigidBody
            type="fixed"
            sensor
            position={[0, -5, 0]}
            onIntersectionEnter={handleGameOver}
          >
            <CuboidCollider args={[20, 0.1, 20]} />
          </RigidBody>
        </Physics>
      </Canvas>

      {!isPlaying && (
        <button
          onClick={() => { setIsPlaying(true); setKey(k => k + 1); }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%' }}
        >
          START
        </button>
      )}
    </div>
  )
}
export default Example9;
