import { useState } from "react";
import {
  pricingData,
  priceTypes,
  packages,
} from "./data/pricingData";

// ============================================================
// CALCULATOR LIST
// ============================================================

const calculators = Object.entries(pricingData).map(
  ([id, calculator]) => ({
    id,
    ...calculator,
  })
);

// ============================================================
// PAYMENT LINK
// ============================================================

const PAYMENT_URL =
  "http://algonova.id.tilda.ws/xendit_bnpl?lead_uuid=a270494b-97b1-42d4-ae7d-63fd2a801209&fb_pixel_id=1152940395642591";

// ============================================================
// FORMAT RUPIAH
// ============================================================

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// ============================================================
// GET FIRST CLASS
// ============================================================

function getFirstClass(calculator) {
  if (!calculator?.classes) {
    return "";
  }

  return Object.keys(calculator.classes)[0] || "";
}

// ============================================================
// CREATE ITEM
// ============================================================

function createItem() {
  const calculator = calculators[0];

  return {
    calculatorId: calculator?.id || "",
    className: getFirstClass(calculator),
    priceType: priceTypes?.[0]?.id || "normal",
    packageName: packages?.[0] || "10L",

    // Item baru otomatis mendapat bundling 10%
    bundling: true,
  };
}

// ============================================================
// APP
// ============================================================

