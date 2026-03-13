export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // pdfjs-dist (used by pdf-parse) requires these browser APIs in Node.js
    if (typeof globalThis.DOMMatrix === "undefined") {
      (globalThis as any).DOMMatrix = class DOMMatrix {
        a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
        constructor(_init?: string | number[]) {}
        static fromMatrix() { return new (globalThis as any).DOMMatrix(); }
        static fromFloat32Array() { return new (globalThis as any).DOMMatrix(); }
        static fromFloat64Array() { return new (globalThis as any).DOMMatrix(); }
        multiply() { return this; }
        translate() { return this; }
        scale() { return this; }
        rotate() { return this; }
        inverse() { return this; }
        transformPoint(p: any) { return p; }
        toFloat32Array() { return new Float32Array(16); }
        toFloat64Array() { return new Float64Array(16); }
      };
    }

    if (typeof globalThis.ImageData === "undefined") {
      (globalThis as any).ImageData = class ImageData {
        data: Uint8ClampedArray;
        width: number;
        height: number;
        constructor(width: number, height: number) {
          this.width = width;
          this.height = height;
          this.data = new Uint8ClampedArray(width * height * 4);
        }
      };
    }

    if (typeof globalThis.Path2D === "undefined") {
      (globalThis as any).Path2D = class Path2D {
        constructor(_path?: any) {}
        addPath() {}
        closePath() {}
        moveTo() {}
        lineTo() {}
        bezierCurveTo() {}
        quadraticCurveTo() {}
        arc() {}
        arcTo() {}
        rect() {}
        ellipse() {}
      };
    }
  }
}
