/** PNG illustrations for theory lessons (assets/theory/*.png).
 *  Add a require line here when you add a new image (e.g. t3p1.png → key 't3p1'). */
export const THEORY_IMAGE_MODULES: Record<string, number> = {
  t1p1: require('../../../assets/theory/t1p1.png'),
  t1p2: require('../../../assets/theory/t1p2.png'),
  t2p1: require('../../../assets/theory/t2p1.png'),
  t2p2: require('../../../assets/theory/t2p2.png'),
  t3p1: require('../../../assets/theory/t3p1.png'),
  t3p2: require('../../../assets/theory/t3p2.png'),
  t4p1: require('../../../assets/theory/t4p1.png'),
  t4p2: require('../../../assets/theory/t4p2.png'),
  t5p1: require('../../../assets/theory/t5p1.png'),
  t5p2: require('../../../assets/theory/t5p2.png'),
  t6p1: require('../../../assets/theory/t6p1.png'),
  t6p2: require('../../../assets/theory/t6p2.png'),
};

export function getTheoryImageModule(key: string): number | undefined {
  return THEORY_IMAGE_MODULES[key];
}
