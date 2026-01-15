document.getElementById("findBtn").addEventListener("click", () => {
    const postcode = document.getElementById("postcode").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    // UK postcode regex
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

    // 1. Validate postcode
    if (!postcodeRegex.test(postcode)) {
        resultDiv.textContent = "Please enter a valid UK postcode.";
        return;
    }

    // 2. Call real API
    const url = `https://www.theyworkforyou.com/api/getMP?postcode=${encodeURIComponent(postcode)}&output=json`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data || data.error) {
                resultDiv.textContent = "No MP found for that postcode.";
                return;
            }

            resultDiv.innerHTML = `
                <h2>${data.name}</h2>
                <p><strong>Party:</strong> ${data.party}</p>
                <p><strong>Constituency:</strong> ${data.constituency}</p>
                <p><a href="${data.url}" target="_blank">View profile</a></p>
            `;
        })
        .catch(err => {
            resultDiv.textContent = "Error contacting lookup service.";
            console.error(err);
        });
});
