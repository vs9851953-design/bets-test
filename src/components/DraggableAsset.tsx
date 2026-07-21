"use client";

import { useRef, useEffect } from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import type { CanvasElement } from "@/types";

export default function DraggableAsset({
  element,
  isSelected,
  onSelect,
  onChange
}: {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasElement>) => void;
}) {
  const [img] = useImage(element.src ?? "", "anonymous");
  const shapeRef = useRef<Konva.Image>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      shapeRef.current.moveToTop();
    }
  }, [isSelected]);

  return (
    <KonvaImage
      ref={shapeRef}
      id={element.id}
      image={img}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY()
        });
      }}
    />
  );
}
