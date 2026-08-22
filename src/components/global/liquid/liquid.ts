const root = document.documentElement;

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

let animationFrame = 0;


/*
 * =========================================================
 * LIQUID GLASS ELEMENTS
 * =========================================================
 */

function getLiquidElements(): NodeListOf<HTMLElement> {
  return document.querySelectorAll<HTMLElement>(
    "[data-liquid='true'] .liquid-glass"
  );
}


/*
 * =========================================================
 * POINTER / TILT POSITION
 * =========================================================
 */

function setTarget(x: number, y: number) {
  targetX = Math.max(-1, Math.min(1, x));
  targetY = Math.max(-1, Math.min(1, y));
}


/*
 * =========================================================
 * DESKTOP MOUSE
 * =========================================================
 *
 * Track the cursor relative to each liquid surface.
 * This makes the highlight actually move across the bubble.
 */

window.addEventListener("pointermove", (event) => {
  const elements = getLiquidElements();

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    element.style.setProperty(
      "--liquid-local-x",
      `${clampedX}%`
    );

    element.style.setProperty(
      "--liquid-local-y",
      `${clampedY}%`
    );
  });


  /*
   * Global position is still used for the overall
   * perspective / tilt movement.
   */

  const x =
    (event.clientX / window.innerWidth) * 2 - 1;

  const y =
    (event.clientY / window.innerHeight) * 2 - 1;

  setTarget(x, y);
});


/*
 * =========================================================
 * MOBILE DEVICE TILT
 * =========================================================
 */

function handleOrientation(event: DeviceOrientationEvent) {
  const gamma = event.gamma ?? 0;
  const beta = event.beta ?? 0;

  const x = gamma / 45;
  const y = (beta - 45) / 45;

  setTarget(x, y);


  /*
   * Convert device tilt into a useful light position.
   */

  const localX =
    Math.max(
      0,
      Math.min(
        100,
        50 + gamma * 1.2
      )
    );

  const localY =
    Math.max(
      0,
      Math.min(
        100,
        50 + (beta - 45) * 0.8
      )
    );


  getLiquidElements().forEach((element) => {
    element.style.setProperty(
      "--liquid-local-x",
      `${localX}%`
    );

    element.style.setProperty(
      "--liquid-local-y",
      `${localY}%`
    );
  });
}


function enableOrientation() {
  window.addEventListener(
    "deviceorientation",
    handleOrientation,
    true
  );
}


/*
 * =========================================================
 * IOS MOTION PERMISSION
 * =========================================================
 */

async function requestMotionPermission() {
  const DeviceOrientationEventClass =
    DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<
        "granted" | "denied"
      >;
    };

  if (
    typeof DeviceOrientationEventClass
      .requestPermission === "function"
  ) {
    try {
      const permission =
        await DeviceOrientationEventClass
          .requestPermission();

      if (permission === "granted") {
        enableOrientation();
      }
    } catch {
      // Motion permission was denied.
    }

    return;
  }

  enableOrientation();
}


/*
 * =========================================================
 * START MOTION
 * =========================================================
 */

document.addEventListener(
  "click",
  () => {
    requestMotionPermission();
  },
  {
    once: true,
  }
);


/*
 * =========================================================
 * SMOOTH ANIMATION
 * ========================================================= */

function animate() {
  currentX +=
    (targetX - currentX) * 0.08;

  currentY +=
    (targetY - currentY) * 0.08;


  /*
   * Global liquid movement
   */

  root.style.setProperty(
    "--liquid-x",
    `${50 + currentX * 50}%`
  );

  root.style.setProperty(
    "--liquid-y",
    `${50 + currentY * 50}%`
  );


  /*
   * Perspective movement
   */

  root.style.setProperty(
    "--liquid-x-angle",
    `${currentX * 8}deg`
  );

  root.style.setProperty(
    "--liquid-y-angle",
    `${currentY * 6}deg`
  );


  animationFrame =
    requestAnimationFrame(animate);
}


animationFrame =
  requestAnimationFrame(animate);


/*
 * =========================================================
 * CLEANUP
 * =========================================================
 */

window.addEventListener(
  "pagehide",
  () => {
    cancelAnimationFrame(animationFrame);
  }
);