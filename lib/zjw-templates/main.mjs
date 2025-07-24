/**
 for now this can only be called from the debug console window.

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
*/
export function insertTemplate(name) {
    const t = document.getElementById(name + "Template");
    if (t !== null) {
        const clone = t.content.cloneNode(true);
        const insertAt = document.getElementById("TestingSection");
        if (insertAt !== null)
            insertAt.appendChild(clone);
        else
            throw "(insertAt !== null)";
    }
}
export function main(libPath) {
    const req = new XMLHttpRequest();
    console.log("main (libPath : string) : void");
    req.addEventListener("load", (e) => {
        if (e.target !== null) {
            const div = document.createElement("div");
            document.body.appendChild(div);
            div.outerHTML = e.target.responseText;
            console.log(e);
        }
        else
            throw "e.target !== null";
    });
    req.open("GET", "./zjw-templates.html");
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send();
}
