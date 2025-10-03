import { OrbitControls, TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';

import Connections from './Connections';
import DotLabel from './DotLabel';
import IconBillboard from './IconBillboard';
import WireGrid from './WireGrid';
import AutoRotateGroup from '../core/AutoRotateGroup';

import { useContainerSize } from '../hooks/useContainerSize';
import { useGlobeData } from '../hooks/useGlobeData';
import { useGlobeResponsive } from '../hooks/useGlobeResponsive';

import {
  ConnectionMode,
  EdgeStyle,
  LayoutMode,
  type GridSpec,
  type SkillItem,
  type SkillPoint,
} from '../types';
import { distanceForSphereFit, suggestedNearFar } from '../utils/camera';
import { readCssRgbVarToHex } from '../utils/color';

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
  edgeStyle?: EdgeStyle;

  // visuals
  lineColor?: string;
  connectionsColor?: string;
  connectionsColorVar?: string;
  lineOpacity?: number;

  // labels / dots
  labelFontUrl?: string;
  dotRadius?: number;
  fontSize?: number;
  showDots?: boolean;
  showLabels?: boolean;

  // layout / camera
  layout?: LayoutMode;
  radiusScale?: number;
  cameraPadding?: number;

  // interaction
  freeSpin?: boolean;

  // icons
  showIcons?: boolean;
  iconSize?: number;
  iconOffset?: number;
  dimLabelWhenIcon?: boolean;

  // dynamic color fn
  getConnectionColor?: (a: SkillPoint, b: SkillPoint) => string;
};

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
  edgeStyle = EdgeStyle.Arc,

  lineColor = '#3b82f6',
  connectionsColor,
  connectionsColorVar,
  lineOpacity = 0.35,

  labelFontUrl,
  dotRadius = 0.03,
  fontSize = 0.1,
  showDots = true,
  showLabels = true,

  layout = LayoutMode.Uniform,
  radiusScale = 0.92,
  cameraPadding = 1.225,

  freeSpin = false,

  showIcons = false,
  iconSize = 0.22,
  iconOffset = 0.16,
  dimLabelWhenIcon = true,

  getConnectionColor,
}: Props) {
  const R = useGlobeResponsive({
    height,
    radiusScale,
    cameraPadding,
    iconSize,
    iconOffset,
    fontSize,
    dotRadius,
    neighbors,
    lineOpacity,
  });

  const { ref: wrapRef, width: wrapW } = useContainerSize<HTMLDivElement>();

  const maxW = R.isMobile ? '92vw' : 'min(92vw, 740px)';
  const mHeight = R.height;
  const aspect = useMemo(
    () => Math.max(0.5, wrapW / mHeight),
    [wrapW, mHeight]
  );

  const connColor = connectionsColorVar
    ? readCssRgbVarToHex(connectionsColorVar, connectionsColor ?? lineColor)
    : (connectionsColor ?? lineColor);

  const baseRadius = grid?.radius ?? 1.6;
  const radius = baseRadius * R.radiusScale;

  const latStep = grid?.latStep ?? 30;
  const lonStep = grid?.lonStep ?? 30;
  const latExtent = grid?.latExtent ?? 60;

  const { skillPoints, occupied, latCount, lonCount } = useGlobeData({
    layout,
    latExtent,
    latStep,
    lonStep,
    radius,
    skills,
  });
  
  const fov = 45;
  
  const distance = distanceForSphereFit({
    radius: radius + arcLift,
    fovDeg: fov,
    aspect,
    padding: R.cameraPadding,
  });

  const { near, far } = suggestedNearFar(radius + arcLift, distance);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        height: mHeight,
        width: '100%',
        maxWidth: maxW as string,
        marginInline: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, distance], fov, near, far }}
        dpr={R.dpr}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={0.9} />

        <AutoRotateGroup enabled={freeSpin && rotateAuto} speed={0.6}>
          <Suspense fallback={null}>
            {showGrid && layout === LayoutMode.Grid && (
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
                        size={R.iconSize}
                        offset={R.iconOffset}
                        opacity={1}
                      />
                    )}

                    {showLabels && (
                      <DotLabel
                        position={pos}
                        label={skill.label}
                        color={skill.color}
                        dotRadius={hasIcon ? 0 : R.dotRadius}
                        fontSize={
                          hasIcon && dimLabelWhenIcon
                            ? R.fontSize * 0.9
                            : R.fontSize
                        }
                        showDot={showDots && !hasIcon}
                        fontUrl={labelFontUrl}
                        radialOffset={hasIcon ? R.iconOffset + 0.03 : 0}
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
              neighbors={R.neighbors}
              arcLift={arcLift}
              lineColor={connColor}
              lineOpacity={R.lineOpacity}
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
            rotateSpeed={R.isMobile ? 0.65 : 0.85}
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
