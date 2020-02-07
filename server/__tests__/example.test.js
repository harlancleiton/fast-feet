function sum(a, b) {
  return a + b;
}

test('if i call sum function with 2 and 2 it should return 4', () => {
  const result = sum(2, 2);

  expect(result).toBe(4);
});
