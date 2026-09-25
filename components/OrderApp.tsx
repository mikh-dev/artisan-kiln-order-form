"use client";

import { FormEvent, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  addNextTile,
  AppDispatch,
  clearCell,
  clearGrid,
  decrement,
  increment,
  store,
  placeTile,
  removeItem,
  RootState,
  selectTile,
  TileId,
  tileCatalog,
} from "@/lib/store";
import { calculateOrder } from "@/lib/calculations";

const patternLabel: Record<TileId, string> = {
  ocean: "Ocean wave pattern",
  fern: "Forest fern pattern",
  dot: "Terracotta dot pattern",
  star: "Yellow star pattern",
  clay: "Clay diamond pattern",
  mosaic: "Mosaic garden pattern",
  mint: "Mint chevron pattern",
  sunset: "Sunset arc pattern",
};

const navItems = [
  "Home",
  "Shop",
  "Collections",
  "About us",
  "FAQ",
  "Gallery",
  "Blog",
];

const swatchSize = {
  sm: "h-8 w-8",
  md: "h-14 w-14",
  lg: "h-full w-full",
};

function TileSwatch({ id, size = "md" }: { id: TileId; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      role="img"
      aria-label={patternLabel[id]}
      className={`tile-swatch tile-${id} ${swatchSize[size]}`}
    />
  );
}

function Header() {
  return (
    <>
      <header className="border-b-2 border-ink/70 bg-[#efe7d1] px-4 py-2">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between text-xs font-black uppercase tracking-[0.14em] sm:text-sm">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full border border-ink bg-terracotta" />
            <span className="h-3 w-3 rounded-full border border-ink bg-mustard" />
            <span className="h-3 w-3 rounded-full border border-ink bg-sage" />
          </div>
          <nav className="hidden gap-6 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="hover:text-terracotta"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span aria-hidden="true">🛒</span>
            <span className="rounded-full border-2 border-ink px-3 py-1">M. Nazaretian</span>
          </div>
        </div>
      </header>
      <section className="border-b-2 border-ink/50 px-4 py-5 text-center">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-4">
          <span className="hidden text-5xl sm:block" aria-hidden="true">
            ♜
          </span>
          <div>
            <h1 className="display-title text-4xl font-black uppercase leading-none sm:text-5xl lg:text-6xl">
              Ceramic Tile Order Form
            </h1>
            <div className="mt-2 flex items-center justify-center gap-2 text-lg font-black uppercase tracking-[0.12em] sm:text-2xl">
              <TileSwatch id="ocean" size="sm" />
              <TileSwatch id="dot" size="sm" />
              <TileSwatch id="mint" size="sm" />
              <span className="ml-2">The Artisan Kiln</span>
            </div>
          </div>
          <span className="hidden text-5xl sm:block" aria-hidden="true">
            ♨
          </span>
        </div>
      </section>
    </>
  );
}

