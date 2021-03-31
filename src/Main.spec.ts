import Main from './Main';

test('Main class entrypoint', () => {
  expect(Main.log('anything')).toBe(true);
});
