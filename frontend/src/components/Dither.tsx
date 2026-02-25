import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type Vec3 = [number, number, number];

type Props = {
  waveColor?: Vec3;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  colorNum?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  className?: string;
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uWaveColor;
  uniform float uDisableAnimation;
  uniform float uEnableMouse;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uColorNum;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform float uWaveSpeed;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float bayer4(vec2 p) {
    // 4x4 Bayer matrix threshold in [0..1)
    vec2 f = mod(floor(p), 4.0);
    float x = f.x;
    float y = f.y;

    float m = 0.0;
    if (x == 0.0 && y == 0.0) m = 0.0;
    else if (x == 2.0 && y == 0.0) m = 8.0;
    else if (x == 0.0 && y == 2.0) m = 12.0;
    else if (x == 2.0 && y == 2.0) m = 4.0;
    else if (x == 1.0 && y == 0.0) m = 2.0;
    else if (x == 3.0 && y == 0.0) m = 10.0;
    else if (x == 1.0 && y == 2.0) m = 14.0;
    else if (x == 3.0 && y == 2.0) m = 6.0;
    else if (x == 0.0 && y == 1.0) m = 3.0;
    else if (x == 2.0 && y == 1.0) m = 11.0;
    else if (x == 0.0 && y == 3.0) m = 15.0;
    else if (x == 2.0 && y == 3.0) m = 7.0;
    else if (x == 1.0 && y == 1.0) m = 1.0;
    else if (x == 3.0 && y == 1.0) m = 9.0;
    else if (x == 1.0 && y == 3.0) m = 13.0;
    else if (x == 3.0 && y == 3.0) m = 5.0;

    return (m + 0.5) / 16.0;
  }

  vec3 quantize(vec3 c, float steps) {
    steps = max(2.0, floor(steps));
    return floor(c * (steps - 1.0) + 0.5) / (steps - 1.0);
  }

  void main() {
    vec2 uv = vUv;

    float t = uDisableAnimation > 0.5 ? 0.0 : uTime * uWaveSpeed;

    // Retro wave field
    float w = sin((uv.x + t) * 6.2831 * uWaveFrequency) * sin((uv.y - t) * 6.2831 * (uWaveFrequency * 0.85));
    w *= uWaveAmplitude;

    // Subtle dark base with neon tint
    vec3 base = vec3(0.02, 0.01, 0.05);
    vec3 neon = uWaveColor * (0.55 + 0.45 * w);

    // Mouse interaction (adds a soft halo)
    if (uEnableMouse > 0.5) {
      float d = distance(uv, uMouse);
      float halo = smoothstep(uMouseRadius, 0.0, d);
      neon += uWaveColor * 0.5 * halo;
    }

    vec3 col = base + neon * 0.20;

    // Ordered dither threshold using screen-space coords
    vec2 px = uv * 720.0; // "pixel" density (tunable)
    float threshold = bayer4(px);

    // Add tiny noise for richness
    float n = hash(px + uTime) - 0.5;
    col += n * 0.01;

    // Apply quantization with threshold
    vec3 q = quantize(col, uColorNum);
    vec3 q2 = quantize(col + threshold * 0.03, uColorNum);

    col = mix(q, q2, 0.65);

    // Vignette
    float vig = smoothstep(0.95, 0.2, distance(uv, vec2(0.5)));
    col *= (0.85 + 0.15 * vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function DitherScene({
  waveColor = [0.66, 0.33, 0.97],
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  colorNum = 4,
  waveAmplitude = 0.3,
  waveFrequency = 3,
  waveSpeed = 0.05,
}: Omit<Props, 'className'>) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size, gl } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouse.current.set(x, 1 - y);
    };

    if (enableMouseInteraction) {
      window.addEventListener('pointermove', onPointerMove);
      return () => window.removeEventListener('pointermove', onPointerMove);
    }

    return;
  }, [enableMouseInteraction, gl.domElement]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveColor: { value: new THREE.Color(waveColor[0], waveColor[1], waveColor[2]) },
      uDisableAnimation: { value: disableAnimation ? 1 : 0 },
      uEnableMouse: { value: enableMouseInteraction ? 1 : 0 },
      uMouse: { value: mouse.current.clone() },
      uMouseRadius: { value: mouseRadius },
      uColorNum: { value: colorNum },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveFrequency: { value: waveFrequency },
      uWaveSpeed: { value: waveSpeed },
    }),
    [waveColor, disableAnimation, enableMouseInteraction, mouseRadius, colorNum, waveAmplitude, waveFrequency, waveSpeed],
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.copy(mouse.current);
  });

  // Keep it crisp but not heavy.
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
  }, [gl, size.width, size.height]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={(m) => {
          materialRef.current = m;
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function Dither(props: Props) {
  const {
    className,
    waveColor,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius,
    colorNum,
    waveAmplitude,
    waveFrequency,
    waveSpeed,
  } = props;

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas gl={{ alpha: true, antialias: false }} dpr={[1, 2]}>
        <DitherScene
          waveColor={waveColor}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
          colorNum={colorNum}
          waveAmplitude={waveAmplitude}
          waveFrequency={waveFrequency}
          waveSpeed={waveSpeed}
        />
      </Canvas>
    </div>
  );
}
