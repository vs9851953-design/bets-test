import type Konva from "konva";

/**
 * Exporta o Stage do Konva como PNG na resolução original do template,
 * preservando transparência. pixelRatio=1 porque o Stage já é criado
 * no tamanho real do template (ex: 1080x1350) — não escalamos o canvas
 * na tela, só o container CSS, então a exportação sai fiel ao PSD original.
 */
export function exportStageToPng(stage: Konva.Stage, fileName: string) {
  const dataUrl = stage.toDataURL({
    mimeType: "image/png",
    pixelRatio: 1,
    quality: 1
  });

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
