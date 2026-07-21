"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type Konva from "konva";
import TemplateLoader from "@/components/TemplateLoader";
import Sidebar from "@/components/Sidebar";
import Toolbar from "@/components/Toolbar";
import { useDesignerStore } from "@/store/useDesignerStore";
import { exportStageToPng } from "@/lib/exportPng";

// react-konva depende de `window`, então o Canvas só pode ser renderizado no cliente.
const Canvas = dynamic(() => import("@/components/Canvas"), { ssr: false });

export default function Home() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const bank = useDesignerStore((s) => s.getSelectedBank());
  const template = useDesignerStore((s) => s.selectedTemplate);

  function handleGenerate() {
    if (!stageRef.current) return;
    const bankName = bank?.config.name?.replace(/\s+/g, "_") ?? "arte";
    exportStageToPng(stageRef.current, `${bankName}_${template}_${Date.now()}.png`);
  }

  return (
    <main className="h-screen w-screen flex bg-[#05060a]">
      <TemplateLoader />
      <Sidebar onGenerate={handleGenerate} />
      <div className="flex-1 relative h-full">
        <Toolbar />
        <Canvas ref={stageRef} />
      </div>
    </main>
  );
}
