/**
 * @providesModule Router
 * @flow
 */

import {createRouter} from '@exponent/ex-navigation';

import Home from 'Home';
import Main from 'Main';

const router = createRouter(() => ({
  home: () => Home,
  main: () => Main
}));

export default router;
