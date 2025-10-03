import { BufferGeometry, Quaternion, Vector3 } from 'three';

export function latLonToVec3(
  latDeg: number,
  lonDeg: number,
  r: number
): Vector3 {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 180) * (Math.PI / 180);

  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new Vector3(x, y, z);
}

export function buildParallel(lat: number, radius: number, step = 2) {
  const pts: Vector3[] = [];

  for (let lon = -180; lon <= 180; lon += step)
    pts.push(latLonToVec3(lat, lon, radius));

  return new BufferGeometry().setFromPoints(pts);
}

export function buildMeridian(lon: number, radius: number, step = 2) {
  const pts: Vector3[] = [];

  for (let lat = -90; lat <= 90; lat += step)
    pts.push(latLonToVec3(lat, lon, radius));

  return new BufferGeometry().setFromPoints(pts);
}

export function cameraDistanceForRadius(
  radius: number,
  fovDeg: number,
  padding = 1.05
) {
  const fov = (fovDeg * Math.PI) / 180;

  return (radius / Math.tan(fov / 2)) * padding;
}

export function arcGeometry(
  aTuple: [number, number, number],
  bTuple: [number, number, number],
  radius: number,
  segments = 24
) {
  const a = new Vector3(...aTuple).normalize();
  const b = new Vector3(...bTuple).normalize();

  const dot = Math.min(1, Math.max(-1, a.dot(b)));
  const angle = Math.acos(dot);

  let axis = new Vector3().crossVectors(a, b);

  if (axis.lengthSq() < 1e-10) {
    axis = new Vector3(1, 0, 0).cross(a);

    if (axis.lengthSq() < 1e-10) axis = new Vector3(0, 1, 0).cross(a);
  }

  axis.normalize();

  const quat = new Quaternion();
  const points: Vector3[] = [];

  if (angle < 1e-6) {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      points.push(a.clone().lerp(b, t).normalize().multiplyScalar(radius));
    }
  } else {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      quat.setFromAxisAngle(axis, t * angle);

      points.push(a.clone().applyQuaternion(quat).multiplyScalar(radius));
    }
  }

  return new BufferGeometry().setFromPoints(points);
}
