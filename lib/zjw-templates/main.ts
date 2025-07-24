/**
 * @file main.ts
 * @author Zachary Wartell 
 */

import { on } from "npm";

class UserDocs
{
    htmlFragments : Array<string> = [];
    constructor()
    {
    }

    addDoc(htmlFragment : string)
    {
        this.htmlFragments.push(htmlFragment);
    }
}
export const userDocs = new UserDocs();

    


/**
 * @author Zachary Wartell
 * @brief In a .html doc using zjw-templates each instance (clone) of a zjw-template <template> given a unique HTML id attribute.
 * These id's will be unique for the life-time of the .html.  This requires the .html keep an associated saved set of values
 * representing the next id value that has never been used in that .html document.  class TemplateCloneID and Object templateCloneIDs
 * are used to implement this mechanism.
 */
class TemplateCloneID
{
    templateName : string;
    templateElement : HTMLTemplateElement | null = null;
    nextID : number = 0;

    constructor(templateName : string, templateElement : HTMLTemplateElement)
    {
        this.templateElement = templateElement;
        this.templateName = templateName;
    }

    /**
     * Assign this.nextID the next available unique id in the current document for the instances of this TemplateCloneID.templateElement.
     */
    updateNextID()
    {
        const instances=document.querySelectorAll("div."+this.templateName);
        let maxID = 0;        
        instances.forEach(
            (e : Element)=>
            {
                const he : HTMLElement = <HTMLElement>e;
                const splits=he.id.split('-');
                const id = parseInt(splits[1]);
                if (id !== null)
                {
                    if (id > maxID) maxID = id;
                }
            }
        );
        this.nextID=maxID+1;
    }

}

class TemplateCloneIDs
{
    map = new Map<string,TemplateCloneID>;    
    constructor()
    {
        
    }

    /**
     * {status: wip}
     */
    save() : void
    {   
        const out = JSON.stringify(this);        
        console.log(out);
    }

    /**
     * {status: wip}
     */
    load() : void
    {
        // ???
    }

}

const templateCloneIDs = new TemplateCloneIDs();


function initDoc()
{
    /**
     *  enable InfoDialog popup on all zjw-template <template> instances insert in the current DOM.
     */
    const es = document.querySelectorAll("div.Reference, div.Question, div.Todo,div.Idea");
    if (es !== null)
        for (let e of es) {
            e.addEventListener('mousedown', rightClick);
        }

    /**
     * init templateCloneIDs (this is mainly useful in the context of the execution of loadFile function )
     */
    const ts = document.querySelectorAll("template");
    for (let t of ts)
    {
        const tid : string | null = t.getAttribute("id");
        if (tid !== null)
        {            
            let clone : HTMLElement = <HTMLElement>t.content.cloneNode(true);
            let name = tid.replace("Template","");
            
            let cloneID : TemplateCloneID | undefined = templateCloneIDs.map.get(name);
            if (cloneID ===undefined || cloneID == null)
            {
                cloneID = new TemplateCloneID(name,t);
                templateCloneIDs.map.set(name,cloneID);
            }        
        }
    }            
}



const function_insertTemplate_DOCS=
`
<div class="UserInterfaceItem">
    <span>
    function insertTemplate:  Inserts a ZJW <template> at the active cursor in the current webpage (assuming the HTML attribute 'contendeditable' is enabled).
    </span>
    <h2>Usage:<h2>
    <section>
        <h3>Browser debug console</h3>
        <code><pre>
            > insertTemplate("Reference")
            > insertTemplate("Todo")            
        </pre></code>
    </section>
</div>        
`;
userDocs.addDoc(function_insertTemplate_DOCS);
/**
@brief See function_insertTemplate_DOCS

REFERENCES:
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
*/
export function insertTemplate(name : string, parentElement : HTMLElement | null = null ) : HTMLElement | null
{
    const t : HTMLTemplateElement | null = <HTMLTemplateElement>document.getElementById(name+"Template");
    if (t !== null)
    {            
        let clone : HTMLElement = <HTMLElement>t.content.cloneNode(true);
        
        let cloneID : TemplateCloneID | undefined = templateCloneIDs.map.get(name);
        if (cloneID ===undefined || cloneID == null)
        {
            cloneID = new TemplateCloneID(name,t);
            templateCloneIDs.map.set(name,cloneID);
        }        

        let insertAt : HTMLElement | null = null;
        if (parentElement !== null)
            insertAt = parentElement;
        else
        {
            insertAt = window.getSelection()?.focusNode?.parentElement ?? null;            
            //const insertAt = document.caretPositionFromPoint().offsetNode;
        }
        if (insertAt !== undefined && insertAt !== null)
        {
            insertAt.appendChild(clone);
            clone = <HTMLElement>insertAt.lastElementChild;            
        }           
        else
            return null;
            //throw "(insertAt !== null)";

        clone.setAttribute("id", cloneID.templateName + "-" + cloneID.nextID.toFixed(0));
        clone.addEventListener('mousedown', rightClick);
        cloneID.nextID++;                
        return clone;
    }
    return null;
}

