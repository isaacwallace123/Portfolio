export const Routes = [
  { key: 'home', label: 'Home', path: '/', end: true },
  //{ key: 'projects', label: 'Projects', path: '/projects' },
  { key: 'metrics', label: 'Metrics', path: '/metrics' },
]

export type RouteKey = (typeof Routes)[number]['key']

export const RoutePaths = Routes.reduce((acc, route) => {
  acc[route.key] = route.path
  return acc
}, {} as Record<RouteKey, string>)