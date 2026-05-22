"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uProgress;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  float noise = snoise(vUv * 4.0 + uTime * 0.1);
  noise = noise * 0.5 + 0.5;
  float threshold = uProgress;
  float edge = smoothstep(threshold - 0.08, threshold + 0.08, noise);
  float alpha = 1.0 - edge;
  if (alpha < 0.01) discard;
  vec3 edgeGlow = mix(uColor * 2.0, uColor, smoothstep(0.0, 0.15, alpha));
  gl_FragColor = vec4(edgeGlow, alpha * 0.95);
}
`;

interface Props {
  triggerSelector: string;
  color?: [number, number, number];
}

export default function ShaderDissolve({ triggerSelector, color = [0.2, 0.4, 1.0] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uColor: { value: new THREE.Vector3(...color) },
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ScrollTrigger scrub → shader uniform
    const trigger = ScrollTrigger.create({
      trigger: triggerSelector,
      start: "top bottom",
      end: "top top",
      scrub: 0.5,
      onUpdate: (self) => {
        uniformsRef.current.uProgress.value = self.progress;
      },
    });

    let animId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      uniformsRef.current.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      trigger.kill();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [triggerSelector, color]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 h-[60vh] pointer-events-none z-[30]"
      style={{ top: "-30vh", mixBlendMode: "screen" }}
    />
  );
}
