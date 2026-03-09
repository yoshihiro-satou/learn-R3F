import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'
import { Board } from './Board'

const Example9 = () => {
  const[isPlaying, setIsPlaying] = useState(false)
  const[key, setKey] = useState(0) // リセット用のキー
  
  const startGame = () => {
    setKey(prev => prev + 1) // 物理世界をリセット
    setIsPlaying(true)
  }

  const handleGameOver = () => {
    setIsPlaying(false)
    alert('落ちました！')
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 45 }}>
        <color attach="background" args={['#222']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} castShadow />

        <Physics key={key} paused={!isPlaying} debug>
          {/* 1. プレイヤーが操る板 */}
          <Board isPlaying={isPlaying}/>

          {/* 2. 転がるボール */}
          <RigidBody position={[0, 2, 0]} colliders='ball' restitution={0.5}>
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
