const arr = [5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0];

const total = arr.length;

const obj = arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
}, {});

const newObj = Object.entries(obj).map(([rating, count]) => ({
    rating: rating,
    count: count,
    pct: parseFloat(((count / total) * 100).toFixed(1)),
}));
const percentages = {};
for (const item in obj) {
    percentages[item] = ((obj[item] / total) * 100).toFixed(2);
}

console.log(newObj);
