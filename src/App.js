import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MarchingCubes, MarchingCube, Environment, Bounds } from '@react-three/drei'
import { Physics, RigidBody, BallCollider } from '@react-three/rapier'

const vec = new THREE.Vector3()

function MetaBall({ color, ...props }) {
  const api = useRef()
  useFrame((_state, delta) => {
    api.current.applyImpulse(
      vec
        .copy(api.current.translation())
        .normalize()
        .multiplyScalar(delta * -0.05),
    )
  })
  return (
    <RigidBody ref={api} colliders={false} linearDamping={4} angularDamping={0.95} {...props}>
      <MarchingCube strength={0.35} subtract={7} color={color} />
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
}

function Pointer() {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => {
    const { width, height } = viewport.getCurrentViewport()
    vec.set(mouse.x * (width / 2), mouse.y * (height / 2), 0)
    ref.current.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody type="kinematicPosition" colliders={false} ref={ref}>
      <MarchingCube strength={0.2} subtract={10} color="white" />
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 25 }}>
      <ambientLight intensity={1} />
      <directionalLight intensity={3} position={[10, -10, -10]} color={0x05D3FB} />
      <directionalLight intensity={3} position={[-10, -10, -10]} color={0xD362DF} />
      <Physics gravity={[0, 2, 0]}>
        <MarchingCubes resolution={64} maxPolyCount={20000} enableUvs={false} enableColors >
          <meshStandardMaterial vertexColors roughness={0.1} metalness={0.2} color={0x666666} />
          <MetaBall color="#05D3FB" position={[1, 1, 0.5]} /> // Cyan
          <MetaBall color="#5361F8" position={[-1, -1, -0.5]} /> // Iris
          <MetaBall color="#D362DF" position={[2, 2, 0.5]} /> // Magenta
          <MetaBall color="#F8BA26" position={[-2, -2, -0.5]} /> // Yellow
          <MetaBall color="#89EB5B" position={[3, 3, 0.5]} /> // Green
          <Pointer />
        </MarchingCubes>
      </Physics>
      <Environment files="adamsbridge.hdr" />
      <Bounds fit clip observe margin={1}>
        <mesh visible={false}>
          <boxGeometry />
        </mesh>
      </Bounds>
    </Canvas>
  )
}
