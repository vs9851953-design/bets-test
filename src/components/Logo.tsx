"use client";

import DraggableAsset from "./DraggableAsset";
import type { CanvasElement } from "@/types";

export default function Logo(props: {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasElement>) => void;
}) {
  return <DraggableAsset {...props} />;
}
