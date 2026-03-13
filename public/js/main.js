async function loadComponents(id, file){
    var res = await fetch(file);
    var html = await res.text();
    document.getElementById(id).innerHTML = html;
}
loadComponents("id1", "/components/header.html");