const getFixedPercent = (prev, current) => {
    const percent = prev && current ? ((current - prev) / prev) * 100 : 100;
    return parseFloat(percent.toFixed(1));
};

const getUpdated = (prev, current) => ({
    purchasesCount: {
        current: current.purchasesCount,
        increase: current.purchasesCount - prev.purchasesCount,
        percent: getFixedPercent(prev.purchasesCount, current.purchasesCount),
    },
    bank: {
        current: current.bank,
        increase: current.bank - prev.bank,
        percent: getFixedPercent(prev.bank, current.bank),

    },
    profit: {
        current: current.profit,
        increase: current.profit - prev.profit,
        percent: getFixedPercent(prev.profit, current.profit),
    },
    bill: {
        current: current.bill,
        increase: current.bill - prev.bill,
        percent: getFixedPercent(prev.bill, current.bill),
    },
});

module.exports = getUpdated;
