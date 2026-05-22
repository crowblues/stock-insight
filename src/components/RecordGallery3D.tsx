"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const CARDS = [
  { symbol: "AAPL", name: "Apple", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80" },
  { symbol: "MSFT", name: "Microsoft", image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&q=80" },
  { symbol: "NVDA", name: "NVIDIA", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80" },
  { symbol: "GOOGL", name: "Alphabet", image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&q=80" },
  { symbol: "AMZN", name: "Amazon", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&q=80" },
  { symbol: "TSLA", name: "Tesla", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80" },
  { symbol: "META", name: "Meta", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80" },
  { symbol: "JPM", name: "JPMorgan", image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&q=80" },
  { symbol: "V", name: "Visa", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" },
  { symbol: "AVGO", name: "Broadcom", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" },
  { symbol: "UNH", name: "UnitedHealth", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80" },
  { symbol: "BRK.B", name: "Berkshire", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
];

function CardPlane({ position, rotation, image, isActive, onClick }: {
  position: [number, number, number];
  rotation: [number, number, number];
  image: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(image);
  const targetPos = useRef(new THREE.Vector3(...position));
  const targetRot = useRef(new THREE.Euler(...rotation));

  useEffect(() => {
    if (isActive) {
      targetPos.current.set(position[0], position[1], position[2] + 1.5);
      targetRot.current.set(0, 0, -0.04);
    } else {
      targetPos.current.set(...position);
      targetRot.current.set(...rotation);
    }
  }, [isActive, position, rotation]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.lerp(targetPos.current, delta * 4);
    meshRef.current.rotation.x += (targetRot.current.x - meshRef.current.rotation.x) * delta * 4;
    meshRef.current.rotation.y += (targetRot.current.y - meshRef.current.rotation.y) * delta * 4;
    meshRef.current.rotation.z += (targetRot.current.z - meshRef.current.rotation.z) * delta * 4;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} onClick={onClick}>
      <planeGeometry args={[1.6, 2.2]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={isActive ? 1 : 0.85} />
    </mesh>
  );
}

function Scene({ activeIndex, setActiveIndex }: { activeIndex: number; setActiveIndex: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetRotY = mouse.current.x * 0.15;
    const targetRotX = mouse.current.y * 0.08;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * delta * 2;
  });

  const positions = useMemo(() => {
    return CARDS.map((_, i) => {
      const angle = (i / CARDS.length) * Math.PI * 0.8 - Math.PI * 0.4;
      const radius = 4.5;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - radius;
      const y = (i % 3 - 1) * 0.12;
      const rotY = -angle * 0.7;
      const rotZ = (i % 2 === 0 ? 0.02 : -0.02);
      return { pos: [x, y, z] as [number, number, number], rot: [0, rotY, rotZ] as [number, number, number] };
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {CARDS.map((card, i) => (
        <CardPlane
          key={card.symbol}
          position={positions[i].pos}
          rotation={positions[i].rot}
          image={card.image}
          isActive={activeIndex === i}
          onClick={() => setActiveIndex(i === activeIndex ? -1 : i)}
        />
      ))}
    </group>
  );
}

export default function RecordGallery3D() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      setActiveIndex(prev => {
        const next = prev + dir;
        if (next < 0) return CARDS.length - 1;
        if (next >= CARDS.length) return 0;
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      id="companies"
      ref={containerRef}
      className="relative h-screen w-full"
      data-lenis-prevent
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="!absolute inset-0">
        <ambientLight intensity={1.2} />
        <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      </Canvas>

      {/* UI 覆盖层 */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
          {activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, "0")} / ${CARDS.length}` : "scroll to browse"}
        </p>
        {activeIndex >= 0 && (
          <h2 className="text-3xl font-bold text-white">
            {CARDS[activeIndex].name}
          </h2>
        )}
      </div>

      {activeIndex >= 0 && (
        <div className="absolute bottom-8 right-8 z-10">
          <a
            href={`/company/${CARDS[activeIndex].symbol}`}
            className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
          >
            View Report →
          </a>
        </div>
      )}
    </section>
  );
}
