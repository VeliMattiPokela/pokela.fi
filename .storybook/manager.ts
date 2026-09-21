import { addons } from 'storybook/manager-api';
import { lightTheme } from './theme';

/* Sivupalkki ja työkalurivi samoilla tokeneilla kuin sivusto. */
addons.setConfig({
  theme: lightTheme,
  sidebar: { showRoots: true },
});
