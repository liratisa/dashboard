require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/csat", async (request, response) => {
    try {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];

        const allRows = [];

        //to do: verificar possibilidade de passar direto sem current ou end
        let current = new Date(firstDay);
        const end = new Date(lastDay);

        while (current <= end) {
            const from = current.toISOString().slice(0, 10);
            const next = new Date(current);
            next.setDate(next.getDate() + 7);
            const to = (next > end ? end : next).toISOString().slice(0, 10);

            const res = await fetch(`${process.env.METABASE_URL}/dataset`, {
                method: "POST",
                headers: { "X-API-Key": `${process.env.METABASE_KEY}`, "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    database: 6,
                    type: "query",
                    parameters: [],
                    query: {
                        "source-table": 108,
                        limit: 2000,
                        filter: ["between", ["field", 4303, { "base-type": "type/DateTimeWithLocalTZ" }], from, to],
                    },
                }),
            });

            const data = await res.json();
            const rows = data.data?.rows ?? [];

            allRows.push(...rows);

            current = new Date(next);
            current.setDate(current.getDate() + 1);
        }

        const ratings = allRows.map((row) => Number(row[5])).filter((n) => n !== 0);

        const total = ratings.length;
        const average = total > 0 ? ratings.reduce((sum, n) => sum + n, 0) / total : 0;

        const distribution = ratings.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});

        const distributionData = Object.entries(distribution).map(([stars, count]) => ({
            stars: stars,
            count: count,
            pct: parseFloat(((count / total) * 100).toFixed(1)),
        }));

        response.json({ average, total, distributionData });
    } catch (err) {
        console.error("Erro ao buscar CSAT no Metabase:", err);
        res.status(500).json({ error: "Falha ao buscar dados de CSAT" });
    }
});

app.get("api/users", async (request, response) => {
    try {
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

        response.json({ totalUsers });
    } catch (err) {
        console.error("Erro ao buscar USUÁRIOS no Metabase:", err);
        res.status(500).json({ error: "Falha ao buscar dados de USUÁRIOS" });
    }
});

app.get("/api/users", async (request, response) => {});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
