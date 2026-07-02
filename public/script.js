async function getTicketSatisfaction() {
    try {
        const res = await fetch("/api/csat");
        const data = await res.json();
        //const total = data.total;

        const csatValue = document.querySelector(".kpi-value.csat");
        const totalCsat = document.querySelector(".card-sub.csat");
        const csatBig = document.querySelector(".csat-big");
        const csatContainer = document.getElementById("csatBars");

        if (csatValue) csatValue.innerText = `${data.average.toFixed(2)}/5`;
        if (csatBig) csatBig.innerText = data.average.toFixed(2);
        if (totalCsat) totalCsat.innerText = `CSAT — ${data.total} avaliações este mês`;

        if (csatContainer) {
            const color = { 5: "#16A34A", 4: "#65A30D", 3: "#CA8A04", 2: "#EA580C", 1: "#DC2626" };
            csatContainer.innerHTML = "";
            data.distributionData.forEach((c) => {
                csatContainer.innerHTML += `<div class="csat-row">
    <span style="width:20px;text-align:right">${c.stars}★</span>
    <div class="csat-track"><div class="csat-fill" style="width:${c.pct}%;background:${color[c.stars]}"></div></div>
    <span style="width:30px;text-align:right">${c.pct}%</span>
  </div>`;
            });
        }
    } catch (err) {
        console.error("Erro ao carregar CSAT:", err);
    }
}

async function getAllUsers() {
    try {
        const res = await fetch("/api/users");
        const data = await res.json();
        const total = data.totalUsers;
        const totalUsers = document.querySelector(".total-users");

        if (totalUsers) totalUsers.innerText = `Total de ${total} usuários ativos`;
    } catch (err) {
        console.error("Erro ao carregar USUÁRIOS:", err);
    }
}

getAllUsers();
getTicketSatisfaction();
