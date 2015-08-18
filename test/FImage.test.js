import {FScene} from "../src/FScene";
import {FImage} from "../src/FImage";

var moveMouse = (scene, x, y) => {
  scene._prevX = x;
  scene._prevY = y;
}

describe('FImage', () => {
    describe('if given no parameters, it should initialize', () => {
      it('to preserve it\'s initial aspect ratio.', () =>{
        var img = new FImage({image : {}});

        img._preserveAspectRatio.should.be.true();
      });

      it('to have a black fill color.', () =>{
        var img = new FImage({image : {width: 312, height: 83}});

        img._aspectRatio.should.equal(0.26602564102564102564102564102564);
      });
    });

    it('should scale() correctly.', () =>{
      var scene = new FScene({canvasID: 'someID', width: 1366, height: 800})
      var img = new FImage({image : {width: 312, height: 83}});

      scene.add(img);

      moveMouse(scene, 313, -1);

      img.scale(-10, 5, 1);

      img.width.should.equal(302);
      img.height.should.equal(80.339743589743589743589743589744);
    });
});
