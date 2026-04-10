async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const content = await response.text();
        var dom = document.getElementById(elementId);
        if(dom){
            dom.innerHTML = content;
        }
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("main-header", "../includes/main-header.html");
    loadComponent("header", '../includes/header.html');
    loadComponent("main-footer", "../includes/footer.html");
});