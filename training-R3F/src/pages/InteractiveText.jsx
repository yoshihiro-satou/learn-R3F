import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export const InteractiveText = ({ children }) => {
  const meshRef = useRef()

  useFrame(({ pointer }) => {
    if(meshRef.current) {
      // 1. 目標となる回転（角度）をマウス位置から計算
      // pointer.x/y は -1 ~ 1 なので、0.5を掛けて最大30度くらいに調整
      const targetRotationX = -pointer.y * 0.5
      const targetRotaitonY = pointer.x * 0.5

      // 2. lerp(線形補間)を使って、現在の角度から目標の角度へじわっと近づける
      // これを入れないと、動きがカクカクしてしまいます
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.1 // 追従スピード(0.1 = 10%ずつ近づく)
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotaitonY,
        0.1
      )

      // 3. 少しだけ位置も動かす(視覚効果: パララックス)
      meshRef.current.position.x = THREE.MethUtils.lerp(
        meshRef.current.position.x,
        pointer.x * 0.5,
        0.05
      )
    }
  })

  return (
    <Text
      ref={meshRef}
      fontSize={1}
      color="white"
      font="/lnter_18pt-Bold.ttf" // フォントを指定
    >
      {children}
    </Text>
  )
}
