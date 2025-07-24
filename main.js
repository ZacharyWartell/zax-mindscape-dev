import * as ZxW_Annotation from "ZxW_Annotation";
import * as ZxW_TextEditor from "ZxW_TextEditor";
import * as ZxW_TB from "ZxW_Toolbar";
import * as ZxW_GUI from "ZxW_GUI";
import * as zjwt from "./lib/zjw-templates/main.js";
class App extends ZxW_GUI.DefaultApplication {
    constructor() {
        super();
    }
    // private fileHandle_: FileSystemHandle | null = null;
    // get fileHandle() { return this.fileHandle_; }
    // set fileHandle(fh: any) { this.fileHandle_ = fh; }
    postUserDocumentLoadCallback() {
        //onLoad();
        zjwt.onLoad();
    }
}
export async function main() {
    /**
     * initialize zxw-mvc module
     */
    ZxW_GUI.init();
    /**
     * initialize zjw-template module
     */
    zjwt.main("./lib/zjw-templates", { enableToolbar: false });
    /**
     *   Initialize Toolbar (akka menu bar)
     */
    let toolBar = null;
    const app = new App();
    let toolbar = new ZxW_TB.Toolbar(null, app, null, { includedMenubarItems: ["help"], useUserGuideFile: true });
    ZxW_Annotation.main(toolbar);
    //await ZxW_TextEditor.main(toolbar);
    ZxW_TextEditor.main(toolbar);
    console.log("module: main.js");
}
main();
//# sourceMappingURL=main.js.map