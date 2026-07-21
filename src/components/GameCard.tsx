"use client";

import { Group, Image as KonvaImage, Text } from "react-konva";
import useImage from "use-image";
import type { GameData, GameSlotLayout } from "@/types";

function TeamLogo({
  src,
  box
}: {
  src: string | undefined;
  box: { x: number; y: number; width: number; height: number };
}) {
  const [img] = useImage(src ?? "", "anonymous");
  if (!src) return null;
  return (
    <KonvaImage
      image={img}
      x={box.x}
      y={box.y}
      width={box.width}
      height={box.height}
    />
  );
}

export default function GameCard({
  game,
  layout,
  homeLogoSrc,
  awayLogoSrc
}: {
  game: GameData;
  layout: GameSlotLayout;
  homeLogoSrc?: string;
  awayLogoSrc?: string;
}) {
  return (
    <Group x={layout.x} y={layout.y} width={layout.width} height={layout.height}>
      <Text
        text={game.league}
        x={layout.league.x}
        y={layout.league.y}
        fontSize={layout.league.fontSize}
        fontFamily="var(--font-montserrat)"
        fill="#FFFFFF"
      />
      <Text
        text={game.time}
        x={layout.time.x}
        y={layout.time.y}
        fontSize={layout.time.fontSize}
        fontFamily="var(--font-montserrat)"
        fill="#FFD100"
      />
      <TeamLogo src={homeLogoSrc} box={layout.homeLogo} />
      <TeamLogo src={awayLogoSrc} box={layout.awayLogo} />
      <Text
        text={game.homeTeam}
        x={layout.homeName.x}
        y={layout.homeName.y}
        fontSize={layout.homeName.fontSize}
        fontFamily="var(--font-montserrat)"
        fill="#FFFFFF"
        width={200}
      />
      <Text
        text={game.awayTeam}
        x={layout.awayName.x}
        y={layout.awayName.y}
        fontSize={layout.awayName.fontSize}
        fontFamily="var(--font-montserrat)"
        fill="#FFFFFF"
        width={200}
        align="right"
      />
      <Text
        text={game.homeOdd && game.awayOdd ? `${game.homeOdd}` : ""}
        x={layout.odd.x}
        y={layout.odd.y}
        fontSize={layout.odd.fontSize}
        fontFamily="var(--font-bebas)"
        fill="#FFD100"
      />
    </Group>
  );
}
