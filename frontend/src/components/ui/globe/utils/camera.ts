export function cameraDistanceForSphere(
  sphereRadius: number,
  fovDeg: number,
  padding = 1.15
) {
  const fov = (fovDeg * Math.PI) / 180;
  return (sphereRadius / Math.tan(fov / 2)) * padding;
}

export function suggestedNearFar(
  sphereRadius: number,
  distance: number
): { near: number; far: number } {
  const near = 0.01;

  const far = distance + sphereRadius * 10;

  return { near, far };
}
