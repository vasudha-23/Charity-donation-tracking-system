document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    try {
        const initialized = await initWeb3();
        if (!initialized) return;

        const owner = await contract.owner();
        const address = await signer.getAddress();
        if (address.toLowerCase() !== owner.toLowerCase()) {
            window.location.href = "/";
            return;
        }

        const [institutions, donations] = await Promise.all([
            contract.getInstitutions(),
            contract.getAllDonations(),
        ]);

        renderPendingApprovals(institutions);
        renderDonations(donations);
    } catch (error) {
        console.error("Admin page error:", error);
    } finally {
        hideLoader();
    }
});

function renderPendingApprovals(institutions) {
    const pending = institutions.filter((inst) => !inst.approved);
    const container = document.getElementById("pendingInstitutions");

    container.innerHTML = pending.map((inst) => `
        <div class="card mb-4">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-bold">${inst.name}</h4>
                    <p class="text-sm">${inst.description}</p>
                    <p class="text-xs text-gray-500">ID: ${inst.id}</p>
                </div>
                <button class="btn-primary approve-btn" data-id="${inst.id}">
                    Approve
                </button>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".approve-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            showLoader();
            try {
                const tx = await contract.approveInstitution(id);
                await tx.wait();
                location.reload();
            } catch (error) {
                console.error("Approval failed:", error);
            } finally {
                hideLoader();
            }
        });
    });
}
