import { Stage } from '../types';
import { block00Welcome } from './blocks/block00-welcome';
import { block01String1 } from './blocks/block01-string1';
import { block02String2 } from './blocks/block02-string2';
import { block03Strings12 } from './blocks/block03-strings12';
import { block04String3 } from './blocks/block04-string3';
import { block05Strings123 } from './blocks/block05-strings123';
import { block06String4 } from './blocks/block06-string4';
import { block07Strings15 } from './blocks/block07-strings15';
import { block08String6 } from './blocks/block08-string6';
import { block09Full } from './blocks/block09-full';

export const stage1: Stage = {
  id: 'stage-1',
  title: 'Descubrir la guitarra',
  description: 'Aprende a leer y localizar todas las notas naturales en primera posición.',
  order: 1,
  blocks: [
    block00Welcome,
    block01String1,
    block02String2,
    block03Strings12,
    block04String3,
    block05Strings123,
    block06String4,
    block07Strings15,
    block08String6,
    block09Full,
  ],
};

export function getStage1BlockById(blockId: string) {
  return stage1.blocks.find((b) => b.id === blockId);
}

export function getStage1LevelById(levelId: string) {
  for (const block of stage1.blocks) {
    const level = block.levels.find((l) => l.id === levelId);
    if (level) return { block, level };
  }
  return undefined;
}

export function flattenStage1Levels() {
  return stage1.blocks.flatMap((b) => b.levels);
}

export function getStage1TheoryById(theoryId: string) {
  for (const block of stage1.blocks) {
    const theory = block.theory.find((t) => t.id === theoryId);
    if (theory) return theory;
  }
  return undefined;
}