function Totals({ compact = false }: { compact?: boolean }) {
  const cart = useSelector((state: RootState) => state.shop.cart);
  const { subtotal, shipping, total } = calculateOrder(cart);
  return (
    <dl
      className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 font-black uppercase ${compact ? "text-xs" : "text-sm"}`}
    >
      <dt>Subtotal</dt>
      <dd>${subtotal.toFixed(2)}</dd>
      <dt>Shipping</dt>
      <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
      <dt className="border-t border-ink pt-1">Grand total</dt>
      <dd className="border-t border-ink pt-1">${total.toFixed(2)}</dd>
    </dl>
  );
}

function CartPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.shop.cart);
  const canAddTile = tileCatalog.some(
    (tile) => !cart.some((item) => item.id === tile.id),
  );

  return (
    <section aria-labelledby="cart-title">
      <h2 id="cart-title" className="section-title">
        Shopping Cart
      </h2>
      <div className="overflow-hidden rounded-sm border-2 border-ink bg-parchment/80">
        <div className="grid grid-cols-[1fr_76px_76px] border-b-2 border-ink bg-[#eadfc4] px-3 py-2 text-[11px] font-black uppercase tracking-wide">
          <span>Tile collection</span>
          <span className="text-center">Qty</span>
          <span className="text-center">Actions</span>
        </div>
        {cart.length === 0 ? (
          <p className="p-6 text-center font-bold">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <article
              key={item.id}
              className="grid grid-cols-[1fr_76px_76px] items-center border-b border-ink/50 p-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <TileSwatch id={item.id} />
                <div>
                  <h3 className="text-sm font-black uppercase leading-tight">{item.name}</h3>
                  <p className="mt-1 text-xs font-bold">${item.price.toFixed(2)} / sq. ft.</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  className="quantity-button"
                  onClick={() => dispatch(increment(item.id))}
                  aria-label={`Add one ${item.name}`}
                >
                  +
                </button>
                <strong aria-live="polite">{item.quantity}</strong>
                <button
                  className="quantity-button"
                  onClick={() => dispatch(decrement(item.id))}
                  aria-label={`Remove one ${item.name}`}
                >
                  −
                </button>
              </div>
              <button
                className="remove-button"
                onClick={() => dispatch(removeItem(item.id))}
                aria-label={`Remove ${item.name} from cart`}
              >
                <span aria-hidden="true">⌫</span>
                <span>Remove</span>
              </button>
            </article>
          ))
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <button
          className="secondary-button"
          onClick={() => dispatch(addNextTile())}
          disabled={!canAddTile}
        >
          {canAddTile ? "+ Add new tile" : "All tiles added"}
        </button>
        <Totals compact />
      </div>
    </section>
  );
}

function DesignTool() {
  const dispatch = useDispatch<AppDispatch>();
  const { grid, activeTile } = useSelector((state: RootState) => state.shop);
  return (
    <section aria-labelledby="design-title" className="hidden lg:block">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <h2 id="design-title" className="section-title mb-0">
            Visualize Your Order
          </h2>
          <p className="text-sm font-bold">
            Choose a tile, then click or drag it into the 7 × 7 grid.
          </p>
        </div>
        <button
          className="text-xs font-black uppercase underline decoration-2 underline-offset-4"
          onClick={() => dispatch(clearGrid())}
        >
          Clear grid
        </button>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_106px] gap-3 rounded-sm border-2 border-ink bg-[#e9dec4] p-3">
        <div className="grid aspect-square grid-cols-7 overflow-hidden border-2 border-ink bg-[#f3ecd9]">
          {grid.map((tile, index) => (
            <button
              key={index}
              className="aspect-square border-b border-r border-ink/60 p-0.5 transition hover:bg-mustard/20 focus:z-10 focus:outline focus:outline-2 focus:outline-navy"
              aria-label={
                tile
                  ? `Grid cell ${index + 1}: ${patternLabel[tile]}`
                  : `Empty grid cell ${index + 1}`
              }
              onClick={() => dispatch(placeTile({ index }))}
              onContextMenu={(event) => {
                event.preventDefault();
                dispatch(clearCell(index));
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const dropped = event.dataTransfer.getData("text/tile") as TileId;
                dispatch(placeTile({ index, tile: dropped || activeTile }));
              }}
            >
              {tile && <TileSwatch id={tile} size="lg" />}
            </button>
          ))}
        </div>
        <aside>
          <h3 className="mb-2 text-center text-xs font-black uppercase tracking-wider">
            Design palette
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {tileCatalog.map((tile) => (
              <button
                key={tile.id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData("text/tile", tile.id)}
                onClick={() => dispatch(selectTile(tile.id))}
                className={`aspect-square border-2 p-1 transition ${activeTile === tile.id ? "border-terracotta bg-white shadow-[0_0_0_3px_#b85f4340]" : "border-ink bg-[#f8f1dd] hover:-translate-y-0.5"}`}
                aria-label={`Select ${tile.name}`}
                aria-pressed={activeTile === tile.id}
              >
                <TileSwatch id={tile.id} size="lg" />
              </button>
            ))}
          </div>
        </aside>
      </div>
      <p className="mt-2 text-center text-xs font-bold text-ink/70">
        Tip: right-click a grid cell to erase it.
      </p>
    </section>
  );
}

type Payment = "card" | "paypal" | "apple" | "bank";
type CheckoutErrors = Partial<Record<"name" | "email" | "phone" | "address" | "card", string>>;

const paymentOptions: Array<[Payment, string]> = [
  ["card", "Credit / debit"],
  ["paypal", "PayPal"],
  ["apple", "Apple Pay"],
  ["bank", "Bank transfer"],
];

function PaymentLogo({ payment }: { payment: Payment }) {
  if (payment === "card") {
    return (
      <span className="flex w-14 items-center gap-1" aria-hidden="true">
        <img src="/payment/visa.svg" alt="" className="h-5 w-8 object-contain" />
        <img src="/payment/mastercard.svg" alt="" className="h-5 w-6 object-contain" />
      </span>
    );
  }

  if (payment === "paypal") {
    return (
      <span className="flex w-14 items-center" aria-hidden="true">
        <img src="/payment/paypal.svg" alt="" className="h-7 w-7 object-contain" />
      </span>
    );
  }

  if (payment === "apple") {
    return (
      <span className="flex w-14 items-center" aria-hidden="true">
        <img src="/payment/applepay.svg" alt="" className="h-7 w-12 object-contain" />
      </span>
    );
  }

  return (
    <span className="flex w-14 items-center justify-start text-2xl text-navy" aria-hidden="true">
      🏦
    </span>
  );
}

function CheckoutPanel() {
  const [payment, setPayment] = useState<Payment>("card");
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [message, setMessage] = useState("");

  const validate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const cardNumber = String(data.get("card") ?? "").replace(/\s/g, "");
    const nextErrors: CheckoutErrors = {};

    if (!name) nextErrors.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email.";
    if (!/^\+?[\d\s()-]{8,}$/.test(phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!address) nextErrors.address = "Enter a shipping address.";
    if (payment === "card" && !/^\d{16}$/.test(cardNumber)) {
      nextErrors.card = "Enter a 16-digit card number.";
    }

    setErrors(nextErrors);
    setMessage(
      Object.keys(nextErrors).length
        ? "Please check the highlighted fields."
        : "Order details look complete. This demo does not process payment.",
    );
  };

  return (
    <section aria-labelledby="checkout-title">
      <h2 id="checkout-title" className="section-title">
        Order Summary
      </h2>
      <form onSubmit={validate} noValidate className="space-y-4">
        <div className="paper-panel space-y-3">
          <Field label="Customer name" name="name" autoComplete="name" error={errors.name} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Field label="Phone" name="phone" autoComplete="tel" error={errors.phone} />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
            />
          </div>
          <Field
            label="Shipping address"
            name="address"
            autoComplete="street-address"
            error={errors.address}
          />
          <Field label="Project name / notes" name="notes" />
          <div className="border-t-2 border-ink/40 pt-3">
            <Totals />
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-black uppercase tracking-wide">
            Select payment method
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {paymentOptions.map(([id, label]) => (
              <label
                key={id}
                className={`payment-card ${payment === id ? "payment-card-active" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={id}
                  checked={payment === id}
                  onChange={() => setPayment(id)}
                />
                <PaymentLogo payment={id} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {payment === "card" && (
          <div className="paper-panel grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="Card number"
                name="card"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                error={errors.card}
              />
            </div>
            <Field label="Expiration" name="expiry" placeholder="MM / YY" />
            <Field label="CVV" name="cvv" inputMode="numeric" placeholder="123" />
          </div>
        )}
        {payment !== "card" && (
          <div className="paper-panel text-sm font-bold">
            You will receive secure{" "}
            {payment === "paypal" ? "PayPal" : payment === "apple" ? "Apple Pay" : "bank transfer"}{" "}
            instructions after review.
          </div>
        )}

        <button type="submit" className="primary-button w-full">
          Review Order
        </button>
        {message && (
          <p
            role="status"
            className={`text-sm font-bold ${Object.keys(errors).length ? "text-red-800" : "text-sage"}`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = `field-${props.name}`;
  return (
    <label htmlFor={id} className="block text-xs font-black uppercase tracking-wide">
      {label}
      <input
        id={id}
        className={`form-input ${error ? "border-red-700 bg-red-50" : ""}`}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="mt-1 block normal-case text-red-800">
          {error}
        </span>
      )}
    </label>
  );
}

function Footer() {
  return (
    <footer className="mt-8 border-t-2 border-ink/50 px-4 py-5 text-center text-xs font-black uppercase tracking-wider">
      Terms of service · Privacy policy · Shipping info · Contact us
      <br />
      <span className="mt-1 block font-bold normal-case">
        © 2026 The Artisan Kiln. Demo storefront.
      </span>
    </footer>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-parchment text-ink">
      <Header />
      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
        <div className="grid gap-7 lg:grid-cols-[330px_minmax(390px,1fr)_330px] 2xl:grid-cols-[390px_minmax(500px,1fr)_390px]">
          <CartPanel />
          <DesignTool />
          <CheckoutPanel />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderApp() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