function App() {
  // ==========================================================
  // ITEMS
  // ==========================================================

  const [items, setItems] = useState([
    {
      ...createItem(),

      // Item pertama tidak mendapatkan bundling
      bundling: false,
    },
  ]);

  // ==========================================================
  // UPDATE ITEM
  // ==========================================================

  const updateItem = (index, field, value) => {
    setItems((currentItems) => {
      const newItems = [...currentItems];

      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };

      return newItems;
    });
  };

  // ==========================================================
  // CHANGE CALCULATOR
  // ==========================================================

  const changeCalculator = (index, calculatorId) => {
    const calculator = pricingData[calculatorId];

    if (!calculator) {
      return;
    }

    const firstClass = getFirstClass(calculator);

    setItems((currentItems) => {
      const newItems = [...currentItems];

      newItems[index] = {
        ...newItems[index],
        calculatorId,
        className: firstClass,
        priceType: priceTypes?.[0]?.id || "normal",
        packageName: packages?.[0] || "10L",
      };

      return newItems;
    });
  };

  // ==========================================================
  // ADD BUNDLING ITEM
  // ==========================================================

  const addBundlingItem = () => {
    setItems((currentItems) => [
      ...currentItems,
      createItem(),
    ]);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeItem = (index) => {
    if (index === 0) {
      return;
    }

    setItems((currentItems) =>
      currentItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetCalculator = () => {
    setItems([
      {
        ...createItem(),
        bundling: false,
      },
    ]);
  };

  // ==========================================================
  // GET ITEM PRICE
  // ==========================================================

  const getItemPrice = (item, index) => {
    const calculator = pricingData[item.calculatorId];

    const price =
      calculator?.classes?.[item.className]?.[
        item.priceType
      ]?.[item.packageName] ?? 0;

    // --------------------------------------------------------
    // ITEM PERTAMA
    // --------------------------------------------------------

    if (index === 0) {
      return {
        basePrice: price,
        discount: 0,
        finalPrice: price,
      };
    }

    // --------------------------------------------------------
    // ITEM TAMBAHAN + BUNDLING ON
    // --------------------------------------------------------

    if (item.bundling === true) {
      const discount = price * 0.1;
      const finalPrice = price - discount;

      return {
        basePrice: price,
        discount,
        finalPrice,
      };
    }

    // --------------------------------------------------------
    // ITEM TAMBAHAN + BUNDLING OFF
    // --------------------------------------------------------

    return {
      basePrice: price,
      discount: 0,
      finalPrice: price,
    };
  };

  // ==========================================================
  // TOTAL PRICE
  // ==========================================================

  const totalPrice = items.reduce(
    (total, item, index) => {
      const result = getItemPrice(item, index);

      return total + result.finalPrice;
    },
    0
  );

  // ==========================================================
  // TOTAL DISCOUNT
  // ==========================================================

  const totalDiscount = items.reduce(
    (total, item, index) => {
      const result = getItemPrice(item, index);

      return total + result.discount;
    },
    0
  );

  // ==========================================================
  // BUNDLING COUNT
  // ==========================================================

  const bundlingCount = items.filter(
    (item, index) =>
      index > 0 && item.bundling === true
  ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

      </div>


      <div className="relative">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">

            {/* LEFT */}

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold shadow-lg shadow-indigo-500/20">
                $
              </div>

              <div>

                <h1 className="text-lg font-bold tracking-tight">
                  Price Calculator
                </h1>

                <p className="text-xs text-slate-400">
                  Internal Sales Pricing Tool
                </p>

              </div>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-3">

              <div className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 sm:block">
                Sales Tool
              </div>

              <div className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 sm:block">
                v1.0
              </div>


              {/* TEAM PHOTO */}

              <div className="group relative ml-1">

                <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/20 bg-slate-800 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-400">

                  <img
                    src="/team-photo.png"
                    alt="Our Team"
                    className="h-full w-full object-cover"
                  />

                </div>


                <div className="pointer-events-none absolute right-0 top-[4.5rem] z-50 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                  Our Team
                </div>

              </div>

            </div>

          </div>

        </header>


        {/* ====================================================
            MAIN
        ==================================================== */}

        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          {/* ==================================================
              HERO
          ================================================== */}

          <section className="mb-10">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-300">

              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

              Only For Team 3 🙈🙈🙈

            </div>


            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">

              Calculate your{" "}

              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                package price
              </span>

            </h2>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">

              Add multiple courses and individually control
              the 10% bundling discount for each additional
              item.

            </p>

          </section>


          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="grid gap-6 lg:grid-cols-3">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="space-y-5 lg:col-span-2">

              {/* =================================================
                  ITEMS
              ================================================= */}

              {items.map((item, index) => {

                const calculator =
                  pricingData[item.calculatorId];

                const availableClasses =
                  Object.keys(
                    calculator?.classes || {}
                  );

                const result =
                  getItemPrice(item, index);


                return (

                  <div
                    key={index}
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                      index === 0
                        ? "border-indigo-500/30 bg-indigo-500/[0.04]"
                        : item.bundling
                        ? "border-amber-500/30 bg-amber-500/[0.04]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >

                    {/* ========================================
                        ITEM HEADER
                    ======================================== */}

                    <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                      {/* ITEM INFO */}

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            index === 0
                              ? "bg-indigo-500/20 text-indigo-300"
                              : item.bundling
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >

                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}

                        </div>


                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              Item {index + 1}
                            </h3>


                            {index === 0 ? (

                              <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-300">
                                Primary
                              </span>

                            ) : item.bundling ? (

                              <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                                Bundling -10%
                              </span>

                            ) : (

                              <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Standard Price
                              </span>

                            )}

                          </div>


                          <p className="mt-1 text-xs text-slate-500">

                            {index === 0
                              ? "Primary item — standard price"
                              : item.bundling
                              ? "10% bundling discount applied"
                              : "No bundling discount"}

                          </p>

                        </div>

                      </div>


                      {/* ITEM CONTROLS */}

                      <div className="flex items-center gap-3">

                        {/* =================================================
                            BUNDLING TOGGLE
                        ================================================= */}

                        {index > 0 && (

                          <button
                            type="button"
                            onClick={() =>
                              updateItem(
                                index,
                                "bundling",
                                !item.bundling
                              )
                            }
                            className="group flex items-center gap-3"
                            aria-label="Toggle bundling discount"
                          >

                            {/* LABEL */}

                            <span
                              className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${
                                item.bundling
                                  ? "text-amber-400"
                                  : "text-slate-500"
                              }`}
                            >

                              {item.bundling
                                ? "BUNDLING"
                                : "NO DISCOUNT"}

                            </span>


                            {/* SWITCH */}

                            <div
                              className={`relative h-7 w-12 rounded-full p-1 transition-all duration-200 ${
                                item.bundling
                                  ? "bg-amber-500 shadow-lg shadow-amber-500/20"
                                  : "bg-slate-700"
                              }`}
                            >

                              <div
                                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                                  item.bundling
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              />

                            </div>

                          </button>

                        )}


                        {/* REMOVE BUTTON */}

                        {index > 0 && (

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl leading-none text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                            title="Remove item"
                          >

                            ×

                          </button>

                        )}

                      </div>

                    </div>


                    {/* ========================================
                        FORM
                    ======================================== */}

                    <div className="space-y-5 p-6">

                      {/* CALCULATOR */}

                      <div>

                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          Calculator
                        </label>


                        <select
                          value={item.calculatorId}
                          onChange={(event) =>
                            changeCalculator(
                              index,
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                        >

                          {calculators.map(
                            (calculatorOption) => (

                              <option
                                key={calculatorOption.id}
                                value={
                                  calculatorOption.id
                                }
                              >

                                {calculatorOption.title}

                              </option>

                            )
                          )}

                        </select>

                      </div>


                      {/* CLASS / PRICE / PACKAGE */}

                      <div className="grid gap-4 md:grid-cols-3">

                        {/* CLASS */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-slate-400">
                            Class Type
                          </label>


                          <select
                            value={item.className}
                            onChange={(event) =>
                              updateItem(
                                index,
                                "className",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                          >

                            {availableClasses.map(
                              (className) => (

                                <option
                                  key={className}
                                  value={className}
                                >

                                  {className}

                                </option>

                              )
                            )}

                          </select>

                        </div>


                        {/* PRICE TYPE */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-slate-400">
                            Price Type
                          </label>


                          <select
                            value={item.priceType}
                            onChange={(event) =>
                              updateItem(
                                index,
                                "priceType",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
                          >

                            {priceTypes.map(
                              (priceType) => (

                                <option
                                  key={priceType.id}
                                  value={priceType.id}
                                >

                                  {priceType.name}

                                </option>

                              )
                            )}

                          </select>

                        </div>


                        {/* PACKAGE */}

                        <div>

                          <label className="mb-2 block text-xs font-medium text-slate-400">
                            Package
                          </label>


                          <select
                            value={item.packageName}
                            onChange={(event) =>
                              updateItem(
                                index,
                                "packageName",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
                          >

                            {packages.map(
                              (packageName) => (

                                <option
                                  key={packageName}
                                  value={packageName}
                                >

                                  {packageName}

                                </option>

                              )
                            )}

                          </select>

                        </div>

                      </div>


                      {/* ========================================
                          PRICE RESULT
                      ======================================== */}

                      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

                        {/* NORMAL PRICE */}

                        <div className="flex items-center justify-between gap-4">

                          <span className="text-sm text-slate-400">

                            {index === 0
                              ? "Item Price"
                              : "Normal Price"}

                          </span>


                          <span className="text-sm font-semibold text-white">

                            {formatRupiah(
                              result.basePrice
                            )}

                          </span>

                        </div>


                        {/* BUNDLING DISCOUNT */}

                        {index > 0 &&
                          item.bundling && (

                            <>

                              <div className="my-3 h-px bg-white/10" />


                              <div className="flex items-center justify-between gap-4">

                                <span className="text-sm text-amber-400">

                                  Bundling Discount 10%

                                </span>


                                <span className="text-sm font-semibold text-amber-400">

                                  -{" "}
                                  {formatRupiah(
                                    result.discount
                                  )}

                                </span>

                              </div>

                            </>

                          )}


                        <div className="my-3 h-px bg-white/10" />


                        {/* FINAL */}

                        <div className="flex items-center justify-between gap-4">

                          <span className="text-sm font-semibold text-slate-300">

                            Final Price

                          </span>


                          <span
                            className={`text-lg font-bold ${
                              index === 0
                                ? "text-indigo-300"
                                : item.bundling
                                ? "text-amber-300"
                                : "text-white"
                            }`}
                          >

                            {formatRupiah(
                              result.finalPrice
                            )}

                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              })}


              {/* =================================================
                  ADD BUNDLING ITEM
              ================================================= */}

              <button
                type="button"
                onClick={addBundlingItem}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-500/[0.03] px-6 py-5 text-sm font-semibold text-indigo-300 transition hover:border-indigo-500/60 hover:bg-indigo-500/[0.08]"
              >

                <span className="text-xl">
                  +
                </span>

                Add Bundling Item

              </button>

            </div>


            {/* =================================================
                RIGHT SUMMARY
            ================================================= */}

            <div className="lg:sticky lg:top-6 lg:self-start">

              <div className="overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-white/[0.03]">

                {/* SUMMARY HEADER */}

                <div className="border-b border-white/10 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wider text-indigo-300">
                        Estimated Total
                      </p>


                      <p className="mt-1 text-xs text-slate-500">

                        {items.length}{" "}
                        {items.length === 1
                          ? "item"
                          : "items"}{" "}
                        in package

                      </p>

                    </div>


                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400">
                      $
                    </div>

                  </div>


                  <div className="mt-6 text-4xl font-bold tracking-tight">

                    {formatRupiah(totalPrice)}

                  </div>

                </div>


                {/* SUMMARY BODY */}

                <div className="p-6">

                  <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Package Summary
                  </p>


                  {/* ITEMS */}

                  <div className="space-y-4">

                    {items.map((item, index) => {

                      const calculator =
                        pricingData[
                          item.calculatorId
                        ];

                      const result =
                        getItemPrice(
                          item,
                          index
                        );


                      return (

                        <div
                          key={index}
                          className="border-b border-white/10 pb-4 last:border-0"
                        >

                          <div className="flex items-start justify-between gap-3">

                            {/* INFO */}

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <p className="text-sm font-semibold text-white">

                                  Item {index + 1}

                                </p>


                                {index > 0 &&
                                  item.bundling && (

                                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-400">

                                      -10%

                                    </span>

                                  )}

                              </div>


                              <p className="mt-1 truncate text-xs text-slate-500">

                                {calculator?.title ||
                                  item.calculatorId}

                              </p>


                              <p className="mt-1 text-xs text-slate-500">

                                {item.className}
                                {" · "}
                                {item.packageName}

                              </p>

                            </div>


                            {/* PRICE */}

                            <div className="shrink-0 text-right">

                              <p className="text-sm font-semibold text-white">

                                {formatRupiah(
                                  result.finalPrice
                                )}

                              </p>


                              {index > 0 &&
                                item.bundling && (

                                  <p className="mt-1 text-[10px] text-amber-400">

                                    Bundling

                                  </p>

                                )}

                            </div>

                          </div>

                        </div>

                      );

                    })}

                  </div>


                  {/* TOTAL SAVINGS */}

                  {totalDiscount > 0 && (

                    <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs text-amber-400">
                          Total Bundling Savings
                        </span>


                        <span className="text-sm font-bold text-amber-400">

                          {formatRupiah(
                            totalDiscount
                          )}

                        </span>

                      </div>


                      <p className="mt-1 text-[10px] text-amber-400/60">

                        {bundlingCount}{" "}
                        {bundlingCount === 1
                          ? "item"
                          : "items"}{" "}
                        receiving 10% discount

                      </p>

                    </div>

                  )}


                  {/* TOTAL */}

                  <div className="my-6 h-px bg-white/10" />


                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm font-semibold text-slate-300">
                      Final Total
                    </span>


                    <span className="text-xl font-bold text-white">

                      {formatRupiah(
                        totalPrice
                      )}

                    </span>

                  </div>


                  {/* PAYMENT */}

                  <a
                    href={PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30"
                  >

                    <span className="text-base">
                      💳
                    </span>

                    Create Payment Link

                  </a>


                  {/* RESET */}

                  <button
                    type="button"
                    onClick={resetCalculator}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                  >

                    Reset Package

                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="mt-12 border-t border-white/10 pt-6">

            <div className="flex flex-col justify-between gap-2 text-xs text-slate-600 sm:flex-row">

              <span>
                made with ❤️ by KEVIN SURYA
              </span>

              <span>
                Price data · 15 August 2026
              </span>

            </div>

          </footer>

        </main>

      </div>

    </div>
  );
}

export default App;