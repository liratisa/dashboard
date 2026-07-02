require("dotenv").config();

//const fs = require("node:fs");

// const str = JSON.stringify(allRows);

// fs.writeFile("rows.json", str, (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         // file written successfully
//     }
// });

async function getAllUsers() {
    const allRows = [];

    let total = 0;
    let offset = 0;
    let limit = 2000;

    while (total !== 1) {
        const res = await fetch(`${process.env.METABASE_URL}/dataset/`, {
            method: "POST",
            headers: { "X-API-Key": `${process.env.METABASE_KEY}`, "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                database: 6,
                type: "query",
                parameters: [],
                query: {
                    "source-table": 162,
                    filter: [
                        "and",
                        [
                            "=",
                            [
                                "field",
                                4428,
                                {
                                    "base-type": "type/Boolean",
                                },
                            ],
                            true,
                        ],
                        [
                            "between",
                            [
                                "field",
                                4447,
                                {
                                    "base-type": "type/Integer",
                                },
                            ],
                            offset,
                            limit,
                        ],
                    ],
                },
            }),
        });

        const data = await res.json();
        const rows = data.data?.rows ?? [];

        total = rows.length;

        const id = rows.map((data) => Number(data[0]));

        offset = id.at(-1);
        limit = limit + 2000;

        allRows.push(...id);
    }

    const totalUsers = new Set(allRows).size;

    console.log(totalUsers);
}

getAllUsers();
