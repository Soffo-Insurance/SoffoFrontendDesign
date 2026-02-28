/**
 * Re-export @blocksuite/icons/lit and alias the typo used by @blocksuite/affine-components:
 * CheckBoxCkeckSolidIcon -> CheckBoxCheckSolidIcon
 * Use relative path to avoid alias loop.
 */
import * as icons from '../node_modules/@blocksuite/icons/dist/lit.mjs'
export * from '../node_modules/@blocksuite/icons/dist/lit.mjs'
export const CheckBoxCkeckSolidIcon = icons.CheckBoxCheckSolidIcon
