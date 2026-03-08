import { useState, useEffect } from "react";
import { Canvas } from '@react-three/fiber'
import { Physics , RigidBody, CuboidCollider } from '@react-three/rapier'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'
import Particle from './Particle'
import Bucket from './Bucket'

const Example8 = () => {
  const [score, setScore] = useState(0)
  const[miss, setMiss] = useState(0)
  const[particles, setParticles] = useState([])
  const[isPlaying, setIsPlaying] = useState(false) // 1.ゲーム進行フラグ
  const[hasStarted, setHasStarted] = useState(false)
  // 2. リスタート関数
  const startGame = () => {
    setScore(0)
    setMiss(0)
    setBalls([])
    setParticles([])
    setIsPlaying(true)
    setHasStarted(true)
  }
  // 3. ミスが10回になったらゲームストップ
  useEffect(() => {
    if(miss >=10) {
      setIsPlaying(false)
    }
  }, [miss])

  // 4. タイマー(isPlaying が true の時だけ動かす)
  useEffect(() => {
    if(!isPlaying) return // ゲームオーバーなら何もしない

    const interval = setInterval(() => {
      setBalls((prev) => [
        ...prev, {
          id: `ball-${Date.now()}`, // 重複しないように現在の時刻をIDにする
          position: [(Math.random() - 0.5) * 8, 10, 0] // 横幅bを少し広げて降らせる
        }
      ])
    }, 1300) // 2秒ごとに1個追加(ここを短くすると難易度アップ)
    return () => clearInterval(interval) // コンポーネントが消える時にタイマーを止める
  },[isPlaying]) //isPlayingが変わるたびに再設定

  // 1. ボールを state で管理する
  const[balls, setBalls] = useState(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `ball-${i}`, //個別にIDをふる
      position: [(Math.random() - 0.5) * 4, 10 + i * 3, 0]
    }))
  })

  // 爆発エフェクトを発生させる関数
  const createExplosion = (pos) => {
    const newParticles = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      position: [pos.x, pos.y, pos.z],
      color: "yellow"
    }))
    setParticles((prev) => [...prev, ...newParticles])

    // 1.5秒後に配列から消してメモリを節約
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    },1500)
  }

  // ボールを消去する共通関数(引数で score か miss か選べるようにすると便利)
  // 2. ボールを消去する
  const removeBall = (id, isCapture, other) => {
    setBalls((prev) => prev.filter((ball) => ball.id !== id))
    if(isCapture) {
      setScore((s) => s + 1)
      if(other) {
         // 衝突した相手(ボール)の位置で爆発
        const pos = other.rigidBody.translation()
        createExplosion(pos)
      }
    } else {
      setMiss((m) => m + 1)
    }
  }
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative'}}>
      <Canvas shadows camera={{ position: [0, 5, 10]}}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />

        {/* スコア表示(dreiのText) */}
        <Text position={[-2, 4, 0]} fontSize={0.5} color="white">
          SCORE: {score}
        </Text>
        <Text position={[2, 4, 0]} fontSize={0.5} color="red">
          MISS: {miss}
        </Text>

        <Physics paused={!isPlaying}> {/* 5. 物理演算も一時停止させる */}
          {particles.map(p => (
            <Particle key={p.id} position={p.position} color={p.color} />
          ))}
          {/* balls配列を map で描画 */}
          {balls.map((b) => (
            <RigidBody key={b.id} name={b.id} colliders="ball" position={b.position} restitution={0.4 + Math.random()}>
              <mesh castShadow >
                <sphereGeometry args={[0.3]} />
                <meshStandardMaterial color="cyan" />
              </mesh>
            </RigidBody>
          ))}

          <Bucket onCapture={(id, other) => isPlaying && removeBall(id, true, other)} />


          <RigidBody
          type="fixed"
          sensor
          position={[0, -1.5, 0]} // 床の少し上に配置
          onIntersectionEnter={({ other }) => {
            const hitId = other.rigidBodyObject.name
            removeBall(hitId, false)
          }}
          >
            {/* 横に長く、どこに落ちても検知できるようにする */}
            <CuboidCollider args={[10, 0.1, 10]} />
          </RigidBody>

            {/* 床 */}
          <RigidBody type="fixed" position={[0, -2, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[20, 0.5, 20]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          </RigidBody>
        </Physics>

        <OrbitControls />
      </Canvas>
      {/* 6. ゲームオーバー画面とりスタットボタン(HTMLオーバーレイ) */}
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgrountColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          zIndex: 10
        }}>
          {hasStarted && <h1 tyle={{ FontFace: '3rem', marginBottom: '20px'}}>GAME OVER</h1>}
          {hasStarted && <p style={{ fontSize: '1.5rem'}}>Final Score: {score}</p>}
          <button
            onClick={startGame}
            style={{
              padding: '15px 40px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#444',
              color: 'white'
            }}
          >
            {hasStarted ? 'RESTART' : 'START GAME' }
          </button>
        </div>
      )}
    </div>
  )
}
export default Example8;
