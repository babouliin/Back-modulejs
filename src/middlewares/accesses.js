async function isConnected(ctx) {
  const { user } = ctx.state;
  return !(user === undefined);
}

export default {
  isConnected,
};
