// Public Functions:

// Public Variables (Without slash because replace issue):
var websiteURL = "https://catwithcode.moe";

// - Main Components:
// - - Creating Page-Header:
async function WriteHeader() {
    document.getElementById("Header").innerHTML = await this.aSyncLoadFile('/Assets/BaseFiles/Page/Header.html');
}

// - - Creating Page-Footer:
async function WriteFooter(dateText, usedLicense = "CC BY-NC-ND 4.0") {
    document.getElementById("Footer").innerHTML = (await this.aSyncLoadFile('/Assets/BaseFiles/Page/Footer.html')).replace("###DATE_TEXT###", dateText).replace("###LICENSE###", usedLicense);
}

// - - User Agent Checker:

// - - Loads ViwerChecker in a way Bots can not load (aSync dose not work. It can not execute JS-Function / Code when loaded):
async function creatCheckViewer() {
    document.write('\
        \
            <script type="text/javascript">checkViewerType();</script>\
    ');
}

// - - Check if on DNS-Host or localy hosted, if not execute Anti-Bot forwarding:
// Variables only of executed because Performance.
function checkViewerType() {
    if (!document.location.origin.includes(websiteURL) &&
        !(location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
        
        // Variables (toString because else it would work on the internel Refernece):
        let currentHost = document.location.origin.toString()
        let currentHostPage = document.location.toString()
        
        // Change page to real Host:
        window.location.replace(currentHostPage.replace(currentHost, websiteURL));
    } else { //IF NOT ON DNS-FIX OR LOCAL HOSTED:
        // Ger Reference:
        var div = document.getElementById("viewerChecker");

        // Remove DIV:
        if (div) {
            div.remove();
        }
    }
}

// - - Write HTML-Head (NOT async because of WebCrawler):
function WriteHead() {
    document.write('\
    \
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
        <link rel="stylesheet" href="/Assets/styles.css">\
        <link rel="icon" type="image/x-icon" href="/Assets/favicon.gif">\
        <meta name="description" content="Blog for random computer stuff from my daily life. Girl from Germany. Work as a Software Developer. Programming, Linux, Hacking, Modding and tinkering.">\
    ');
}

// - ImageLibary Components 
// - - Creating the ImageLibary Header (NOT async because it breaks CSS):
function WriteImageLibaryHeader(titel_text) {
    var imageLibaryHeaderCode = '\
        \
        <h1><a href="/MediaLibraries/MediaLibraries.html" class="cleanText">&nbsp;🔙&nbsp;###TEXT###</a></h1>'
    
        document.write(imageLibaryHeaderCode.replace("###TEXT###", titel_text));
}

// - - Creating ImageBody (NOT async because it breaks CSS) [COULD BE MADE FAR BETTER!]:
function WriteImageBody(img_Source, alt_text, img_disc, uploadDate, newWindow = true, diffrentLink = '', maxWidthOverwrite = false) {
    var imageBodyCode = '\
        \
        <div id="ImageBody" ###CCSS### ###LINK_BODY###" style="cursor: pointer;">\
            <img src="###IMG_SRC###" alt="###ALT###">\
            <p><u>###DISC###</u></p>\
            <p>###DATE###</p>\
        </div>'

    // Using the wanted Link:
    var linkTo = (diffrentLink != '') ? diffrentLink : img_Source;

    // BOOLEAN SAFE Link opener:
    var linkType = (newWindow === true) ? 'onclick="window.open(\'###LINK###\');' : 'onclick="location.href=\'###LINK###\';';

    // Custom Width:
    var customCss = (maxWidthOverwrite === true) ? 'style="min-width:98%; padding: 2px; border: var(--image_border) solid var(--foreground);"' : '';

    document.write(imageBodyCode.replace("###CCSS###", customCss)     // 100% MaxWidth
                                .replace("###LINK_BODY###", linkType) // Link Body
                                .replace("###LINK###", linkTo)        // Link
                                .replace("###IMG_SRC###", img_Source) // Image
                                .replace("###ALT###", alt_text)       // Alt-Text
                                .replace("###DISC###", img_disc)      // Description
                                .replace("###DATE###", uploadDate)    // Date of Upload
    );          
}

// Internel Functions:

// - Misc:
// - - Loads File from a desired location asynchronously:
async function aSyncLoadFile(filePath) {
    return fetch(filePath)
        .then((response)=>response.text())
        .then((responseText)=>{return responseText});
}
