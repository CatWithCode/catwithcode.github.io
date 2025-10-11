// Public Functions:

// Public Variables (Without slash because replace issue):
var websiteURL = "https://catwithcode.moe";
var websiteURLdnsFix = "https://catwithcode.github.io";

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
async function WriteHeader() {
    // Set's Header Bar:
    document.getElementById("Header").innerHTML = (await this.aSyncLoadFile('/Assets/BaseFiles/Page/Header.html'));

    // Load random Background:
    WriteBackgroundImageWithEffects()
}

// - - Creating Page-Footer:
async function WriteFooter(dateText, usedLicense = "CC BY-NC-ND 4.0") {
    document.getElementById("Footer").innerHTML = (await this.aSyncLoadFile('/Assets/BaseFiles/Page/Footer.html')).replace("###DATE_TEXT###", dateText).replace("###LICENSE###", usedLicense);
}

// - - Write HTML-Head (NOT async because of WebCrawler. Optonal CSS for "New Design"-Pages.):
function WriteHead(skipCss = false) {
    // Beginning:
    document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    
    // CSS-Needed?:
    if (!skipCss) {
        document.write('<link rel="stylesheet" href="/Assets/styles.css">');
    }

    // DarkMode:
    document.write('<meta name="darkreader-lock">');

    // END:
    document.write('<link rel="icon" type="image/x-icon" href="/Assets/favicon.gif">\
        <meta name="description" content="Blog for random computer stuff from my daily life. Girl from Germany. Work as a Software Developer. Programming, Linux, Hacking, Modding and tinkering.">');
}

// - - Creates Background Image (Called from Header becaus good time to do so):
async function WriteBackgroundImageWithEffects() {
    // Get Wallpaper at Random (Fit't header good. More custom call's not good):
    const randomImage = wallpaperOptions[Math.floor(Math.random() * wallpaperOptions.length)];
    
    // Get Blur amount:
    const blurAmount = getCurrentStyle_Property("--backgroundBlur");
    
    // Preload Image in Browser AND THEN set it:
    await preloadImage(randomImage);

    // Creating div (For now IMG) and set Background (Use IMG to get around Body::before issue):
    const backgroundHolder = document.createElement('img');

    // Set Position:
    backgroundHolder.style.position = 'fixed';
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
    document.write('<br>\
        <hr>\
        <h2>THE DESIGN YOU\'RE SEEING MY BE OUTDATED! DESIGN-ANNOUNCEMENT-PAGE\'S ARE KEPT IN THE ORIGINAL DESIGN SO IT CAN STILL BE VIEWED IN THE FUTURE. GO TO ANY OTHER PAGE OF MY WEBSITE TO SEE THE ACTUAL DESIGN. ANY OTHER ASPECT OF DESIGN-ANNOUNCEMENT-PAGE\'S EXCEPT FOR THE DESIGN ARE NOT KEPT ORIGINAL, MEANING THIS PAGE CAN LOOK BROKEN FROM TIME TO TIME!</h2>\
        <hr>\
        <br>');
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
function WriteImageBody(img_Source, alt_text, img_disc, uploadDate, newWindow = true, diffrentLink = '', maxWidthOverwrite = false, dateNeeded = true) {
    var imageBodyCode = '\
        \
        <div id="ImageBody" ###CCSS### ###LINK_BODY###" style="cursor: pointer;">\
            <img src="###IMG_SRC###" alt="###ALT###">\
            <p><u>###DISC###</u></p>'

    //Date needed?:
    imageBodyCode += (dateNeeded === true) ? '<p>###DATE###</p>\
                                            </div>' : '</div>';

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
    var speachBubbleCode = '\
    \
    <div class="speechBubble">\
        <div class="speechBubbleText">\
            <h2>What does Cat think about this?</h2>\
            <p>###TEXT###</p>\
        </div>\
        <img src="/Assets/Image_Repository/PNG/PLACEHOLDERs/empty.png" alt="Empty.">\
    </div>';

    document.write(speachBubbleCode.replace("###TEXT###", (speechBubbleTextToInsert === "") ? "Nothing. Absolutely nothing." : speechBubbleTextToInsert));
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

// - - Access CurrentStylePropetys in Method call:
function getCurrentStyle_Property(propertyName) {
    // Getting current Style dynamically:
    const rootStyles = getComputedStyle(document.documentElement);
    return document.documentElement.style.backgroundColor = rootStyles.getPropertyValue(propertyName).trim();
}

// - - User Agent Checker (VERY JANKY):

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