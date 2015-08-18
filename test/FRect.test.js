import {FScene} from "../src/FScene";
import {FRect} from "../src/FRect";

var moveMouse = (scene, x, y) => {
  scene._prevX = x;
  scene._prevY = y;
}

describe('FRect', () => {
    describe('if given no parameters, it should initialize.', () => {
      it('to be a 30 x 30 square.', () =>{
        var rect = new FRect();

        rect.width.should.equal(30);
        rect.height.should.equal(30);
      });

      it('to have a black fill color.', () =>{
        var rect = new FRect();

        rect.fillStyle.should.equal('#000000');
      });
    });

    it('should translate() correctly.', () =>{
      var rect = new FRect();

      rect.translate(312, 93);

      rect.left.should.equal(312);
      rect.top.should.equal(93);
    });

    it('should scale() correctly.', () =>{
      var scene = new FScene({canvasID: 'someID', width: 1366, height: 800})
      var rect = new FRect({width: 100, height: 100});

      scene.add(rect);

      moveMouse(scene, 120, -10);

      rect.scale(-32, 15, 1);

      rect.width.should.equal(68);
      rect.height.should.equal(85);
    });
});
