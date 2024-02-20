import { globalStyle, style } from '@vanilla-extract/css';

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = (px: number) => `${round(px / 16)}rem`;
const em = (px: number, base: number) => `${round(px / base)}em`;

/**
 * base: {
 *     css: [
 *       {
 *         fontSize: rem(16),
 *         lineHeight: round(28 / 16),
 *         p: {
 *           marginTop: em(20, 16),
 *           marginBottom: em(20, 16),
 *         },
 *         '[class~="lead"]': {
 *           fontSize: em(20, 16),
 *           lineHeight: round(32 / 20),
 *           marginTop: em(24, 20),
 *           marginBottom: em(24, 20),
 *         },
 *         blockquote: {
 *           marginTop: em(32, 20),
 *           marginBottom: em(32, 20),
 *           paddingLeft: em(20, 20),
 *         },
 *         h1: {
 *           fontSize: em(36, 16),
 *           marginTop: '0',
 *           marginBottom: em(32, 36),
 *           lineHeight: round(40 / 36),
 *         },
 *         h2: {
 *           fontSize: em(24, 16),
 *           marginTop: em(48, 24),
 *           marginBottom: em(24, 24),
 *           lineHeight: round(32 / 24),
 *         },
 *         h3: {
 *           fontSize: em(20, 16),
 *           marginTop: em(32, 20),
 *           marginBottom: em(12, 20),
 *           lineHeight: round(32 / 20),
 *         },
 *         h4: {
 *           marginTop: em(24, 16),
 *           marginBottom: em(8, 16),
 *           lineHeight: round(24 / 16),
 *         },
 *         img: {
 *           marginTop: em(32, 16),
 *           marginBottom: em(32, 16),
 *         },
 *         picture: {
 *           marginTop: em(32, 16),
 *           marginBottom: em(32, 16),
 *         },
 *         'picture > img': {
 *           marginTop: '0',
 *           marginBottom: '0',
 *         },
 *         video: {
 *           marginTop: em(32, 16),
 *           marginBottom: em(32, 16),
 *         },
 *         kbd: {
 *           fontSize: em(14, 16),
 *           borderRadius: rem(5),
 *           paddingTop: em(3, 16),
 *           paddingRight: em(6, 16),
 *           paddingBottom: em(3, 16),
 *           paddingLeft: em(6, 16),
 *         },
 *         code: {
 *           fontSize: em(14, 16),
 *         },
 *         'h2 code': {
 *           fontSize: em(21, 24),
 *         },
 *         'h3 code': {
 *           fontSize: em(18, 20),
 *         },
 *         pre: {
 *           fontSize: em(14, 16),
 *           lineHeight: round(24 / 14),
 *           marginTop: em(24, 14),
 *           marginBottom: em(24, 14),
 *           borderRadius: rem(6),
 *           paddingTop: em(12, 14),
 *           paddingRight: em(16, 14),
 *           paddingBottom: em(12, 14),
 *           paddingLeft: em(16, 14),
 *         },
 *         ol: {
 *           marginTop: em(20, 16),
 *           marginBottom: em(20, 16),
 *           paddingLeft: em(26, 16),
 *         },
 *         ul: {
 *           marginTop: em(20, 16),
 *           marginBottom: em(20, 16),
 *           paddingLeft: em(26, 16),
 *         },
 *         li: {
 *           marginTop: em(8, 16),
 *           marginBottom: em(8, 16),
 *         },
 *         'ol > li': {
 *           paddingLeft: em(6, 16),
 *         },
 *         'ul > li': {
 *           paddingLeft: em(6, 16),
 *         },
 *         '> ul > li p': {
 *           marginTop: em(12, 16),
 *           marginBottom: em(12, 16),
 *         },
 *         '> ul > li > *:first-child': {
 *           marginTop: em(20, 16),
 *         },
 *         '> ul > li > *:last-child': {
 *           marginBottom: em(20, 16),
 *         },
 *         '> ol > li > *:first-child': {
 *           marginTop: em(20, 16),
 *         },
 *         '> ol > li > *:last-child': {
 *           marginBottom: em(20, 16),
 *         },
 *         'ul ul, ul ol, ol ul, ol ol': {
 *           marginTop: em(12, 16),
 *           marginBottom: em(12, 16),
 *         },
 *         dl: {
 *           marginTop: em(20, 16),
 *           marginBottom: em(20, 16),
 *         },
 *         dt: {
 *           marginTop: em(20, 16),
 *         },
 *         dd: {
 *           marginTop: em(8, 16),
 *           paddingLeft: em(26, 16),
 *         },
 *         hr: {
 *           marginTop: em(48, 16),
 *           marginBottom: em(48, 16),
 *         },
 *         'hr + *': {
 *           marginTop: '0',
 *         },
 *         'h2 + *': {
 *           marginTop: '0',
 *         },
 *         'h3 + *': {
 *           marginTop: '0',
 *         },
 *         'h4 + *': {
 *           marginTop: '0',
 *         },
 *         table: {
 *           fontSize: em(14, 16),
 *           lineHeight: round(24 / 14),
 *         },
 *         'thead th': {
 *           paddingRight: em(8, 14),
 *           paddingBottom: em(8, 14),
 *           paddingLeft: em(8, 14),
 *         },
 *         'thead th:first-child': {
 *           paddingLeft: '0',
 *         },
 *         'thead th:last-child': {
 *           paddingRight: '0',
 *         },
 *         'tbody td, tfoot td': {
 *           paddingTop: em(8, 14),
 *           paddingRight: em(8, 14),
 *           paddingBottom: em(8, 14),
 *           paddingLeft: em(8, 14),
 *         },
 *         'tbody td:first-child, tfoot td:first-child': {
 *           paddingLeft: '0',
 *         },
 *         'tbody td:last-child, tfoot td:last-child': {
 *           paddingRight: '0',
 *         },
 *         figure: {
 *           marginTop: em(32, 16),
 *           marginBottom: em(32, 16),
 *         },
 *         'figure > *': {
 *           marginTop: '0',
 *           marginBottom: '0',
 *         },
 *         figcaption: {
 *           fontSize: em(14, 16),
 *           lineHeight: round(20 / 14),
 *           marginTop: em(12, 14),
 *         },
 *       },
 *       {
 *         '> :first-child': {
 *           marginTop: '0',
 *         },
 *         '> :last-child': {
 *           marginBottom: '0',
 *         },
 *       },
 *     ],
 *   },
 */

