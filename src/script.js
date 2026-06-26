require("dotenv").config();
const { writeFile } = require("fs/promises");

// tabelas:  a) glpi_tickets - id: 209; b) glpi_users - id: 162; c) glpi_ticketsatisfactions - id: 108
// query: { "source-table": 108, filter: ["between", ["field", 4303, { "base-type": "type/DateTimeWithLocalTZ" }], "2026-01-01", "2026-06-31"], limit: 50 },
//,,sd,s
async function getTicketSatisfaction() {
    const res = await fetch(`${process.env.METABASE_URL}/dataset`, {
        method: "POST",
        headers: { "X-API-Key": process.env.METABASE_KEY, "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
        body: JSON.stringify({
            database: 6,
            query: { "source-table": 108, filter: ["between", ["field", 4303, { "base-type": "type/DateTimeWithLocalTZ" }], "2026-06-01", "2026-06-24"], limit: 500 },
            type: "query",
            parameters: [],
        }),
    });

    const data = await res.json();

    const rows = data.data.rows;

    const csat = rows.map((data) => Number(data[5])).filter((num) => num > 0);

    const total = csat.length;

    console.log("kdskdkskddk");

    console.log(total);
}

getTicketSatisfaction();
