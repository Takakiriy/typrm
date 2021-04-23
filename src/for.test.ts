const  c = 2;

test.each`
    a    | b    | expected  | comment
    ${1} | ${1} | ${2} | ${'＄で値を囲みます'}
    ${1} | ${c} | ${3} | ${'変数の参照もできます'}
    ${2} | ${3} | ${5} | ${''}
`("returns $expected when $a is added $b", ({ a, b, expected }) => {
    expect( a + b ).toBe( expected );
});