export const prose = style({});
globalStyle(`${prose} p`, {
  marginTop: em(20, 16),
  marginBottom: em(20, 16),
});

globalStyle(`${prose} [class~="lead"]`, {
  fontSize: em(20, 16),
  lineHeight: round(32 / 20),
  marginTop: em(24, 20),
  marginBottom: em(24, 20),
});

globalStyle(`${prose} blockquote`, {
  marginTop: em(32, 20),
  marginBottom: em(32, 20),
  paddingLeft: em(20, 20),
});

globalStyle(`${prose} h1`, {
  fontSize: em(36, 16),
  marginTop: '0',
  marginBottom: em(32, 36),
  lineHeight: round(40 / 36),
});

globalStyle(`${prose} h2`, {
  fontSize: em(24, 16),
  marginTop: em(48, 24),
  marginBottom: em(24, 24),
  lineHeight: round(32 / 24),
});

globalStyle(`${prose} h3`, {
  fontSize: em(20, 16),
  marginTop: em(32, 20),
  marginBottom: em(12, 20),
  lineHeight: round(32 / 20),
});

globalStyle(`${prose} h4`, {
  marginTop: em(24, 16),
  marginBottom: em(8, 16),
  lineHeight: round(24 / 16),
});

globalStyle(`${prose} img`, {
  marginTop: em(32, 16),
  marginBottom: em(32, 16),
});

globalStyle(`${prose} picture`, {
  marginTop: em(32, 16),
  marginBottom: em(32, 16),
});

globalStyle(`${prose} picture > img`, {
  marginTop: '0',
  marginBottom: '0',
});

globalStyle(`${prose} video`, {
  marginTop: em(32, 16),
  marginBottom: em(32, 16),
});

globalStyle(`${prose} kbd`, {
  fontSize: em(14, 16),
  borderRadius: rem(5),
  paddingTop: em(3, 16),
  paddingRight: em(6, 16),
  paddingBottom: em(3, 16),
  paddingLeft: em(6, 16),
});

