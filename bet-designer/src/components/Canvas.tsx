"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import { useDesignerStore } from "@/store/useDesignerStore";
import GameCard from "./GameCard";
import Player from "./Player";
import Logo from "./Logo";

function BackgroundTemplate({ src }: { src: string }) {
  const [img] = useImage(src, "anonymous");
  return <KonvaImage image={img} listening={false} />;
}

function BankLogo({ src, box }: { src: string; box: { x: number; y: number; width: number; height: number } }) {
  const [img] = useImage(src, "anonymous");
  return (
    <KonvaImage
      image={img}
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
      listening={false}
    />
  );
}

const Canvas = forwardRef<Konva.Stage>((_props, ref) => {
  const manifest = useDesignerStore((s) => s.manifest);
  const bank = useDesignerStore((s) => s.getSelectedBank());
  const template = useDesignerStore((s) => s.selectedTemplate);
  const date = useDesignerStore((s) => s.date);
  const day = useDesignerStore((s) => s.day);
  const games = useDesignerStore((s) => s.games);
  const elements = useDesignerStore((s) => s.elements);
  const selectedElementId = useDesignerStore((s) => s.selectedElementId);
  const selectElement = useDesignerStore((s) => s.selectElement);
  const updateElement = useDesignerStore((s) => s.updateElement);

  const transformerRef = useRef<Konva.Transformer>(null);
  const stageInnerRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const templateEntry = bank?.templates[template];
  const layout = templateEntry?.layout;
  const canvasWidth = layout?.canvas.width ?? 1080;
  const canvasHeight = layout?.canvas.height ?? 1350;

  // ajusta a escala de exibição (CSS) mantendo o Stage real em alta resolução
  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 32;
      const availableHeight = containerRef.current.clientHeight - 32;
      const s = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight, 1);
      setScale(s > 0 ? s : 1);
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [canvasWidth, canvasHeight]);

  // conecta o Transformer ao elemento selecionado
  useEffect(() => {
    const tr = transformerRef.current;
    const layer = layerRef.current;
    if (!tr || !layer) return;
    if (!selectedElementId) {
      tr.nodes([]);
      layer.batchDraw();
      return;
    }
    const node = layer.findOne(`#${selectedElementId}`);
    if (node) {
      tr.nodes([node]);
      layer.batchDraw();
    } else {
      tr.nodes([]);
    }
  }, [selectedElementId, elements]);

  // expõe o Stage real para o componente pai (export PNG)
  useEffect(() => {
    if (typeof ref === "function") ref(stageInnerRef.current);
    else if (ref) (ref as React.MutableRefObject<Konva.Stage | null>).current = stageInnerRef.current;
  });

  if (!manifest) {
    return <div className="flex-1 flex items-center justify-center text-neutral-400">Carregando…</div>;
  }

  if (!bank) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400">
        Selecione uma banca para começar.
      </div>
    );
  }

  if (!templateEntry) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400">
        Esta banca não possui o template &quot;{template}&quot;.
      </div>
    );
  }

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full flex items-center justify-center overflow-hidden bg-[#05060a] relative"
    >
      <div
        style={{
          width: canvasWidth * scale,
          height: canvasHeight * scale,
          boxShadow: "0 0 0 1px #23262f, 0 20px 60px rgba(0,0,0,.5)"
        }}
      >
        <Stage
          ref={stageInnerRef}
          width={canvasWidth}
          height={canvasHeight}
          scale={{ x: scale, y: scale }}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) selectElement(null);
          }}
        >
          <Layer ref={layerRef}>
            {/* 1. Background (template) */}
            <BackgroundTemplate src={templateEntry.image} />

            {/* 2. Logo da banca */}
            {bank.logo && layout && <BankLogo src={bank.logo} box={layout.logo} />}

            {/* 3. Textos fixos: título / data / dia */}
            {layout && (
              <>
                <Text
                  text={bank.config.name}
                  x={layout.title.x}
                  y={layout.title.y}
                  fontSize={layout.title.fontSize}
                  fontFamily="var(--font-bebas)"
                  fill={layout.title.fill ?? "#FFFFFF"}
                  listening={false}
                />
                <Text
                  text={date}
                  x={layout.date.x}
                  y={layout.date.y}
                  fontSize={layout.date.fontSize}
                  fontFamily="var(--font-montserrat)"
                  fill={layout.date.fill ?? "#FFFFFF"}
                  listening={false}
                />
                <Text
                  text={day}
                  x={layout.day.x}
                  y={layout.day.y}
                  fontSize={layout.day.fontSize}
                  fontFamily="var(--font-montserrat)"
                  fill={layout.day.fill ?? "#FFD100"}
                  listening={false}
                />
              </>
            )}

            {/* 4. Jogos (escudos + textos) */}
            {layout &&
              games.slice(0, layout.games.length).map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  layout={layout.games[i]}
                  homeLogoSrc={manifest.logos[game.homeTeam]}
                  awayLogoSrc={manifest.logos[game.awayTeam]}
                />
              ))}

            {/* 5. Jogadores / elementos livres (arrastáveis) */}
            {sortedElements.map((el) =>
              el.type === "player" ? (
                <Player
                  key={el.id}
                  element={el}
                  isSelected={el.id === selectedElementId}
                  onSelect={() => selectElement(el.id)}
                  onChange={(patch) => updateElement(el.id, patch)}
                />
              ) : (
                <Logo
                  key={el.id}
                  element={el}
                  isSelected={el.id === selectedElementId}
                  onSelect={() => selectElement(el.id)}
                  onChange={(patch) => updateElement(el.id, patch)}
                />
              )
            )}

            <Transformer
              ref={transformerRef}
              rotateEnabled
              flipEnabled={false}
              boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
              }
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
});

Canvas.displayName = "Canvas";
export default Canvas;
