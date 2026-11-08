(function (root) {
  "use strict";
  function clamp(n, min, max) { return Math.max(min, Math.min(max, Number(n))); }
  function portfolio(weight, correlation) {
    var w = clamp(weight, 0, 1), r = clamp(correlation, -1, 1);
    var variance = w * w * .2 * .2 + (1 - w) * (1 - w) * .3 * .3 + 2 * w * (1 - w) * r * .2 * .3;
    return { expected: w * .08 + (1 - w) * .12, volatility: Math.sqrt(Math.max(0, variance)) };
  }
  function game(a, b) {
    if (a === "合作" && b === "合作") return [3, 3];
    if (a === "竞争" && b === "合作") return [5, 0];
    if (a === "合作" && b === "竞争") return [0, 5];
    return [1, 1];
  }
  function bank(withdrawal, recovery) {
    var demand = clamp(withdrawal, 0, 100), r = clamp(recovery, .5, 1);
    var sold = Math.min(80, Math.max(0, demand - 20) / r);
    var available = 20 + 80 * r;
    return { demand: demand, available: available, sold: sold, loss: sold * (1 - r), shortage: Math.max(0, demand - available), paid: Math.min(demand, available) };
  }
  root.EconModels = { portfolio: portfolio, game: game, bank: bank };
})(typeof window !== "undefined" ? window : globalThis);