globalStyle(`${prose} code`, {
  fontSize: em(14, 16),
});

globalStyle(`${prose} h2 code`, {
  fontSize: em(21, 24),
});

globalStyle(`${prose} h3 code`, {
  fontSize: em(18, 20),
});

globalStyle(`${prose} pre`, {
  fontSize: em(14, 16),
  lineHeight: round(24 / 14),
  marginTop: em(24, 14),
  marginBottom: em(24, 14),
  borderRadius: rem(6),
  paddingTop: em(12, 14),
  paddingRight: em(16, 14),
  paddingBottom: em(12, 14),
  paddingLeft: em(16, 14),
});

globalStyle(`${prose} ol`, {
  marginTop: em(20, 16),
  marginBottom: em(20, 16),
  paddingLeft: em(26, 16),
});

globalStyle(`${prose} ul`, {
  marginTop: em(20, 16),
  marginBottom: em(20, 16),
  paddingLeft: em(26, 16),
});

globalStyle(`${prose} li`, {
  marginTop: em(8, 16),
  marginBottom: em(8, 16),
});

globalStyle(`${prose} ol > li`, {
  paddingLeft: em(6, 16),
});

globalStyle(`${prose} ul > li`, {
  paddingLeft: em(6, 16),
});

globalStyle(`${prose} > ul > li p`, {
  marginTop: em(12, 16),
  marginBottom: em(12, 16),
});

globalStyle(`${prose} > ul > li > *:first-child`, {
  marginTop: em(20, 16),
});

globalStyle(`${prose} > ul > li > *:last-child`, {
  marginBottom: em(20, 16),
});

globalStyle(`${prose} > ol > li > *:first-child`, {
  marginTop: em(20, 16),
});

globalStyle(`${prose} > ol > li > *:last-child`, {
  marginBottom: em(20, 16),
});

globalStyle(`${prose} ul ul, ul ol, ol ul, ol ol`, {
  marginTop: em(12, 16),
  marginBottom: em(12, 16),
});

globalStyle(`${prose} dl`, {
  marginTop: em(20, 16),
  marginBottom: em(20, 16),
});

globalStyle(`${prose} dt`, {
  marginTop: em(20, 16),
});

globalStyle(`${prose} dd`, {
  marginTop: em(8, 16),
  paddingLeft: em(26, 16),
});

globalStyle(`${prose} hr`, {
  marginTop: em(48, 16),
  marginBottom: em(48, 16),
});

globalStyle(`${prose} hr + *`, {
  marginTop: '0',
});

globalStyle(`${prose} h2 + *`, {
  marginTop: '0',
});

globalStyle(`${prose} h3 + *`, {
  marginTop: '0',
});

globalStyle(`${prose} h4 + *`, {
  marginTop: '0',
});

globalStyle(`${prose} table`, {
  fontSize: em(14, 16),
  lineHeight: round(24 / 14),
});

globalStyle(`${prose} thead th`, {
  paddingRight: em(8, 14),
  paddingBottom: em(8, 14),
  paddingLeft: em(8, 14),
});

globalStyle(`${prose} thead th:first-child`, {
  paddingLeft: '0',
});

globalStyle(`${prose} thead th:last-child`, {
  paddingRight: '0',
});

globalStyle(`${prose} tbody td, tfoot td`, {
  paddingTop: em(8, 14),
  paddingRight: em(8, 14),
  paddingBottom: em(8, 14),
  paddingLeft: em(8, 14),
});

globalStyle(`${prose} tbody td:first-child, tfoot td:first-child`, {
  paddingLeft: '0',
});

globalStyle(`${prose} tbody td:last-child, tfoot td:last-child`, {
  paddingRight: '0',
});

globalStyle(`${prose} figure`, {
  marginTop: em(32, 16),
  marginBottom: em(32, 16),
});

globalStyle(`${prose} figure > *`, {
  marginTop: '0',
  marginBottom: '0',
});

globalStyle(`${prose} figcaption`, {
  fontSize: em(14, 16),
  lineHeight: round(20 / 14),
  marginTop: em(12, 14),
});

globalStyle(`${prose} > :first-child`, {
  marginTop: '0',
});

globalStyle(`${prose} > :last-child`, {
  marginBottom: '0',
});
