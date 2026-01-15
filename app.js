let mpData = [];

// Load CSV
fetch("mp_pcd_sector.csv")
    .then(res => res.text())
    .then(csv => {
        Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                mpData = results.data;
                console.log("MP data loaded:", mpData.length);
            }
        });
    });

// Find MP
document.getElementById("searchBtn").addEventListener("click", () => {
    const input = document.getElementById("postcodeInput").value
        .trim()
        .toUpperCase();

    if (!input) return;

    const matches = mpData.filter(row =>
        row.Postcode_Sector &&
        row.Postcode_Sector.startsWith(input)
    );

    const select = document.getElementById("mpSelect");
    select.innerHTML = "";

    if (matches.length === 0) {
        select.innerHTML = "<option>No MP found for this postcode</option>";
    } else {
        matches.forEach(row => {
            const opt = document.createElement("option");
            opt.value = row["Westminster Parliamentary Constituency Code (2024)"];
            opt.textContent = `${row["Constituency Name"]} — ${row["MP Name"]}`;
            select.appendChild(opt);
        });
    }

    document.getElementById("result").style.display = "block";
});

// Generate email
document.getElementById("sendBtn").addEventListener("click", () => {
    const select = document.getElementById("mpSelect");
    const body = document.getElementById("emailBody").value;

    if (!select.value) return;

    const mpName = select.options[select.selectedIndex]
        .text.split("—")[1]
        .trim();

    const subject = `Concern from a constituent`;
    const emailBody = `Dear ${mpName},\n\n${body}\n\nYours sincerely,`;

    window.location.href =
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
});

