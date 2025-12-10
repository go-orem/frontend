export function runEffectAsync(fn: () => Promise<void>) {
  fn().catch((err) => {
    console.error(err);
  });
}
