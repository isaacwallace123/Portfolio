import { App } from '@/components/layout/App';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/home/Home';
import Projects from './pages/projects/Projects';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    //errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
    ],
  },
]);
