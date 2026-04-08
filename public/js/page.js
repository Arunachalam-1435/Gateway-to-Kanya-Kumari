async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

// Run this when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Path is relative to the page calling the script
    loadComponent("main-header", "../includes/header.html");
    loadComponent("main-footer", "../includes/footer.html");
});
