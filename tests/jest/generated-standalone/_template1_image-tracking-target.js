/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// 

import { renderer, camera, scene, targetPlane, setCameraSource } from "./common";
import targetImage from "../../assets/jest/zpt/target.zpt";

setCameraSource("image");

const imageTracker = new ZapparThree.ImageTrackerLoader().load(targetImage);

const imageTrackerGroup = new ZapparThree.ImageAnchorGroup(camera, imageTracker);
scene.add(imageTrackerGroup);

imageTrackerGroup.add(targetPlane);

imageTracker.onNewAnchor.bind((anchor) => {
  camera.poseAnchorOrigin = anchor;
});
imageTracker.onVisible.bind(() => {
  setTimeout(() => {
    console.log("Anchor is visible");
  }, 1000);
});
function animate() {
  requestAnimationFrame(animate);
  camera.updateFrame(renderer);
  renderer.render(scene, camera);
}
animate();
