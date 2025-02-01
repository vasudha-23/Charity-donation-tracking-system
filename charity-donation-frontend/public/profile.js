document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    try {
        const initialized = await initWeb3();
        if (!initialized) return;

        const address = await signer.getAddress();
        const donations = await contract.getAllDonations();
        const userDonations = donations.filter((d) => d.donor.toLowerCase() === address.toLowerCase());

        renderDonations(userDonations);
    } catch (error) {
        console.error("Profile page error:", error);
    } finally {
        hideLoader();
    }
});

function renderDonations(donations) {
    const container = document.getElementById("donationsList");
    container.innerHTML = donations.map((d) => `
        <div class="card mb-4">
            <div>
                <h4 class="font-bold">${d.institutionId}</h4>
                <p class="text-sm">${formatETH(d.amount)} ETH</p>
                <p class="text-xs text-gray-500">
                    ${new Date(d.timestamp * 1000).toLocaleString()}
                </p>
            </div>
            <span class="text-green-600">✓ Completed</span>
        </div>
    `).join("");
}
