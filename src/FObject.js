/**
 * An object with basic visual and spatial properties. Can subscribe to events.
 */
export default class FObject{
  /**
   * FObject constructor
   * @param  {Number} options.x          X-coordinate (world-space; top-left corner)
   * @param  {Number} options.y          Y-coordinate (world-space; top-left corner)
   * @param  {Number} options.width      Width (world-space)
   * @param  {Number} options.height     Height (world-space)
   * @param  {Number} options.scaleX     Scaling factor along x-axis (world-space)
   * @param  {Number} options.scaleY     Scaling factor along y-axis (world-space)
   * @param  {Number} options.angle      Rotation in degrees (world space)
   * @param  {String|CanvasGradient|CanvasPattern} options.background Background on which all other visual elements of this FObject are drawn
   * @param  {Number} options.layer      Depth of this FObject in the FScene (world-space)
   * @param  {Element} options.canvas    The canvas that you want to draw this scene on. Creates one off-screen if none-passed in.
   */
  constructor({x = 0, y = 0, width = 100, height = 100, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', layer = 0, canvas} = {}){
    // Unique id within the scene.
    this._id          = undefined;
    // Scene that this FObject belongs to (can belong to none initially and be added later).
    this._scene       = undefined;

    this._position    = {x: x, y: y, layer: layer};
    this._rotation    = angle;
    this._scale       = {x: scaleX, y: scaleY};

    this._width       = width;
    this._height      = height;

    // An alias for ctx.fillStyle.
    this._background  = background;
    // Center point in world-space.
    this._center      = {x: undefined, y: undefined};

    this._c           = canvas || document.createElement('canvas');
    this._c.width     = this._width;
    this._c.height    = this._height;
    this._ctx         = this._c.getContext('2d');

    // Currently used for optimization, can be expanded to other uses.
    this._flags       = {
                        canvasDirty: true
                      }

    // All events this FObject is subscribed to.
    this._events      = new Map();

    this._calculateCenter();

    // Subscribe all FObjects to these events be default. Others can be added.
    this.addEventListener('onmousedown', this._onMouseDown);
    this.addEventListener('onmouseup', this._onMouseUp);
    this.addEventListener('onmousemove', this._onMouseMove);
  }

  /**
   * What layer is the FObject currently on>
   * @return {Number} Current layer
   */
  getLayer(){
    return this._position.layer;
  }

  /**
   * Set this FObject's current layer - this will invalidate its canvas.
   * @param {Number} layer The new layer for this FObjects
   */
  setLayer(layer = this._position.layer){
    if(layer === this._position.layer) return;

    this._position.layer = layer;
    if(this._scene) this._scene.setFlag('drawOrderDirty', true);
  }

  /**
   * Set a flag; used to inform this FObject how it should go about rendering itself. Can be expanded to set non-performance related flags.
   * @param {[type]} flag  [description]
   * @param {[type]} value [description]
   */
  setFlag(flag, value){
    this._flags[flag] = value;
  }

  /**
   * What the world bounding box of this FObject?
   * @return {Array} Array of {x: _, y: _}s of the form [topLeft, topRight, bottomRight, bottomLeft]
   */
  getWorldBoundingBox(){
    var topLeft = {px : this._position.x, py : this._position.y};
    var topRight = {px : this._position.x + this._width, py : this._position.y};
    var bottomRight = {px : this._position.x + this._width, py : this._position.y + this._height};
    var bottomLeft = {px : this._position.x, py : this._position.y + this._height};

    var theta = this._rotation * (Math.PI / 180);
    var ox = this._center.x;
    var oy = this._center.y;

    var rot = ({px, py}) => {
      var pxPrime = Math.cos(theta) * (px - ox) - Math.sin(theta) * (py - oy) + ox;
      var pyPrime = Math.sin(theta) * (px - ox) + Math.cos(theta) * (py - oy) + oy;

      return {x: pxPrime, y: pyPrime};
    };

    return [rot(topLeft), rot(topRight), rot(bottomRight), rot(bottomLeft)];
  }

  /**
   * Give this FObject a new world-position.
   * @param {Number} options.x     World-x coordinate
   * @param {Number} options.y     World-y coordinate
   * @param {Number} options.layer World-layer coordinate
   */
  setPosition({x = this._position.x, y = this._position.y, layer = this._position.layer} = {}){
    if(x === this._position.x && y === this._position.y && layer === this._position.layer) return false;

    this._position.x = x;
    this._position.y = y;
    this._position.layer = layer;

    this._calculateCenter();

    if(this._scene) this._scene.setFlag('canvasDirty', true);

    return true;
  }

  /**
   * What's this FObject's current world-position?
   * @return {Object} Current position of the form {x: _, y: _, layer: _}
   */
  getPosition(){
    return this._position;
  }

  setDimensions({width = this._width, height = this._height} = {}){
    if(width === this._width && height === this._height) return false;

    this._width = width;
    this._height = height;

    this._c.width = width;
    this._c.height = height;

    this._calculateCenter();
    this.setFlag('canvasDirty', true);
    if(this._scene) this._scene.setFlag('canvasDirty', true);

    return true;
  }

  /**
   * What's the world-width and -height of this FObject?
   * @return {Object} Current dimensions of the form {width: _, height: _}
   */
  getDimensions(){
    return {width: this._width, height: this._height};
  }

  /**
   * Give this FObject a new background.
   * @param {String|CanvasGradient|CanvasPattern} background An alias for ctx.fillStyle; will take the same arguments
   */
  setBackground(background = this._background){
    if(background === this._background) return;

    this._background = background;
    this.setFlag('canvasDirty', true);
    if(this._scene) this._scene.setFlag('canvasDirty', true);
  }

  /**
   * What's this FObject's current background?
   * @return {String|CanvasGradient|CanvasPattern} Returns whatever ctx.fillStyle would return
   */
  getBackground(){
    return this._background;
  }

  _calculateCenter(){
    this._center = {
      x: this._position.x + this._width / 2,
      y: this._position.y + this._height / 2
    };
  }

  /**
   * What scene (if any) does this FObject belong to?
   * @return {FScene|undefined} Scene this FObject belongs to
   */
  getScene(){
    return this._scene;
  }

  /**
   * What's this FObject's id (if it has one - if it doesn't belong to a scene it will return `undefined`)?
   * @return {Number|undefined} ID of this FObject
   */
  getID(){
    return this._id;
  }

  /**
   * Set this FObject's scene.
   * @param {FScene} Scene The FScene to link this FObject to
   */
  setScene(scene){
    this._scene = scene;
  }

  /**
   * Set this FObject's id.
   * @param {Number} id The id to give this
   */
  setID(id){
    this._id = id;
  }

  /**
   * Draw this FObject to the world canvas.
   * @param  { CanvasRenderingContext2D} ctx The world-context on which this FObject's personal canvas will be rendered to
   */
  _draw(ctx){
    if(this._flags.canvasDirty){
      this._render();
      this.setFlag('canvasDirty', false);
    }

    ctx.save();
      ctx.translate(this._center.x, this._center.y);
      ctx.scale(this._scale.x, this._scale.y);
      ctx.rotate(this._rotation * Math.PI/180);
      ctx.drawImage(this._c, 0, 0, this._width, this._height, -this._width / 2, -this._height / 2, this._width, this._height);

    ctx.restore();
  }

  /**
   * (Re)draw this FObject's personal canvas.
   */
  _render(){
    this._ctx.save();
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._ctx.fillStyle = this._background;
      this._ctx.fillRect(0, 0, this._width, this._height);

      // Update this object's canvas here.
    this._ctx.restore();
  }

  /**
   * Has this FObject been hit (by either a point or an area)?
   * @param  {Number} options.x        X-coordinate (world-space)
   * @param  {Number} options.y        Y-coordinate (world-space)
   * @param  {Number} options.width    Width of area (world-space)
   * @param  {Number} options.height}  Height of area (world-space))
   * @return {Boolean}                 Has this FObject been hit?
   */
  hitTest({x, y, width, height} = {}){
    if(!x || !y) return [];

    // If we're testing for a point.
    if(!width || !height){
      if(x >= this._position.x && x <= this._position.x + this._width && y <= this._position.y + this._height && y >= this._position.y){
        return [this];
      }
    // If we're testing for a rectangle.
    } else {
      // Left edge.
      if(x <= this._position.x && x + width >= this._position.x){
        // Top-left corner.
        if(y <= this._position.y && y + height >= this._position.y){
          return [this];
        // Bottom-left corner.
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return [this];
        // Only left edge.
        } else if (y >= this._position.y && y + height <= this._position.y + this._height){
          return [this];
        }
      // Right edge.
      } else if(x <= this._position.x + this._width && x + width >= this._position.x + this._width) {
        // Top-right corner.
        if(y <= this._position.y && y + height >= this._position.y){
          return [this];
        // Bottom-right corner.
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return [this];
        // Only right edge.
        } else if (y >= this._position.y && y + height <= this._position.y + this._height){
          return [this];
        }
      // Center.
      } else if(x >= this._position.x && x + width <= this._position.x + this._width) {
        // Only top edge.
        if(y <= this._position.y && y + height >= this._position.y){
          return [this];
        // Only bottom edge.
        } else if (y <= this._position.y + this._height && y + height >= this._position.y + this._height){
          return [this];
        // Inside (no edges or corners).
        } else if (y >= this._position.y && y + height <= this._position.y + this._height){
          return [this];
        }
      }
    }

    return [];
  }

  /**
   * Add an event listener to this FObject.
   * @param {String}   eventType What event do we want this FObject to listen to? (ex.: 'onmousedown', 'onmousemove')
   * @param {Function} fn        What function should be called when this event occurs?
   */
  addEventListener(eventType, fn){
    var _fn = fn.bind(this);
    this._events.set(eventType, _fn);

    return eventType;
  }

  /**
   * Trigger an event that this FObject is listening for.
   * @param  {String} eventType What event do we want to trigger? (ex.: 'onmousedown', 'onmousemove')
   * @param  {Object} e         The Object containig relevant event information (where was the mouse cursor at the moment this event occurred? What kets were being pressed on the mouse and keyboard? etc.)
   */
  trigger(eventType, e){
    if(this._events.has(eventType)){
      this._events.get(eventType)(e);
    }
  }

  /**
   * Dummy onMouseDown callback function, meant to be overriden in child classes.
   * @param  {Object} e The Object containig relevant event information (where was the mouse cursor at the moment this event occurred? What kets were being pressed on the mouse and keyboard? etc.)
   */
  _onMouseDown(e){
  }

  /**
   * Dummy onMouseUp callback function, meant to be overriden in child classes.
   * @param  {Object} e The Object containig relevant event information (where was the mouse cursor at the moment this event occurred? What kets were being pressed on the mouse and keyboard? etc.)
   */
  _onMouseUp(e){
  }

  /**
   * Dummy onMouseMove callback function, meant to be overriden in child classes.
   * @param  {Object} e The Object containig relevant event information (where was the mouse cursor at the moment this event occurred? What kets were being pressed on the mouse and keyboard? etc.)
   */
  _onMouseMove(e){
  }
}
