export function distanceForSphereFit({
  radius,
  fovDeg,
  aspect,
  padding = 1.0,
}: {
  radius: number;
  fovDeg: number;
  aspect: number;
  padding?: number;
}) {
  const vFOV = (fovDeg * Math.PI) / 180;
  const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * aspect);

  const dv = (radius * padding) / Math.tan(vFOV / 2);
  const dh = (radius * padding) / Math.tan(hFOV / 2);

  return Math.max(dv, dh);
}

export function suggestedNearFar(sphereRadius: number, cameraDistance: number) {
  const span = sphereRadius * 2.2;

  const near = Math.max(0.01, cameraDistance - span);

  const far = Math.max(near + 1, cameraDistance + span);

  return { near, far };
}

export function cameraDistanceForSphere(
  radiusOrOpts:
    | number
    | { radius: number; fovDeg: number; aspect: number; padding?: number },
  fovDeg?: number,
  padding = 1.0
) {
  if (typeof radiusOrOpts === 'object') {
    const { radius, fovDeg: f, aspect, padding: p = 1.0 } = radiusOrOpts;

    return distanceForSphereFit({ radius, fovDeg: f, aspect, padding: p });
  }

  return distanceForSphereFit({
    radius: radiusOrOpts,
    fovDeg: fovDeg as number,
    aspect: 1,
    padding,
  });
}
