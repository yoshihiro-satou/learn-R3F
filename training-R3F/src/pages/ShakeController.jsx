import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export const ShakeController = ({ shakeIntebsity }) => {
  const { camera } = useThree()
  const intensity = useRef(0)

  // 親から沸かされた強度を保持（爆発の瞬間に最大値になる
  useEffect(() => {
    if(shakeIntebsity > 0) {
      intensity.current = shakeIntebsity
    }
  }, [shakeIntebsity])

  useFrame(() => {
    if(intensity.current > 0) {
      // ランダムにカメラをずらす
      camera.position.x += (Math.random() - 0.5) * intensity.current
      camera.position.y += (Math.random() - 0.5) * intensity.current

      // 徐々に揺れを収束させる
      intensity.current *= 0.95

      // 揺れが小さくなったらカメラをもとの位置(0, 0, 0)に引き戻す
      if(intensity.current < 0.001) {
        intensity.current = 0
        camera.position.x += (0-camera.position.x) * 0.1
        camera.position.y += (0-camera.position.y) * 0.1
      }
    }
  })
  return null
}
