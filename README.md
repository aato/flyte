### Flyte.js

[![NPM version](https://badge.fury.io/js/flyte.svg)](https://www.npmjs.com/package/flyte)
[![devDependency Status](https://david-dm.org/aato/flyte/dev-status.svg?theme=shields.io)](https://david-dm.org/aato/flyte#info=devDependencies)

**Flyte.js** is a framework that makes it easy to work with the HTML5 canvas element. It is an **interactive object model** on top of the canvas element. A lighter-weight, boiled down version of <a href="https://github.com/kangax/fabric.js">Fabric.js</a>. Try the <a href="https://jsfiddle.net/txstp664/3">demo</a>.

<a href="https://github.com/aato/flyte" target="_blank"><img src="https://github.com/aato/flyte/raw/master/lib/screenshot.png" style="width:300px;box-shadow:rgba(0,0,0,0.3) 0 0 5px"></a>

#### Usage

```html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <canvas></canvas>

    <script src="dist/flyte-X.Y.Z.js"></script>
    <script>
        var scene = new FScene({canvasID: 'canvas', width: 500, height: 400});

        var rect = new FRect({
          left: 10,
          top: 10,
          width: 100,
          height: 100,
          fillStyle : 'orange'
        });

        scene.add(rect);
    </script>
</body>
</html>
```