export function insert(name : string) : void
{
    const insertAt = window.getSelection()?.focusNode?.parentElement;
    if (insertAt !== undefined && insertAt !== null)
    {
        const element = document.createElement(name);
        insertAt.appendChild(element);        
    }
}

const function_help_DOCS=
`
<div>
    <span>
    function help:  help popups a dialog displaying the user documentation associated with a 
    </span>
    <h2>Usage:<h2>
    <section>
        <h3>Browser debug console</h3>
        <code><pre>
            > help(SaveLoader.DOCS)
        </pre></code>
    </section>
</div>        
`;
userDocs.addDoc(function_help_DOCS);

export function help(docs : string) : void // object : any): void //object : any)
{    
    //const DOCS=object.prototype["DOCS"];    
    const html=
    `
        <dialog>
            ${docs}
        </dialog>
    `;
    const d= <HTMLDialogElement>document.createElement("dialog");
    document.body.appendChild(d);
    d.outerHTML = html;
    (<HTMLDialogElement>document.body.lastElementChild).showModal();

    console.log("help watch frog frog");
}
/**
 *  @brief SaveLoader save or loads outHTML of the element \a body into a stripped down .html file 
 *  selected by the user using showSaveFilePicker (https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker).
 *  
 *  What is stripped out?
 *      - The child nodes of any HTMLElement with attribute:   data-zjw-ai="dynamic-content"'
 * 
 */
export class SaveLoader
{
    static DOCS=    
    `
    <div class="UserInterfaceItem">
        <span>
        SaveLoader:  SaveLoader save or loads outHTML of the element \a body into a stripped down .html file 
        selected by the user using showSaveFilePicker (https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker).
        </span>
        <h2>Usage:<h2>
        <section>
            <h3>Web browser debug console</h3>
        
            <code><pre>
                let sl = new SaveLoader()
                sl.save(document.body)     
            </pre></code>
        </section>
    </div>
    `;

    private fileHandle : FileSystemFileHandle | null = null;
    private saveLoadTarget : HTMLElement | null = null;

    public load (loadTarget : HTMLElement | null) : void
    {
        if (loadTarget === null)
            loadTarget = this.saveLoadTarget;
        if (this.fileHandle !== null)
        {
        }
        else
        {
        const options = {
            types: [
                {
                    description: 'Html Files',
                    accept: {
                        'text/html': ['.html'],
                    },
                    multiple: false
                },
            ],
        };
        (<any>window).showOpenFilePicker(options).
        then(
            (handles : any)=>
            {
                console.log("Open " + handles);
                this.fileHandle = handles[0];
                if (loadTarget === null)
                    loadTarget = this.saveLoadTarget;
                if (loadTarget === null) throw "loadTarget === null";
                this.loadFile2(handles,loadTarget);               
            }).
        catch(
            (e : any)=> { throw e;}
            );        
        }
    }
    public save (saveTarget : HTMLElement | null) 
    {
        if (saveTarget === null)
            saveTarget = this.saveLoadTarget;
        if (saveTarget === null)
        {
            console.log("save (saveTarget : HTMLElement | null)"+"saveTarget === null");
            return;
        }
        if (this.fileHandle !== null)
        {
            console.log("Save " + this.fileHandle);
            let cloneBody : HTMLElement = <HTMLElement>saveTarget.cloneNode(true);
            cloneBody.querySelectorAll('*[data-zjw-ai="dynamic-content"').forEach(
                (e)=>
                {
                    console.log(e);
                    for (let c of e.children)
                        e.removeChild(c);
                    if (e instanceof HTMLElement)
                        e.innerText = "";
                }
            );
            return SaveLoader.writeFile(this.fileHandle,
                `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>ZJW AI Journal - Manual</title>
                    </head>
                    <body>
                    `
                + cloneBody.innerHTML +
                `
                    </body>
                    </html>
                    `
            );
        }
        else
        {
            try
            {
                const options = {
                    types: [
                        {
                            description: 'Html Files',
                            accept: {
                                'text/html': ['.html'],
                            },
                        },
                    ],
                };
                (<any>window).showSaveFilePicker(options).
                then(
                    (handle : FileSystemFileHandle)=>
                    {
                        console.log("Save " + handle);
                        if (saveTarget === null)
                            {
                                console.log("save (saveTarget : HTMLElement | null)"+"saveTarget === null");
                                return;
                            }                            
                        this.fileHandle = handle;
                        let cloneBody : HTMLElement = <HTMLElement>saveTarget.cloneNode(true);
                        //let cloneBody = body;
                        let cleanClone : HTMLElement | null=null;
                        if (true)
                        {
                            cloneBody.querySelectorAll('*[data-zjw-ai="dynamic-content"').forEach(
                                (e)=>
                                {
                                    console.log(e);                                    
                                    let next : HTMLElement | null = null;
                                    for (let cursor = e.firstChild; cursor !== null;)
                                    {
                                        next = <HTMLElement>cursor.nextSibling;
                                        e.removeChild(cursor);
                                        cursor = next;
                                    }
                                    for (let c of e.children)
                                        e.removeChild(c);
                
                                }
                            );
                            cleanClone =  <HTMLElement>cloneBody.cloneNode(true);
                            cleanClone.querySelectorAll('*[data-zjw-ai="dynamic-content"').forEach(
                                (e)=>
                                {
                                    if (e.childElementCount !== 0)
                                    {
                                        console.log(e);
                                        throw `cleanClone.querySelectorAll('*[data-zjw-ai="dynamic-content"')`;    
                                    }
                                });
                        }
                        else
                            cleanClone = cloneBody; 
                        if (cleanClone === null) throw "cleanClone === null";
                        return SaveLoader.writeFile(handle,
                        ` 
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <title>ZJW AI Journal - Manual</title>
                        </head>
                        <body>
                        `
                            + cleanClone.innerHTML +
                            `
                        </body>
                        </html>
                        `
                        );
                    }).
                catch(
                    (e : any)=> 
                        { 
                            throw e;
                        }
                );
            } catch (e:any)
            { 
                throw e;
            }          
        }        
    }    

