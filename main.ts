import * as ZxW_TC from "ZxW_TabContainer";
import * as ZxW_TB from "ZxW_Toolbar";
import * as ZxW_GUI from "ZxW_GUI";

import * as zjwt from "./lib/zjw-templates/main.js";

class App extends ZxW_GUI.DefaultApplication
{
    constructor() 
    {
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

/**
 * initialize zxw-mvc module
 */
ZxW_TC.init();

/**
 * initialize zjw-template module
 */
zjwt.main("./lib/zjw-templates",{enableToolbar : false}); 

/**
 *   Initialize Toolbar (akka menu bar)
 */
let toolBar: ZxW_TB.Toolbar = null;
const app = new App();
let toolbar = new ZxW_TB.Toolbar(null,app,null,{includedMenubarItems:["help"],useUserGuideFile: true});




console.log("module: main.js");