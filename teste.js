require("dotenv").config();

const fs = require("node:fs");

// const str = JSON.stringify(allRows);

// fs.writeFile("rows.json", str, (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         // file written successfully
//     }
// });

// async function getAllUsers() {
//     const allRows = [];

//     let total = 0;
//     let offset = 0;
//     let limit = 2000;

//     while (total !== 1) {
//         const res = await fetch(`${process.env.METABASE_URL}/dataset/`, {
//             method: "POST",
//             headers: { "X-API-Key": `${process.env.METABASE_KEY}`, "Content-Type": "application/json; charset=utf-8" },
//             body: JSON.stringify({
//                 database: 6,
//                 type: "query",
//                 parameters: [],
//                 query: {
//                     "source-table": 162,
//                     filter: [
//                         "and",
//                         [
//                             "=",
//                             [
//                                 "field",
//                                 4428,
//                                 {
//                                     "base-type": "type/Boolean",
//                                 },
//                             ],
//                             true,
//                         ],
//                         [
//                             "between",
//                             [
//                                 "field",
//                                 4447,
//                                 {
//                                     "base-type": "type/Integer",
//                                 },
//                             ],
//                             offset,
//                             limit,
//                         ],
//                     ],
//                 },
//             }),
//         });

//         const data = await res.json();
//         const rows = data.data?.rows ?? [];

//         total = rows.length;

//         const id = rows.map((data) => Number(data[0]));

//         offset = id.at(-1);
//         limit = limit + 2000;

//         allRows.push(...id);
//     }

//     const totalUsers = new Set(allRows).size;

//     console.log(totalUsers);
// }

// getAllUsers();

async function getAllTickets() {
    const { start, end } = getWeekRange();

    const res = await fetch(`${process.env.METABASE_URL}/dataset/`, {
        method: "POST",
        headers: { "X-API-Key": `${process.env.METABASE_KEY}`, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            database: 6,
            type: "query",
            query: {
                "source-table": 209,
                filter: [
                    "between",
                    [
                        "field",
                        4267,
                        {
                            "base-type": "type/DateTimeWithLocalTZ",
                        },
                    ],
                    start,
                    end,
                ],
            },
            parameters: [],
        }),
    });

    const data = await res.json();
    const rows = data.data.rows;

    const total = rows.length;
    // 1 - novo 2 - processando (atribuído ) 3 - processando ( planejado) 4 - Pendente 5 - Solucionado 6 - Fechado
    const openTickets = rows.map((data) => ({ id: data[0], category: data[16], type: data[17], status: data[9] })).filter((data) => data.status === 5 || data.status === 6);

    console.log(openTickets.length);
}

getAllTickets();

function getWeekRange(date = new Date()) {
    const currentDay = date.getDay();
    // Adjust if week starts on Monday (1) instead of Sunday (0)
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(date);
    monday.setDate(date.getDate() + distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).toISOString().split("T")[0];
    const formSunday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate()).toISOString().split("T")[0];

    return { start: formMonday, end: formSunday };
}