    private async loadFile2(fileHandles : FileSystemFileHandle[], loadTarget : HTMLElement)
    {
        const file = await fileHandles[0].getFile();
        this.loadFile(file,loadTarget);
    }
    private loadFile(file : File,loadTarget : HTMLElement)
    {
        const reader = new FileReader();
        /*
         (?) must be 'loadend' on mobile phone 'load' event triggers multiple times for large files
         */
        reader.addEventListener('loadend', 
            (event : ProgressEvent<FileReader> ) =>
                {
                    //const loadTarget : HTMLElement = document.body;
                    if (event.target === null) throw "event.target === null";
                    if (event.target.result !== null)
                    {
                        const split = event.target.result.toString().split(/<body>|<\/body>/);            
                        loadTarget.innerHTML = split[1];    
                        if (this.saveLoadTarget === null)
                            this.saveLoadTarget = loadTarget;
                        onLoad();
                        /*
                            const t : HTMLTemplateElement | null = <HTMLTemplateElement>document.getElementById(name+"Template");
    if (t !== null)
    {            
        let clone : HTMLElement = <HTMLElement>t.content.cloneNode(true);
        
        let cloneID : TemplateCloneID | undefined = templateCloneIDs.map.get(name);
        if (cloneID ===undefined || cloneID == null)
        {
            cloneID = new TemplateCloneID(name,t);
            templateCloneIDs.map.set(name,cloneID);
        }        

                        */
                        if (zjwtOptions.onLoadCallback !== null) zjwtOptions.onLoadCallback();
                    }
                });
        reader.readAsText(<Blob>file);
    }

    /*
    https://web.dev/file-system-access/
    */
    static 
    async writeFile(fileHandle : FileSystemFileHandle, dom : string)
    {
        // Create a FileSystemWritableFileStream to write to.
        // type key = (typeof fileHandle)[keyof (typeof fileHandleJ)];
        if ("createWritable" in fileHandle)
        {
            const key = "createWritable";
            const writable = await (<Function>fileHandle[key])();
            // Write the contents of the file to the stream.
            await writable.write(dom);
            // Close the file and write the contents to disk.
            await writable.close();    
        }
    }
}
userDocs.addDoc(SaveLoader.DOCS);


function rightClick(event_ : Event) : void
{    
    const event : MouseEvent = <MouseEvent>event_;
    if (event.ctrlKey)
    {
        const t = <HTMLElement>event.target;
        if (t !== null)
            infoDialog?.open(t.classList.toString() + " [" + t.id + "]" + (t.dataset.zjwAi ?? ""));
    }                
}

