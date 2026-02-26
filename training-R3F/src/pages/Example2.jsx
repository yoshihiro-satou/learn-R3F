import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Text, TrackballControls } from "@react-three/drei";
import { genetate } from 'random-words'

const Word = ({ chidren, ...props }) => {
  const color = new THREE.Color()
  const fontProps = { fonr, }
}

const Example2 = () => {
  return (
    <Canvas dpr={[1, 2]} camera={{position: [0, 0, 35], fog: 90 }}>
      <fog attach="fog" args={["#202025", 0, 80]}/>
      <Suspense fallback={null}>
        <grop rotation={[10, 10.5, 10]} >
          <Cloud count={8} radius={20} />
        </grop>
      </Suspense>
      <TrackballControls />
    </Canvas>
  )
}
export default Example2;
