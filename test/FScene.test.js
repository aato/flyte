import {FScene} from "../src/FScene";
import {FRect} from "../src/FRect";
import {FImage} from "../src/FImage";

var moveMouse = (scene, x, y) => {
  scene._prevX = x;
  scene._prevY = y;
}

describe('FScene', () => {
    it('should throw an exception if not given a canvas id.', () =>{
      try{
        new FScene({width: 100, height: 100});
      }catch(err){
        err.code.should.equal('E_NO_CANVAS_ID');
      }
    });

    it('should throw an exception if not given canvas dimensions.', () =>{
      try{
        new FScene({canvasID: 'someID'});
      }catch(err){
        err.code.should.equal('E_INVALID_CANVAS_DIMENSIONS');
      }
    });

    it('should be able to remove objects to the scene.', () =>{
      var scene = new FScene({canvasID: 'someID', width: 1000, height: 1000});
      var rect = new FRect();

      scene.contains(rect).should.be.false();
      scene.add(rect);
      scene.contains(rect).should.be.true();
      scene.remove(rect);
      scene.contains(rect).should.be.false();
    });

    it('should be able to select and unselect objects in the scene.', () =>{
      var scene = new FScene({canvasID: 'someID', width: 1000, height: 1000});
      var rect = new FRect();

      scene.add(rect);
      rect.isSelected().should.be.false();
      scene.select(rect);
      rect.isSelected().should.be.true();
      scene.unselect(rect);
      rect.isSelected().should.be.false();
    });
});