export function onLoad()
{
    initDoc();
    /**
    * update all template id counters based on the maximum id values found in newly loaded file
    */
    for (let tid of templateCloneIDs.map)                
        tid[1].updateNextID();                
}

/**
 * @brief See InfoDialog.DOCS
 * REFERENCES
 * - "obscure bug" https://stackoverflow.com/questions/60365510/html5-dialog-element-close-button-not-working-properly
 */
class InfoDialog
{
    static DOCS=
    `
    InfoDialog [work-in-progress] when you mouse press with the Ctrl key on any instance of a ZJW <template> a popup dialog will appear with information about the
    <template> instance.
    <div class="UserInterfaceItem">
        InfoDialog [work-in-progress] when you mouse press with the Ctrl key on any instance of a ZJW <template> a popup dialog will appear with information about the
        <template> instance.
    </div>
    `
    constructor()
    {
        if (InfoDialog.html === null)
        {
            InfoDialog.html = <HTMLDialogElement>document.createElement("Dialog");
            document.body.appendChild(InfoDialog.html);
            InfoDialog.html.outerHTML = InfoDialog.outerHTML;            
            let d : HTMLDialogElement | null = <HTMLDialogElement>document.getElementById('InfoDialog');
            if (d !== null)
                InfoDialog.html = d;
        }           
    }   

    open(message : string) : void
    {   
        console.log(InfoDialog.html);
        (<HTMLSpanElement>InfoDialog.html?.children[0]).innerText = message;
        InfoDialog.html?.showModal();
    }
    static outerHTML : string =
    `<dialog id='InfoDialog'>
        <span></span>
        <hr>
        <button onclick="console.log('close');  let d = document.getElementById('InfoDialog'); d.close();"> Ok </button>
    </dialog>
    `;
    static html : HTMLDialogElement | null = null;
}
userDocs.addDoc(InfoDialog.DOCS);

//const infoDialog : InfoDialog = new InfoDialog();
let infoDialog : InfoDialog | null = null;


class InsertTemplateDialog
{
    static DOCS=
    `
    InsertTemplateDialog 
    [work-in-progress] when you mouse press with the "Ctrl+t" a popup dialog will appear listing the zjw-template <templates>
    that can be inserted into the current .html document at it's current cursor location.    
    <div class="UserInterfaceItem">
        InsertTemplateDialog 
        [work-in-progress] when you mouse press with the "Ctrl+t" a popup dialog will appear listing the zjw-template <templates>
        that can be inserted into the current .html document at it's current cursor location.        
    </div>
    `    
    constructor(templateDiv : HTMLDivElement)
    {
        if (InsertTemplateDialog.html === null)
        {
            InsertTemplateDialog.html = <HTMLDialogElement>document.createElement("Dialog");
            document.body.appendChild(InsertTemplateDialog.html);
            InsertTemplateDialog.html.outerHTML = InsertTemplateDialog.outerHTML;            
            let d : HTMLDialogElement | null = <HTMLDialogElement>document.getElementById('InsertTemplateDialog');
            if (d !== null)
            {
                InsertTemplateDialog.html = d;
                const s : HTMLSelectElement = <HTMLSelectElement>InsertTemplateDialog.html.querySelector(":scope select");
                if (s === null) throw "if (s === null)";
                const tv = templateDiv;
                if (tv === null) throw "if (tv === null)";                                
                for (let t_ of tv.children)
                {
                    const t : HTMLElement = <HTMLElement>t_;
                    console.log("t.tagName:",t.tagName);
                    if (t.tagName === "TEMPLATE")
                    {
                        const o : HTMLOptionElement = document.createElement("option");
                        s.appendChild(o);
                        o.innerText = t.id;
                        o.value = t.id.replace("Template","");
                    }
                }
                s.addEventListener('input',
                    (e_ : InputEventInit)=>
                    {
                        const e : InputEvent = <InputEvent>e_;
                        InsertTemplateDialog.html?.close();
                        insertTemplate((<HTMLSelectElement>e.target).value);                                                
                    });      
                const ok = <HTMLButtonElement>d.querySelector(":scope button:nth-of-type(2)");                                
                if (ok === null) throw "(ok === null)";
                ok.addEventListener('click',
                    (e)=>
                    {
                        InsertTemplateDialog.html?.close();
                        insertTemplate(s.value);                                                
                    });                
            }
        }           
    }   

