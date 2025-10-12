// Public Functions:

// Public Variables (!!! Without slash because replace issue !!!):
var websiteURL = "https://catwithcode.moe";
var websiteURLdnsFix = "https://catwithcode.github.io";

// To remove CSS from pages if wanted:
var cssReplacer = '<link rel="stylesheet" href="/Assets/styles.css">';

// Path to OnekoJS-File:
var onekoJsFile = '/Assets/SubScripts/OnekoJS/OnekoJS.js'

// STATICS - START ####################################################################################################
// (Hard-Coded on Deploy (Or on execution of reWriteStatics) so they can be loaded in Sync so Archvie-Pages and co. work).
// IMPORTANT: The loaded HTML MUST have a EMPTY LINE at the end!!!
// How it works:
// TRIGGER:
// const Name
// const Path
// >>> READ FILE WILL BE INSERED HERE! LEAVE LINE EMPTY <<<

// >>> MAIN <<<
// ### HARD_CODE_TRIGGER ###
// head
// Assets/BaseFiles/Head/Head.html
const head_STATIC_HTML_INSERT = '<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/Assets/styles.css"><meta name="darkreader-lock"><link rel="icon" type="image/x-icon" href="/Assets/favicon.gif"><meta name="description" content="Blog for random computer stuff from my daily life. Girl from Germany. Work as a Software Developer. Programming, Linux, Hacking, Modding and tinkering.">';

// ### HARD_CODE_TRIGGER ###
// header
// Assets/BaseFiles/Page/Header.html
const header_STATIC_HTML_INSERT = '<h2 id="Header_Border" align="center">  <a href="/"> <img src="/Assets/favicon.gif" alt="Cute Pixelart" style="width:55px;height:55px";></a>  <a href="/">CatWithCode</a>  <br>  <br>  <b>&nbsp;</b>  <a href="/blog.html">BLOG</a>  <b>&nbsp;</b>  <a href="/projects.html">PROJECTS</a>  <b>&nbsp;</b>  <a href="/MediaLibraries/MediaLibraries.html">LIBRARYS</a>  <b>&nbsp;</b>  <a href="/privacy.html">PRIVACY</a>  <b>&nbsp;</b>  <a href="/license.html">LICENSE</a>  <b>&nbsp;</b>  <a href="/contact.html">CONTACT</a>   <b>&nbsp;</b>  <a href="/Feed/RSS.xml">📡&nbsp;RSS</a>  <b>&nbsp;</b></h2>';

// ### HARD_CODE_TRIGGER ###
// footer
// Assets/BaseFiles/Page/Footer.html
const footer_STATIC_HTML_INSERT = '<h5 id="Fooder_Border">###DATE_TEXT###&nbsp;&nbsp;|&nbsp;&nbsp;©️ CatWithCode&nbsp;&nbsp;|&nbsp;&nbsp;###LICENSE###<br>&nbsp;&nbsp;Latest Build:<b>2025.10.13 - 00:28</b></h5>';

// >>> SUB <<<
// ### HARD_CODE_TRIGGER ###
// imageBody
// Assets/BaseFiles/Modules/ImageBody.html
const imageBody_STATIC_HTML_INSERT = '<div id="ImageBody" ###CCSS### ###LINK_BODY###" style="cursor: pointer;">    <img loading="lazy" src="###IMG_SRC###" alt="###ALT###">    <p><u>###DISC###</u></p>    <p>###DATE###</p></div>';

// ### HARD_CODE_TRIGGER ###
// speechBubble
// Assets/BaseFiles/Modules/SpeechBubble.html
const speechBubble_STATIC_HTML_INSERT = '<div class="speechBubble">    <div class="speechBubbleText">        <h2>What does Cat think about this?</h2>        <p>###TEXT###</p>    </div>    <img src="/Assets/Image_Repository/PNG/PLACEHOLDERs/empty.png" alt="Empty."></div>';

