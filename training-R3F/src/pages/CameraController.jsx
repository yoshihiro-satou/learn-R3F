import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export const CameraController = ({ isFlashing }) => {
  const{ camera } = useThree()
  const shakeIntensity = useRef(0)
  const baseZ = 5 // 通常のカメラの高さ

  useEffect(() => {
    if(isFlashing && camera) {
      shakeIntensity.current = 0.6
      camera.position.z = baseZ + 1.2
    }
  },[isFlashing, camera])

  useFrame(() => {
    if(!camera) return
    // 1. シェイクの処理
    if(shakeIntensity.current > 0) {
      camera.position.x += (Math.random() - 0.5) * shakeIntensity.current
      camera.position.y += (Math.random() - 0.5) * shakeIntensity.current
      shakeIntensity.current *= 0.9 // 減衰
    }
    // 2. ズームバック（元の位置にじわじわ戻す）
    // 線形補間(lerp)を使って滑らかにbaseZに戻す
    camera.position.z += (baseZ - camera.position.z) * 0.1
    camera.position.x += (0 - camera.position.x) * 0.1
    camera.position.y += (0 - camera.position.y) * 0.1
  })
  return null
  }