    open(message : string) : void
    {   
        console.log(InsertTemplateDialog.html);
        (<HTMLSpanElement>InsertTemplateDialog.html?.children[0]).innerText = message;
        InsertTemplateDialog.html?.showModal();
    }
    static outerHTML : string =
    `<dialog id='InsertTemplateDialog'>
        <span>Insert Template</span>
        <div style="display:flex; flex-direction:column;">            
            <select>        
            </select>     
            <div style="display:flex;flex-direction:row;">
                <button onclick="let d = document.getElementById('InsertTemplateDialog'); d.close();"> Cancel </button>
                <button onclick="console.log('close');  let d = document.getElementById('InsertTemplateDialog'); d.close();"> Ok </button>
            </div>       
        </div>
    </dialog>
    `;
    static html : HTMLDialogElement | null = null;
}
let insertTemplateDialog : InsertTemplateDialog | null = null;
userDocs.addDoc(InsertTemplateDialog.DOCS);


class Options
{
    enableToolbar : boolean=true;
    onLoadCallback : Function | null = null;
    constructor()
    {
    }
}
let zjwtOptions = new Options();
/**
 * MAIN
 * @param libPath - path to zjw-template directory relative to the main .html document of the page using the ZJW Template git-module.
 */
export function main (libPath : string, options_ : any = null) : void
{
    /**
     * Create zjw-template UI Elements 
     */
    infoDialog = new InfoDialog();
    

    if (options_ !== null)
    {
        zjwtOptions.enableToolbar = options_.enableToolbar ?? null;
        zjwtOptions.onLoadCallback = options_.onLoadCallback ?? null;
    }


    /**
     * load <template>'s from zjw-templates.html and insert them into the current DOM (of the .html page using the zjw-template module).
     */
    const req : XMLHttpRequest = new XMLHttpRequest();
    console.log("main (libPath : string) : void");
    req.addEventListener("load", 
        (e : ProgressEvent)=>
        {
            let div : HTMLDivElement | null = <HTMLDivElement>document.getElementById("ZJW_TEMPLATES");
            if (e.target !== null)
            {                
                if (div !== null)
                {
                    document.body.appendChild(div);
                    div.innerHTML = (<XMLHttpRequest>e.target).responseText;
                }
                else
                {
                    div = <HTMLDivElement>document.createElement("div");                    
                    div.setAttribute("id","ZJW_TEMPLATES");
                    document.body.appendChild(div);
                    div.innerHTML = (<XMLHttpRequest>e.target).responseText;
                    console.log(e);    
                }
            insertTemplateDialog = new InsertTemplateDialog(div);                
            }
            else
                throw "e.target !== null";
        }
    );
    req.open("GET", libPath+"/zjw-templates.html");
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send();

    if (zjwtOptions.enableToolbar)
    {
        /**
         *  Implement and Setup Save Button
         */
        const saveButton : HTMLButtonElement = document.createElement("button");
        saveButton.innerText="Save";
        saveButton.addEventListener('click',
            (e)=>
            {
                try
                {
                    let sl = new SaveLoader();
                    sl.save(document.body);    
                }
                catch (e:any)
                {
                    console.log("Error",e);
                    throw e;
                }
            }
        )
        const div = document.createElement('div');
        div.style.border = "1px solid black";
        div.style.backgroundColor = "lightgray";
        div.appendChild(saveButton);
        document.body.insertBefore(div,document.body.firstChild);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    /**
     * I can't get the browser to stop popping up it's f'ing default popup menu
     */
    if(false)
        document.body.addEventListener("mousedown",
            (e: MouseEvent)=>
            {
                if (e.altKey && e.button == 2)
                {
                    console.log("mousedown + <ALT>");
                    insertTemplateDialog?.open("");
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log(
                        `
                        insertTemplateDialog?.open("");
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        `
                    )
                }
                
            },
            {capture: true});    
    document.body.addEventListener("keydown",
        (e: KeyboardEvent)=>
        {
            if (e.altKey && e.key == "t")
            {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                console.log("<ALT> + t");
                insertTemplateDialog?.open("");
            }
            
        },
        {capture: true});    
    

    const CONFIRM_contenteditable = false;        
    // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    document.body.addEventListener("keydown",
        (e: KeyboardEvent)=>
        {
            if (e.key == "Escape")
            {
                const ud = document.getElementById("UserDocument");
                if (ud !== null)
                {
                    if(ud.getAttribute("contenteditable") === null)
                    {
                        if (CONFIRM_contenteditable)
                            confirm("'contenteditable' Enabled.");
                        ud.setAttribute("contenteditable","");
                        document.body.style.backgroundColor = "beige";
                    }
                    else  
                    {
                        if (CONFIRM_contenteditable)                            
                            confirm("'contenteditable' Disabled.");
                        ud.removeAttribute("contenteditable");
                        document.body.style.backgroundColor = "white";
                    }
                }
            }
        });

    initDoc();    
    
    console.log(userDocs);
}