// >>> MISC <<<
// ### HARD_CODE_TRIGGER ###
// checkViewer
// Assets/BaseFiles/Modules/Misc/CheckViewer.html
const checkViewer_STATIC_HTML_INSERT = '<script type="text/javascript">checkViewerType();</script>';

// ### HARD_CODE_TRIGGER ###
// designPageWarning
// Assets/BaseFiles/Modules/Misc/DesignPageWarning.html
const designPageWarning_STATIC_HTML_INSERT = '<br><hr><h2>THE DESIGN YOU\'RE SEEING MY BE OUTDATED! DESIGN-ANNOUNCEMENT-PAGE\'S ARE KEPT IN THE ORIGINAL DESIGN SO IT CAN STILL BE VIEWED IN THE FUTURE. GO TO ANY OTHER PAGE OF MY WEBSITE TO SEE THE ACTUAL DESIGN. ANY OTHER ASPECT OF DESIGN-ANNOUNCEMENT-PAGE\'S EXCEPT FOR THE DESIGN ARE NOT KEPT ORIGINAL, MEANING THIS PAGE CAN LOOK BROKEN FROM TIME TO TIME!</h2><hr><br>';

// STATICS - END ##############################################################################################

// Wallpapers:
const wallpaperOptions = [
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/AutobahnFromAbove.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/BackRoom.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/BackStreets.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/BackStreetsWindows.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/Bar.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/BarFornt.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/Car_Streets.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/CultFront.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/CultInside.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/ServerRoom.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/Sniper.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/WalkWay.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/Window.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/Cube.jpg",
    "/Assets/Image_Repository/Backgrounds/Static/01_REPOSSESSED/ServerRoom2.jpg"
];

// - Main Components:
// - - Creating Page-Header:
function WriteHeader(skipCss = false) {
    // Set's Header Bar:
    document.getElementById("Header").innerHTML = (header_STATIC_HTML_INSERT);

    // Load Oneko:
    loadOneko();

    // Load random Background:
    if (!skipCss) {
        WriteBackgroundImageWithEffects();
    }
}

// - - Creating Page-Footer:
function WriteFooter(dateText, usedLicense = "CC BY-NC-ND 4.0") {
    document.getElementById("Footer").innerHTML = (footer_STATIC_HTML_INSERT).replace("###DATE_TEXT###", dateText).replace("###LICENSE###", usedLicense);
}

// - - Write HTML-Head (NOT async because of WebCrawler. Optonal CSS for "New Design"-Pages.):
function WriteHead(skipCss = false) {
    // Copy Static:
    var workHead = head_STATIC_HTML_INSERT;

    // CSS-Needed?:
    if (skipCss) {
        workHead = workHead.replace(cssReplacer, '');
    }

    document.write(workHead);
}

// - - Loads Oneko into the current page dynamically:
function loadOneko() {
   runOneko()
}

// - - Creates Background Image (Called from Header becaus good time to do so):
function WriteBackgroundImageWithEffects() {
    // Get Wallpaper at Random:
    const randomImage = wallpaperOptions[Math.floor(Math.random() * wallpaperOptions.length)];
    
    // Get Blur amount:
    const blurAmount = getCurrentStyle_Property("--backgroundBlur");
    
    // NO LONGER NEEDED BECAUSE SYNC:
    // Preload Image in Browser AND THEN set it:
    //await preloadImage(randomImage);

    // Creating div (For now IMG) and set Background (Use IMG to get around Body::before issue):
    const backgroundHolder = document.createElement('img');

    // Set Position:
    backgroundHolder.style.position = 'fixed';
    backgroundHolder.loading = 'lazy'; // PREVENT LAG.
    backgroundHolder.style.top = '0';
    backgroundHolder.style.bottom = '0';
    backgroundHolder.style.left = '0';
    backgroundHolder.style.right = '0';
    backgroundHolder.style.zIndex = -1;
    
    // Set Size:
    backgroundHolder.style.width = '100%';
    backgroundHolder.style.height = '100%';
 
    // Make it go to the edges:
    backgroundHolder.style.padding = 0;
    backgroundHolder.style.margin = 0;

    // Apply Filter:
    backgroundHolder.style.filter = `blur(${blurAmount})`;;
    
    // Configure Background behavior:
    backgroundHolder.style.objectFit = 'cover';
    backgroundHolder.style.backgroundSize = 'cover';
    backgroundHolder.style.backgroundRepeat = 'no-repeat';
    backgroundHolder.style.backgroundPosition = 'center';

    // Set Images and add to body (Most often at the end of the page):
    backgroundHolder.src = randomImage;
    backgroundHolder.alt = 'Error while loading random Background.'
    //backgroundHolder.style.backgroundImage = `url('${randomImage}')`;

    document.body.appendChild(backgroundHolder);
}

