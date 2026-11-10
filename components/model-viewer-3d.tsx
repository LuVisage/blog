'use client'

import { useEffect, useRef, useState } from 'react'

interface ModelViewer3DProps {
  /** glb 路径，已带部署前缀 */
  src: string
  /** 模型加载前 / 无 WebGL / 加载失败时显示的静态图 */
  poster: string
  posterAlt: string
  className?: string
}

interface DataSaverNavigator extends Navigator {
  connection?: { saveData?: boolean }
}

/**
 * 可交互 3D 模型查看器。
 *
 * - three 与 examples 模块按需 import，且只在舞台进入视口后才开始加载；
 * - 省流量模式、无 WebGL、模型 404、无 JS 一律保留 poster，不出现空白或死控件；
 * - 键盘可操作：方向键旋转、+/- 缩放，舞台有焦点环与读屏说明；
 * - 尊重 prefers-reduced-motion（关闭自动旋转），卸载时释放 GPU 资源。
 */
export function ModelViewer3D({ src, poster, posterAlt, className = '' }: ModelViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    let dispose: (() => void) | undefined
    let io: IntersectionObserver | undefined

    const start = async () => {
      try {
        const THREE = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
        const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js')
        if (disposed || !mountRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
        camera.position.set(2.6, 1.8, 3.6)

        let renderer: import('three').WebGLRenderer
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        } catch {
          setEnabled(false)
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.15
        mount.appendChild(renderer.domElement)
        renderer.domElement.setAttribute('aria-hidden', 'true')

        scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d0c4, 2))
        const key = new THREE.DirectionalLight(0xffffff, 2.6)
        key.position.set(3, 5, 4)
        scene.add(key)
        const fill = new THREE.DirectionalLight(0xc9d8ff, 1)
        fill.position.set(-4, 1, -2)
        scene.add(fill)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.enablePan = false
        controls.minDistance = 2
        controls.maxDistance = 9
        controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        controls.autoRotateSpeed = 0.9

        // 键盘操作：方向键绕轴旋转相机，+/- 改变距离；OrbitControls 下一帧会
        // 从 camera.position 重新解算球坐标，所以直接改位置是安全的。
        const up = new THREE.Vector3(0, 1, 0)
        const right = new THREE.Vector3(1, 0, 0)
        const onKey = (e: KeyboardEvent) => {
          let handled = true
          switch (e.key) {
            case 'ArrowLeft': camera.position.applyAxisAngle(up, -0.14); break
            case 'ArrowRight': camera.position.applyAxisAngle(up, 0.14); break
            case 'ArrowUp': camera.position.applyAxisAngle(right, -0.1); break
            case 'ArrowDown': camera.position.applyAxisAngle(right, 0.1); break
            case '+': case '=': camera.position.multiplyScalar(0.9); break
            case '-': case '_': camera.position.multiplyScalar(1.1); break
            default: handled = false
          }
          if (!handled) return
          e.preventDefault()
          const distance = camera.position.length()
          if (distance < controls.minDistance) camera.position.setLength(controls.minDistance)
          if (distance > controls.maxDistance) camera.position.setLength(controls.maxDistance)
          camera.lookAt(0, 0, 0)
        }
        mount.addEventListener('keydown', onKey)

        const resize = () => {
          const w = mount.clientWidth
          const h = mount.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(mount)

        let frame = 0
        const tick = () => {
          frame = requestAnimationFrame(tick)
          controls.update()
          renderer.render(scene, camera)
        }
        tick()

        await MeshoptDecoder.ready
        if (disposed) return
        const loader = new GLTFLoader()
        loader.setMeshoptDecoder(MeshoptDecoder)
        loader.load(
          src,
          (gltf) => {
            if (disposed) return
            const model = gltf.scene
            // 按包围盒归一化，不管原始尺寸多大都居中并缩到同一视口
            const box = new THREE.Box3().setFromObject(model)
            const size = box.getSize(new THREE.Vector3())
            const center = box.getCenter(new THREE.Vector3())
            const scale = 2.3 / Math.max(size.x, size.y, size.z, 0.0001)
            model.scale.setScalar(scale)
            model.position.sub(center.multiplyScalar(scale))
            scene.add(model)
            setLoaded(true)
          },
          undefined,
          () => { /* 加载失败：保留 poster */ }
        )

        dispose = () => {
          cancelAnimationFrame(frame)
          mount.removeEventListener('keydown', onKey)
          ro.disconnect()
          controls.dispose()
          scene.traverse((obj) => {
            const mesh = obj as import('three').Mesh
            if (mesh.geometry) mesh.geometry.dispose()
            const mat = mesh.material
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
            else if (mat) mat.dispose()
          })
          renderer.dispose()
          renderer.domElement.remove()
        }
      } catch {
        setEnabled(false)
      }
    }

    const begin = () => {
      if (disposed) return
      // 省流量模式不下载 733KB 模型与 Three.js，只保留静态海报图
      if ((navigator as DataSaverNavigator).connection?.saveData) {
        setEnabled(false)
        return
      }
      void start()
    }

    if (typeof IntersectionObserver === 'undefined') {
      begin()
    } else {
      io = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io?.disconnect()
          begin()
        }
      }, { rootMargin: '120px' })
      io.observe(mount)
    }

    return () => {
      disposed = true
      io?.disconnect()
      dispose?.()
    }
  }, [src])

  return (
    <div className={`model3d ${className}`}>
      <div
        ref={mountRef}
        className="model3d__stage"
        data-js-only
        role="group"
        tabIndex={enabled ? 0 : -1}
        aria-hidden={!enabled}
        aria-label="3D 模型视图：方向键旋转，加减号缩放"
      />
      <img
        src={poster}
        alt={posterAlt}
        className={`model3d__poster${loaded ? ' model3d__poster--hidden' : ''}`}
      />
      {loaded && (
        <span className="model3d__hint" aria-hidden="true">
          <span className="model3d__hint-desktop">拖拽或方向键旋转 · 滚轮或 +/- 缩放</span>
          <span className="model3d__hint-touch">单指拖动旋转 · 双指缩放</span>
        </span>
      )}
      <span className="sr-only">
        可交互 3D 模型：{posterAlt}。可用方向键旋转、加减号缩放，也可用鼠标拖拽与滚轮。
      </span>
    </div>
  )
}
