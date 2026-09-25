export type PricedQuantity = { price: number; quantity: number };

export function calculateOrder(items: PricedQuantity[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
