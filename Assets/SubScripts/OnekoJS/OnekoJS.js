// oneko.js
// oneko.js: https://github.com/adryd325/oneko.js
//
// MIT
// https://adryd.com/
// https://github.com/adryd325/oneko.js
// https://en.wikipedia.org/wiki/Neko_(software)
// https://en.wikipedia.org/wiki/Keiji_Gotoh
// /Assets/SubScripts/OnekoJS/LICENSE/LICENSE
// LICENSE/LICENSE

// oneko.js.cwc
// oneko.js.cwc: https://github.com/CatWithCode/oneko.js.cwc

// MIT
// /Assets/SubScripts/OnekoJS/LICENSE/LICENSE
// LICENSE/LICENSE

// Notes:
// Encapsulation for direct execution, standalone:
// Function-Wrapper:
(function() {
    // Main Function:
    window.oneko = function() {
      // VARIABLES: ####################################################################################################
      // Neko-Container and File:
      const nekoContainer = document.createElement("div");
      const nekoFile = "/Assets/SubScripts/OnekoJS/Assets/oneko.gif"
      
      // >>> Adjustable Variables - START <<<

      // Speed and Scale:
      const nekoSpeed = 60;
      const nekoScaling = 5;

      // Behavior:
      const nekoSleep = 100;
      const nekoMinDistance = 280;
      const randomIdleEventDelay = 10;
      const randomIdleEventOffset = 200;
      const sleepyOffset = 8;
      const maxSleepTime = 192;
      const maxIdleAnimationTime = 9;
      const minWallDistance = 16;
      const minWallDistanceToScratch = 32;

      // Start-Position:
      const ranomStartPositon = true;
      const nekoStartPosX = 32;
      const nekoStartPosY = 32;

      // >>> Adjustable Variables - END <<<

      // Nekos Position:
      let nekoPosX = 0;
      let nekoPosY = 0;

      // Mouse Position:
      let mousePosX = 0;
      let mousePosY = 0;

      // States:
      let frameCount = 0;
      let idleTime = 0;
      let idleAnimation = null;
      let idleAnimationFrame = 0;
      let lastFrameTimestamp = 0;

      // Running Speed:
      let currentScaledNekoSpeed = 0;

      // Sprite locations:
      const spriteSets = {
        idle: [
          [-3, -3]
        ],
        alert: [
          [-7, -3]
        ],
        scratchSelf: [
          [-5, 0],
          [-6, 0],
          [-7, 0],
        ],
        scratchWallN: [
          [0, 0],
          [0, -1],
        ],
        scratchWallS: [
          [-7, -1],
          [-6, -2],
        ],
        scratchWallE: [
          [-2, -2],
          [-2, -3],
        ],
        scratchWallW: [
          [-4, 0],
          [-4, -1],
        ],
        tired: [
          [-3, -2]
        ],
        sleeping: [
          [-2, 0],
          [-2, -1],
        ],
        N: [
          [-1, -2],
          [-1, -3],
        ],
        NE: [
          [0, -2],
          [0, -3],
        ],
        E: [
          [-3, 0],
          [-3, -1],
        ],
        SE: [
          [-5, -1],
          [-5, -2],
        ],
        S: [
          [-6, -3],
          [-7, -2],
        ],
        SW: [
          [-5, -3],
          [-6, -1],
        ],
        W: [
          [-4, -2],
          [-4, -3],
        ],
        NW: [
          [-1, 0],
          [-1, -1],
        ],
      };

      // START-POINT: ####################################################################################################
      init();
      
      // INITIALIZER: ####################################################################################################
      function init() {
        // Start-Position:
        setStartPosition()

        // Configuring Container:
        nekoContainer.id = "oneko";
        nekoContainer.ariaHidden = true;
        nekoContainer.style.width = "32px";
        nekoContainer.style.height = "32px";
        nekoContainer.style.position = "fixed";
        nekoContainer.style.pointerEvents = "none";
        nekoContainer.style.imageRendering = "pixelated";
        nekoContainer.style.left = `${nekoPosX - 16}px`;
        nekoContainer.style.top = `${nekoPosY - 16}px`;
        nekoContainer.style.zIndex = 999; // Slightly behind speechBubble.
        nekoContainer.style.opacity = "0.8";

        // Fake 3D for 3D hardware acceleration:
        nekoContainer.style.transform = 'translateZ(0.1)';
        nekoContainer.style.transform = 'translate3d(0.1, 0.1, 0.1)';

        // Sprite-Sheet:
        nekoContainer.style.backgroundImage = `url(${nekoFile})`;

        // Add to body:
        document.body.appendChild(nekoContainer);

        // Add event Lisitener with "Lambda" method to Update Script-Global Mouse position:
        document.addEventListener("mousemove", function(event) {
          updateMousePosition(event.clientX, event.clientY)
        });

        // Fix StartUp Position so it can be freely defined (As long as the mouse-move event has not fired the known mouse position is 0, 0):
        updateMousePosition(nekoPosX, nekoPosY)

        // Enforce Size with scaling (Double DIV causes to many issues):
        window.addEventListener('load', updateDivScale);
        window.addEventListener('resize', updateDivScale);

        // Fix StartUp Frame:
        idle()

        // Beginn Loop:
        window.requestAnimationFrame(onAnimationFrame);
      }
      
      // MAIN-LOOP: ####################################################################################################
      function onAnimationFrame(timestamp) {
        // Stops execution if the neko element is removed from DOM:
        if (!nekoContainer.isConnected) {
          return;
        }

        // Execution on Time:
        if (timestamp - lastFrameTimestamp > nekoSleep) {
          // Reset:
          lastFrameTimestamp = timestamp

          // Next Frame:
          frame()
        }

        // LOOP:
        window.requestAnimationFrame(onAnimationFrame);
      }

      // FUNCTIONS: ####################################################################################################
      // Main Animation Logic:
      function frame() {
        // Counter for Frame-Switching:
        frameCount += 1;

        // Calculate next Position:
        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        // Check for min. distance, else idle:
        if (distance < currentScaledNekoSpeed || distance < nekoMinDistance) {
          idle();
          return;
        }

        // Clear IDLE:
        idleAnimation = null;
        idleAnimationFrame = 0;

        // If was just idle, make aleret face:
        if (idleTime > 1) {
          setSprite("alert", 0);

          // Count down after being alerted before moving:
          idleTime = Math.min(idleTime, 7);
          idleTime -= 1;
          return;
        }

        // Calculate next needed frame:
        let direction;
        direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        
        // Apply Sprite:
        setSprite(direction, frameCount);

        // Calculate Position based on speed:
        nekoPosX -= (diffX / distance) * currentScaledNekoSpeed;
        nekoPosY -= (diffY / distance) * currentScaledNekoSpeed;

        // Keep distance to window Border (Fixes of-screen when resizing):
        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - minWallDistance);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - minWallDistance);
        
        // Set Neko Position:
        nekoContainer.style.left = `${nekoPosX - 16}px`;
        nekoContainer.style.top = `${nekoPosY - 16}px`;
      }

      // IDLE-Logic for random animations:
      function idle() {
        // Counter for Animation switches:
        idleTime += 1;

        // Random event logic when idle:
        if (idleTime > randomIdleEventDelay &&
            Math.floor(Math.random() * randomIdleEventOffset) == 0 &&
            idleAnimation == null) {
          let avalibleIdleAnimations = ["sleeping", "scratchSelf"];

          // Window Border Scratching:
          if (nekoPosX < minWallDistanceToScratch) { // X_L:
            avalibleIdleAnimations.push("scratchWallW");
          }
          
          if (nekoPosY < minWallDistanceToScratch) { // Y_T:
            avalibleIdleAnimations.push("scratchWallN");
          }

          if (nekoPosX > window.innerWidth - minWallDistanceToScratch) { // Y_B:
            avalibleIdleAnimations.push("scratchWallE");
          }

          if (nekoPosY > window.innerHeight - minWallDistanceToScratch) { // X_R:
            avalibleIdleAnimations.push("scratchWallS");
          }
          
          // "Lambda" for idle Animation selection:
          idleAnimation =
            avalibleIdleAnimations
            [
              Math.floor(Math.random() * avalibleIdleAnimations.length)
            ];
        }

        // Switch Cases for the diffrent Idle Animations:
        switch (idleAnimation) {
          case "sleeping":
            // Only sleep after enough time, until then play sleepy Animation:
            if (idleAnimationFrame < sleepyOffset) {
              setSprite("tired", 0);
              break;
            }
            
            // Apply sleep:
            setSprite("sleeping", Math.floor(idleAnimationFrame / 4));

            // Wake Up after enough time has passed:
            if (idleAnimationFrame > maxSleepTime) {
              resetIdleAnimation();
            }

            break
          case "scratchWallN":
          case "scratchWallS":
          case "scratchWallE":
          case "scratchWallW":
          case "scratchSelf":
            // Apply Scratching:
            setSprite(idleAnimation, idleAnimationFrame);

            // Reset Idle Animation:
            if (idleAnimationFrame > maxIdleAnimationTime) {
              resetIdleAnimation();
            }

            break;
          default:
            // DEFAULT CASE:
            setSprite("idle", 0);
            return;
        }

        idleAnimationFrame += 1;
      }
      
      // MISC-UTILS: ####################################################################################################
      // Applys sprite by using the Animation-Frame-Positions table:
      function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoContainer.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
      }

      // Reset the Idle cases for the next Animation:
      function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
      }

      // Returns the current Scaling of the Window:
      function getCurrentPageScale() {
        const zoom = Math.round(window.devicePixelRatio * 100);
        return zoom / 100;
      }

      // Adjusting the Scale and Speed to the current Zoom of the Page to keep a consistent size:
      function updateDivScale() {
        // Get Scale:
        const currentScale = getCurrentPageScale();

        // Collect Variables:
        const adjustedScale = nekoScaling / currentScale;
        const adjustedNekoSpeed = nekoSpeed / currentScale;
        
        // Apply adjustments:
        nekoContainer.style.transform = `scale(${adjustedScale})`; // Backticks to turn value into String.
        currentScaledNekoSpeed = adjustedNekoSpeed
      }

      // Define START-Position on screen by fixed value or random:
      function setStartPosition() {
        // At random:
        if (ranomStartPositon == true) {
          // Get Viewport-Size:
          const width = window.innerWidth;
          const height = window.innerHeight;

          // Page Limits:
          const maxX = width - minWallDistance;
          const maxY = height - minWallDistance;

          // Generate random Pos:
          const x = Math.random() * maxX;
          const y = Math.random() * maxY;

          // Position Oneko:
          nekoPosX = x
          nekoPosY = y
        } else { // Static:
          nekoPosX = nekoStartPosX
          nekoPosY = nekoStartPosY
        }
      }

      // Updates the Position of the Mouse on screen (In function so it can be offset for start Position):
      function updateMousePosition(myPosX, myPosY) {
          mousePosX = myPosX;
          mousePosY = myPosY;
      }
    };
})();