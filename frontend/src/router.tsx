import { createBrowserRouter } from 'react-router-dom';

import { App } from '@/components/layout/App';

import { RoutePaths } from '@/shared/config/Routes';
import ErrorBoundary from '@/shared/errors/ErrorBoundary';

import Home from './pages/home/Home';
import Projects from './pages/projects/Projects';

const router = createBrowserRouter([
  {
    path: RoutePaths.home,
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: RoutePaths.projects, element: <Projects /> },
    ],
  },
]);

export default router;
