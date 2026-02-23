import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import * as THREE from "three";


/**
 * インタラクションを仕込んだ立方体
 */
export const Box = () => {
  // 回転アニメーションがアクティブか？
  const [ isActive, setIsActive ] = useState(false);
  // メッシュの参照
  const meshRef = useRef<Mesh>(null);

  const v = new Vector3();
  // 毎フレームの更新
  useFrame((state, delta) => {
    if(!meshRef.current) {
      return;
    }

    // ポインターの位置に応じてメッシュのxy座標をなめらかに動かす
    meshRef.current.position.lerp(
      v.set(state.pointer.x * 3, state.pointer.y * 2, 0),
      delta * 2, //補間係数。リフレッシュレートに依存しないアニメーション速度を保つためデルタタイムを渡す
    );

    // クリック時(isActiveがtrueの時)に1回転させる
    meshRef.current.rotation.y = isActive
    ? THREE.MathUtils.damp(
      meshRef.current.rotation.y, //from
      2 * Math.PI, //to
      4, //減算係数。値が大きいほど動きが急になり、小さいほど動きが滑らかになる
      delta, //補間係数。リフレッシュレートに依存しないアニメーション速度を保つためデルタタイムを渡す
    )
    : 0; //0に戻す

    // 回転が終わった時の処理
    if(meshRef.current.rotation.y >= 2 * Math.PI - 0.01) {
      setIsActive(false);
    }
  });

  // クリック時の処理
  const handleClick = () => {
    setIsActive(true);
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[-1, 0, -1]}
      position={[0, 15, 0]} // 初期位置(上から登場する)
      castShadow={true}
      onClick={handleClick}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};
