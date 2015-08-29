import FScene from "../src/FScene";

describe('FScene', () => {
  var c;

  beforeEach(() => {
    // Dummy canvas object.
    c = {
      style: {
        width: undefined,
        height: undefined
      },
      width: undefined,
      height: undefined,
      getContext: (type) => {
        return {};
      }
    };
  });

  it('should throw an error if not supplied with a canvas.', () => {
    (() => {new FScene()}).should.throw();

    try{
      new FScene();
    } catch(err){
      err.code.should.equal('E_CANVAS_UNDEFINED');
    }
  });

  it('should default to 600 x 300 if not supplied any dimensions.', () => {
    var scene = new FScene({canvas: c});
    scene._width.should.equal(600);
    scene._height.should.equal(300);
  });

  it('should accept only valid dimensions.', () => {
    var scene = new FScene({canvas: c, width: 100, height: 100});
    scene._width.should.equal(100);
    scene._height.should.equal(100);

    var scene = new FScene({canvas: c, width: 1000});
    scene._width.should.equal(1000);
    scene._height.should.equal(300);

    (() => {new FScene({canvas: c, width: -1})}).should.throw();

    try{
      new FScene({canvas: c, width: -1});
    } catch(err){
      err.code.should.equal('E_CANVAS_DIMENSIONS_INVALID');
    }
  });

  it('should be able to add objects.', () => {
    var scene = new FScene({canvas: c});
    var obj = {};

    obj.should.not.have.property('_id');
    scene.add(obj);
    obj.should.have.property('_id', 0);
  });

  it('should prevent you from adding the same object twice.', () => {
    var scene = new FScene({canvas: c});
    var obj = {};

    scene.add(obj);
    scene._objects.should.have.length(1);
    scene.add(obj);
    scene._objects.should.have.length(1);
  });

  it('should assign each newly-added object a unique id.', () => {
    var scene = new FScene({canvas: c});
    var obj1 = {};
    var obj2 = {};
    var obj3 = {};

    scene.add(obj1);
    obj1._id.should.equal(0);
    scene.add(obj2);
    obj2._id.should.equal(1);
    scene.add(obj3);
    obj3._id.should.equal(2);
  });

  it('should be able to remove objects.', () => {
    var scene = new FScene({canvas: c});
    var obj = {};

    scene._objects.should.have.length(0);
    scene.add(obj);
    scene._objects.should.have.length(1);
    var removedObj = scene.remove(obj);
    scene._objects.should.have.length(0);

    removedObj.should.equal(obj);

    removedObj.should.not.have.property('_id');
  });
});
