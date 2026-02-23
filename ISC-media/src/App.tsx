import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js"; // これでも動作するが型エラーが出るため、three-stdlibパッケージを追加し使用。
// import { GLTFLoader } from "three-stdlib";
import "./App.css";
import { Box } from "./Box";

const Model = () => {
  // 3Dモデルの読み込み
  const gltf = useLoader(
    GLTFLoader,
    "/gltf/neji.glb"
  ); // 本番・開発環境でパスを切り替える
  return (
    <primitive
      object={gltf.scene}
      scale={2}
      position={[0, 0.6, 0]}
      rotation={[0, 0.7, 0]}
    />
  );
  // メモ: @react-three/drei を入れる場合は、以下に同じ
  // return (
  //   <Gltf src="/gltf/neji.glb" />
  // );

  // メモ: 以下でもOK
  // const gltf = useGLTF("/gltf/neji.glb");
  // return <primitive object={gltf.scene} />;
};

/**
 * 3Dモデルの表示サンプル
 */
const App = () => {
  return (
      <div className={"canvasContainer"}>
        <Canvas
          camera={{
            fov: 45, // 視野角
            position: [0, 3, 6], // 位置
          }}
        >
          {/* フォグ */}
          <fog attach="fog" args={["#95cdfb", 0, 20]} />

          {/* 3Dモデルの読み込み。Suspenseで囲むことで読み込み後に3D空間に追加される */}
          <Suspense fallback={null}>
            <Model />
          </Suspense>

          <pointLight
            color={"#3eaeec"}
            intensity={40}
            position={[0.6, 6, -8]}
          />
          <pointLight
            color={"#e8d5aa"}
            intensity={50}
            position={[-0.2, 0.6, 2]}
          />

          {/* 読み込みタイミング比較用の立方体 */}
          <mesh position={[0, -0.7, 0]}>
            <boxGeometry />
            <meshStandardMaterial color={"#5c9700"} />
          </mesh>

          {/* 床 */}
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[100, 0.1, 100]} />
            <meshBasicMaterial color={"#ececec"} />
          </mesh>
          <Box />
        </Canvas>
      </div>
  );
};
export default App;
