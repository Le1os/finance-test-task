import { Home } from '../pages/Home';
import { Favorites } from '../pages/Favorites';

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/favorites',
    element: <Favorites />,
  },
];
