import { makeQuestion, makeRound, isCorrect } from '../exercise';
import {
  calculateErrorRate,
  calculateStars,
  getPedagogicalMessages,
  isLevelPassed,
  summarizeRound,
} from '../scoring';
import { LEVELS, getLevel } from '../../data/levels';
import { isNatural, midiToNote } from '../../domain/notes';
import { positionToMidi } from '../../domain/fretboard';

describe('levels data', () => {
  it('every level has natural-note positions only', () => {
    for (const level of LEVELS) {
      expect(level.positions.length).toBeGreaterThan(0);
      for (const pos of level.positions) {
        const note = midiToNote(positionToMidi(pos));
        expect(isNatural(note)).toBe(true);
        expect(level.strings).toContain(pos.string);
        expect(pos.fret).toBeLessThanOrEqual(level.maxFret);
      }
    }
  });

  it('orders are unique and sequential', () => {
    const orders = LEVELS.map((l) => l.order).sort((a, b) => a - b);
    expect(orders).toEqual(orders.map((_, i) => i + 1));
  });
});

describe('exercise engine', () => {
  const level = getLevel('l1-string1')!;

  it('generates questions from the level pool', () => {
    const q = makeQuestion(level);
    expect(level.positions).toContainEqual(q.position);
    expect(q.midi).toBe(positionToMidi(q.position));
  });

  it('avoids repeating the previous question', () => {
    const first = makeQuestion(level);
    for (let i = 0; i < 30; i++) {
      const next = makeQuestion(level, first);
      expect(next.position).not.toEqual(first.position);
    }
  });

  it('builds a round of the configured size', () => {
    const round = makeRound(level);
    expect(round).toHaveLength(level.questionsPerRound);
  });

  it('validates the exact target position', () => {
    const q = makeQuestion(level);
    expect(isCorrect(q, q.position)).toBe(true);
    expect(isCorrect(q, { string: q.position.string, fret: q.position.fret + 1 })).toBe(false);
  });
});

describe('scoring', () => {
  it('computes error rate', () => {
    expect(calculateErrorRate(10, 10)).toBe(0);
    expect(calculateErrorRate(9, 10)).toBeCloseTo(0.1);
    expect(calculateErrorRate(8, 10)).toBeCloseTo(0.2);
  });

  it('awards stars by error and response time thresholds', () => {
    expect(calculateStars(0, 900)).toBe(3);
    expect(calculateStars(0.1, 1400)).toBe(2);
    expect(calculateStars(0.2, 2000)).toBe(1);
    expect(calculateStars(0.2, 2100)).toBe(0);
    expect(calculateStars(0.21, 1500)).toBe(0);
  });

  it('checks level pass gates', () => {
    expect(isLevelPassed(0.2, 2000)).toBe(true);
    expect(isLevelPassed(0.21, 1500)).toBe(false);
    expect(isLevelPassed(0.1, 2200)).toBe(false);
  });

  it('summarizes a round', () => {
    const result = summarizeRound(9, 10, 42000, 1300);
    expect(result.accuracy).toBeCloseTo(0.9);
    expect(result.errorRate).toBeCloseTo(0.1);
    expect(result.stars).toBe(2);
    expect(result.passed).toBe(true);
    expect(result.timeMs).toBe(42000);
    expect(result.avgResponseMs).toBe(1300);
  });

  it('returns pedagogical messages when level is not passed', () => {
    const result = summarizeRound(6, 10, 42000, 2600);
    expect(result.passed).toBe(false);
    expect(result.feedbackMessages.length).toBeGreaterThan(0);
    const messages = getPedagogicalMessages(0.4, 2600).join(' ');
    expect(messages).toContain('errores');
    expect(messages).toContain('media');
  });
});
