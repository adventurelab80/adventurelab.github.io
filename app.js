let mpData = [];

// Load CSV on startup
fetch("mp_pcd_sector.csv")
  .then(response => response.text())
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        mpData = results.data; 
        console.log("CSV loaded:", mpData.length);
      }
    });
  });

// Search button click
document.getElementById("searchBtn").addEventListener("click", () => {
  const outcode = document.getElementById("postcodeInput").value.trim().toUpperCase();
  if (!outcode) return;

  // Filter CSV for matching sector
  const matches = mpData.filter(row => 
    row["Postcode_Sector"] && 
    row["Postcode_Sector"].startsWith(outcode)
  );

  const select = document.getElementById("mpSelect");
  select.innerHTML = ""; // clear out old options

  if (matches.length === 0) {
    select.innerHTML = "<option>No matches found</option>";
  } else {
    matches.forEach(row => {
      const option = document.createElement("option");
      option.value = row["Westminster Parliamentary Constituency Code (2024)"];
      option.text = `${row["Constituency Name"]} — ${row["MP Name"]}`;
      select.appendChild(option);
    });
  }

  document.getElementById("resultSection").style.display = "block";
});

// Send / Generate email button
document.getElementById("sendBtn").addEventListener("click", () => {
  const select = document.getElementById("mpSelect");
  const emailBody = document.getElementById("emailBody").value.trim();
  const selectedOption = select.options[select.selectedIndex];
  if (!selectedOption) return;

  const mpName = selectedOption.text.split("—")[1]?.trim();
  const mailtoLink = `mailto:?subject=Message to ${mpName}&body=${encodeURIComponent(emailBody)}`;
  window.location.href = mailtoLink;
});
