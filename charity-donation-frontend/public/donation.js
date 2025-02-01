document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    try {
        const initialized = await initWeb3();
        if (!initialized) return;

        const institutions = await contract.getInstitutions();
        renderInstitutions(institutions);

        if (!window.donationListenerAdded) {
            contract.on("DonationReceived", (donor, amount, institutionId) => {
                addDonationToUI({
                    donor,
                    amount: formatETH(amount),
                    institutionId,
                    timestamp: Date.now(),
                });
            });
            window.donationListenerAdded = true; // Prevent duplicate listeners
        }
    } catch (error) {
        console.error("Error loading institutions:", error);
    } finally {
        hideLoader();
    }
});
