const getDateInterval = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
    );
    const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
    );
    return [startOfMonth, endOfMonth];
};

module.exports = getDateInterval;
