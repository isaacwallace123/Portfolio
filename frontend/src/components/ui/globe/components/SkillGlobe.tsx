import { OrbitControls, TrackballControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { Suspense, useRef } from 'react';
import type { Group } from 'three';

import IconBillboard from './IconBillboard';

import { useGrid } from '../hooks/useGrid';
import { useSkillPoints } from '../hooks/useSkillPoints';
import { useUniformPoints } from '../hooks/useUniformPoints';
import {
  ConnectionMode,
  EdgeStyle,
  LayoutMode,
  type GridSpec,
  type SkillItem,
  type SkillPoint,
} from '../types';
import { cameraDistanceForSphere, suggestedNearFar } from '../utils/camera';
import { readCssRgbVarToHex } from '../utils/color';
import Connections from './Connections';
import DotLabel from './DotLabel';
import WireGrid from './WireGrid';

type Props = {
  skills: SkillItem[];
  grid?: GridSpec;
  height?: number;
  className?: string;
  rotateAuto?: boolean;
  connect?: ConnectionMode;
  neighbors?: number;
  showGrid?: boolean;
  arcLift?: number;
  lineColor?: string;
  labelFontUrl?: string;
  lineOpacity?: number;
  dotRadius?: number;
  fontSize?: number;
  radiusScale?: number;
  cameraPadding?: number;
  layout?: LayoutMode;
  showDots?: boolean;
  connectionsColor?: string;
  connectionsColorVar?: string;
  getConnectionColor?: (a: SkillPoint, b: SkillPoint) => string;
  edgeStyle?: EdgeStyle;
  freeSpin?: boolean;
  showIcons?: boolean;
  iconSize?: number;
  iconOffset?: number;
  showLabels?: boolean;
  dimLabelWhenIcon?: boolean;
};

function AutoRotateGroup({
  enabled,
  speed = 0.6,
  children,
}: {
  enabled: boolean;
  speed?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<Group | null>(null);
  useFrame((_, dt) => {
    if (enabled && ref.current) ref.current.rotation.y += speed * dt;
  });
  return <group ref={ref}>{children}</group>;
}

export default function SkillGridGlobe({
  skills,
  grid,
  height = 460,
  className,
  rotateAuto = false,
  connect = ConnectionMode.Nearest,
  neighbors = 4,
  showGrid = false,
  arcLift = 0.08,
  lineColor = '#3b82f6',
  labelFontUrl,
  lineOpacity = 0.35,
  dotRadius = 0.03,
  fontSize = 0.1,
  radiusScale = 0.92,
  cameraPadding = 1.18,
  layout = LayoutMode.Uniform,
  showDots = true,
  connectionsColor,
  connectionsColorVar,
  getConnectionColor,
  edgeStyle = EdgeStyle.Arc,
  freeSpin = false,
  showIcons = false,
  iconSize = 0.22,
  iconOffset = 0.16,
  showLabels = true,
  dimLabelWhenIcon = true,
}: Props) {
  const connColor = connectionsColorVar
    ? readCssRgbVarToHex(connectionsColorVar, connectionsColor ?? lineColor)
    : (connectionsColor ?? lineColor);

  const baseRadius = grid?.radius ?? 1.6;
  const radius = baseRadius * radiusScale;

  const latStep = grid?.latStep ?? 30;
  const lonStep = grid?.lonStep ?? 30;
  const latExtent = grid?.latExtent ?? 60;

  const fov = 45;
  const distance = cameraDistanceForSphere(
    radius + arcLift,
    fov,
    cameraPadding
  );
  const { near, far } = suggestedNearFar(radius + arcLift, distance);

  const gridData = useGrid(latExtent, latStep, lonStep, radius);
  const gridMapped = useSkillPoints(gridData.gridPoints, skills);
  const uniform = useUniformPoints(skills, radius);

  const isGridLayout = layout === LayoutMode.Grid;
  const skillPoints = isGridLayout
    ? gridMapped.skillPoints
    : uniform.skillPoints;
  const occupied = isGridLayout ? gridMapped.occupied : undefined;
  const latCount = isGridLayout ? gridData.latCount : 0;
  const lonCount = isGridLayout ? gridData.lonCount : 0;

  return (
    <div className={className} style={{ height }}>
      <Canvas
        camera={{ position: [0, 0, distance], fov, near, far }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={0.9} />

        <AutoRotateGroup enabled={freeSpin && rotateAuto} speed={0.6}>
          <Suspense fallback={null}>
            {showGrid && isGridLayout && (
              <WireGrid
                radius={radius}
                latStep={latStep}
                lonStep={lonStep}
                latExtent={latExtent}
              />
            )}

            <group>
              {skillPoints.map(({ pos, skill }) => {
                const iconUrl = showIcons ? skill.icon : undefined;
                const hasIcon = Boolean(iconUrl);

                return (
                  <group key={`${skill.label}-${pos.join(',')}`}>
                    {hasIcon && (
                      <IconBillboard
                        position={pos}
                        url={iconUrl!}
                        size={iconSize}
                        offset={iconOffset}
                        opacity={1}
                      />
                    )}

                    {showLabels && (
                      <DotLabel
                        position={pos}
                        label={skill.label}
                        color={skill.color}
                        dotRadius={hasIcon ? 0 : dotRadius}
                        fontSize={
                          hasIcon && dimLabelWhenIcon
                            ? fontSize * 0.9
                            : fontSize
                        }
                        showDot={showDots && !hasIcon}
                        fontUrl={labelFontUrl}
                        radialOffset={hasIcon ? iconOffset + 0.03 : 0}
                      />
                    )}
                  </group>
                );
              })}
            </group>

            <Connections
              skillPoints={skillPoints}
              occupied={occupied}
              latCount={latCount}
              lonCount={lonCount}
              radius={radius}
              mode={connect}
              neighbors={neighbors}
              arcLift={arcLift}
              lineColor={connColor}
              lineOpacity={lineOpacity}
              colorFn={getConnectionColor}
              edgeStyle={edgeStyle}
            />
          </Suspense>
        </AutoRotateGroup>

        {freeSpin ? (
          <TrackballControls
            makeDefault
            noZoom
            noPan
            rotateSpeed={0.85}
            dynamicDampingFactor={0.15}
            staticMoving={false}
          />
        ) : (
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            minDistance={distance}
            maxDistance={distance}
            autoRotate={rotateAuto}
            autoRotateSpeed={0.6}
          />
        )}
      </Canvas>
    </div>
  );
}
