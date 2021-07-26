import test from 'ava';

import { fightDragons } from '../src/magic/index.js';

test('can battle the dragon', t => {
  t.notThrows(() => fightDragons());
});