// - - Warning for "New Design"-Pages. Used to indicate the design currently shown may be old.):
// - - To use just copy/paste: "<script type="text/javascript">WriteDesignPageWarning();</script>"
function WriteDesignPageWarning() {
    document.write(designPageWarning_STATIC_HTML_INSERT);
}

// - ImageLibary Components 
// - - Creating the ImageLibary Header (NOT async because it breaks CSS):
function WriteImageLibaryHeader(titel_text) {
    var imageLibaryHeaderCode = '\
        \
        <h1><a href="/MediaLibraries/MediaLibraries.html" class="cleanText">&nbsp;🔙&nbsp;###TEXT###</a></h1>'
    
        document.write(imageLibaryHeaderCode.replace("###TEXT###", titel_text));
}

// - - Creating ImageBody [COULD BE MADE FAR BETTER!]:
function WriteImageBody(img_Source, alt_text, img_disc, uploadDate, newWindow = true, diffrentLink = '', maxWidthOverwrite = false, dateNeeded = true) {
    // Copy Static:
    var imageBodyCode = imageBody_STATIC_HTML_INSERT

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

// - - Gets, modifies and returns SpeechBubble-Code with text (Must be static, else class and evet CSS breaks!):
function CreateSpeechBubble(speechBubbleTextToInsert = "") {
    // Copy Static:
    var speechBubbleCode = speechBubble_STATIC_HTML_INSERT;

    // Adjust and write bubble:
    document.write(speechBubbleCode.replace("###TEXT###", (speechBubbleTextToInsert === "") ? "Nothing. Absolutely nothing." : speechBubbleTextToInsert));
}

// Internel Functions:

// - Misc:
// - - Fake JS-Sleep:
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// - - Loads File from a desired location asynchronously:
async function aSyncLoadFile(filePath) {
    return fetch(filePath)
        .then((response)=>response.text())
        .then((responseText)=>{return responseText});
}

// - - Preloads Images so they dont cause flicker (Depends on the Browser buffering already loaded Data):
function preloadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
    });
}

// This can load a Script file into the current page. Works with a callback. The return needs to be executed on, to launch the function in the script. See loadOneko for an example:
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Loads Oneko without being a Module or imported. This works with using a onload callback call to execute a method on. This is very VERY janky (This can be also be viewed as an example on how to use "loadScript"):
function runOneko() {
    loadScript(onekoJsFile, function() {
        // Call function after loading:
        window.oneko();
    });
}

// - - Access CurrentStylePropetys in Method call:
function getCurrentStyle_Property(propertyName) {
    // Getting current Style dynamically:
    const rootStyles = getComputedStyle(document.documentElement);
    return document.documentElement.style.backgroundColor = rootStyles.getPropertyValue(propertyName).trim();
}

// - - User Agent Checker (VERY JANKY):

// - - Loads ViwerChecker in a way Bots can not load (aSync dose not work. It can not execute JS-Function / Code when loaded):
async function creatCheckViewer() {
    document.write(checkViewer_STATIC_HTML_INSERT);
}

// - - Check if on DNS-Host or localy hosted, if not execute Anti-Bot forwarding:
// Variables only of executed because Performance.
function checkViewerType() {
    // NOTE: Breaks rehosting
    // if (!document.location.origin.includes(websiteURL) &&
    //     !(location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    if (document.location.origin.includes(websiteURLdnsFix)) {
        
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
