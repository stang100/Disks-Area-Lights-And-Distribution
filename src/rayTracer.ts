function lessEpsilon(num: number){ 
    return Math.abs(num) < 1e-10; 
} 
function greaterEpsilon(num: number){ 
    return Math.abs(num) > 1e-10; 
} 
  
// classes from the Typescript RayTracer sample
export class Vector {
    constructor(public x: number,
                public y: number,
                public z: number) {
    }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y, k * v.z); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static cross(v1: Vector, v2: Vector) {
        return new Vector(v1.y * v2.z - v1.z * v2.y,
                          v1.z * v2.x - v1.x * v2.z,
                          v1.x * v2.y - v1.y * v2.x);
    }
}

export class Color {
    constructor(public r: number,
                public g: number,
                public b: number) {
    }
    static scale(k: number, v: Color) { return new Color(k * v.r, k * v.g, k * v.b); }
    static plus(v1: Color, v2: Color) { return new Color(v1.r + v2.r, v1.g + v2.g, v1.b + v2.b); }
    static times(v1: Color, v2: Color) { return new Color(v1.r * v2.r, v1.g * v2.g, v1.b * v2.b); }
    static white = new Color(1.0, 1.0, 1.0);
    static grey = new Color(0.5, 0.5, 0.5);
    static black = new Color(0.0, 0.0, 0.0);
    static lightness(c: Color) { return Math.sqrt(c.r * c.r + c.g * c.g + c.b * c.b); }
    static toDrawingColor(c: Color) {
        var legalize = (d: number) => d > 1 ? 1 : d;
        return {
            r: Math.floor(legalize(c.r) * 255),
            g: Math.floor(legalize(c.g) * 255),
            b: Math.floor(legalize(c.b) * 255)
        }
    }
}
interface Object {
    origin : Vector,
    radius : number,
    norm : Vector,
    dr : number,
    dg : number,
    db : number,
    k_ambient : number,
    k_specular : number,
    specular_pow : number,
    find_t(ray:Ray) : number[];
}
export class Sphere implements Object {
    public norm : Vector = new Vector(0,0,0)
    constructor(public origin: Vector, public radius: number, 
        public dr: number, public dg: number, public db: number, 
        public k_ambient: number, public k_specular: number, public specular_pow: number) {
            
    }
    public find_t (ray: Ray): number[] {
        var ex = ray.start.x;
        var ey = ray.start.y;
        var ez = ray.start.z;

        var dx = ray.dir.x;
        var dy = ray.dir.y;
        var dz = ray.dir.z;

        var sx = this.origin.x
        var sy = this.origin.y
        var sz = this.origin.z

        var radius = this.radius;

        var a = dx * dx + dy * dy + dz * dz;
        var b = 2 * ((dx * (ex - sx)) + (dy * (ey - sy)) + (dz * (ez - sz)));
        var c = (ex - sx) * (ex - sx) + (ey - sy) * (ey - sy) + (ez - sz) * (ez - sz) - radius * radius;

        var discriminant = b * b - 4 * a * c;

        var root : number[] = []

        if (discriminant < 0) {
            return root;
        }
        if (discriminant == 0) {
            root.push((b * -1) / (2 * a));
            return root;
        }
        if (discriminant > 0) {
            root.push(((b * -1) + Math.sqrt(discriminant)) / (2 * a));
            root.push(((b * -1) - Math.sqrt(discriminant)) / (2 * a));
            return root;
        }
        return root;
    }
}

export class Disk implements Object {
    constructor (public origin : Vector, public radius : number, public norm : Vector, public dr : number, public dg : number, public db : number, public k_ambient : number, public k_specular : number, public specular_pow : number) {
    }
    public find_t(ray : Ray) : number[] {
        var root : number[] = []
        var temp = 0;
        if (this.findIntersect(this.norm, this.origin, ray.start, ray.dir, temp)) {
            var den = Vector.dot(this.norm, ray.dir)
            var pl = Vector.minus(this.origin, ray.start)
            temp = Vector.dot(pl, this.norm) / den
            var p = Vector.plus(ray.start, Vector.times(temp, ray.dir))
            var v = Vector.minus(p, this.origin)
            var d = Vector.dot(v,v)
            if (Math.sqrt(d) <= this.radius) {
                root.push(temp) 
            }
        }
        return root
    }

    findIntersect(n : Vector, p0 :Vector, l0 : Vector, l : Vector, t: number) : boolean {
        var d = Vector.dot(n, l)
        if (greaterEpsilon(Math.abs(d))) {
            var pl = Vector.minus(p0, l0)
            t = Vector.dot(pl, n) / d
            return (t >= 0)
        }
        return false
    }
}

export class Light {
    constructor(public color: Color, public x: number, public y: number, public z: number) {
    }
}

export class AmbientLight {
    constructor(public color: Color) {
    }
}

export class AreaLight {
    constructor (public color : Color, public position : Vector, public u : Vector, public v : Vector) {
    }
}

export class Camera {
    public w : Vector;
    public u : Vector;
    public v : Vector;
    constructor(public pos: Vector,
                public lookat: Vector,
                public up: Vector) {
                    this.w = Vector.times(-1, Vector.norm(Vector.minus(this.pos, lookat)));
                    this.u = Vector.norm(Vector.cross(this.w, up));
                    this.v = Vector.cross(this.w, this.u);
                }
}

interface Ray {
    start: Vector;
    dir: Vector;
}

// a suggested interface for jitter samples
interface Sample {
    s: number,
    t: number
}

var lights: Light[];
var ambientLight: AmbientLight;
var objects: Object[];
var camera: Camera;
var backgroundColor: Color;
var fov: number;
var areaLights : AreaLight[] = [];


// A class for our application state and functionality
class RayTracer {
    // the constructor paramater "canv" is automatically created 
    // as a property because the parameter is marked "public" in the 
    // constructor parameter
    // canv: HTMLCanvasElement
    //
    // rendering context for the canvas, also public
    // ctx: CanvasRenderingContext2D

    // initial color we'll use for the canvas
    canvasColor = "lightyellow"

    canv: HTMLCanvasElement
    ctx: CanvasRenderingContext2D 

    // some things that will get specified by user method calls
    enableShadows = true
    jitter = false
    samples = 1

    // user method calls set these, for the optional parts of the assignment
    enableBlur = false
    enableReflections = false
    enableDepth = false

    // if you are doing reflection, set some max depth here
    maxDepth = 5;

    constructor (div: HTMLElement,
        public width: number, public height: number, 
        public screenWidth: number, public screenHeight: number) {

        // let's create a canvas and to draw in
        this.canv = document.createElement("canvas");
        this.ctx = this.canv.getContext("2d")!;
        if (!this.ctx) {
            console.warn("our drawing element does not have a 2d drawing context")
            return
        }
        
        div.appendChild(this.canv);

        this.canv.id = "main";
        this.canv.style.width = this.width.toString() + "px";
        this.canv.style.height = this.height.toString() + "px";
        this.canv.width  = this.width;
        this.canv.height = this.height;
    }

    // HINT: SUGGESTED INTERNAL METHOD
    // create an array of samples (size this.samples ^ 2) in the range 0..1, which can
    // be used to create a distriubtion of rays around a single eye ray or light ray.
    // The distribution would use the jitter parameters to create either a regularly spaced or 
    // randomized set of samples.
    private createDistribution(): Sample[] {
        var sam = [];
        var increment = 2 / this.samples
        var x = 0;
        var y = 0;
        for (var i = 0; i < 2; i += increment) {
            for (var j = 0; j < 2; j += increment) {
                if (this.jitter) {
                    x = Math.random() * 0.5
                    y = Math.random() * 0.5
                } else {
                    x = increment / 2
                    y = increment/ 2
                }
                sam.push({s : i + x - 1, t: j + y - 1})
            }
        }
        return sam
    }

    // HINT: SUGGESTED BUT NOT REQUIRED, INTERNAL METHOD
    // like traceRay, but returns on first hit. More efficient than traceRay for detecting if "in shadow"
    private testRay(ray: Ray) {
        var tmin = 99999999;
        for (var i = 0; i < objects.length; i ++) {
            var int = objects[i].find_t(ray)
            if (int.length == 1) {
                if (int[0] > 0 && int[0] < tmin) {
                    return true
                }
            } else if (int.length == 2) {
                if (int[0] > 0 && int[1] < 0) {
                    return true
                }
                if (int[0] < 0 && int[1] > 0) {
                    return true
                }
                if (int[0] > 0 && int[1] > 0) {
                    return true
                }
            }
        }
        return false;
    }

    // NEW COMMANDS FOR PART B

    // create a new disk 
    // 
    // NOTE:  the final vx, vy, vz are only needed for optional motion blur part, 
    // and are the velocity of the object. The object is moving from x,y,z - vx,vy,vz to x,y,z + vx,vy,vz 
    // during the time interval being rendered.
    new_disk (x: number, y: number, z: number, radius: number, 
              nx: number, ny: number, nz: number, dr: number, dg: number, db: number, 
              k_ambient: number, k_specular: number, specular_pow: number,
              vx?: number, vy?: number, vz?: number) {
                objects.push(new Disk(new Vector(x,y,z), radius, new Vector(nx,ny,nz), dr, dg, db, k_ambient, k_specular, specular_pow));
    }

    // create a new area light source
    area_light (r: number, g: number, b: number, x: number, y: number, z: number, 
                ux: number, uy: number, uz: number, vx: number, vy: number, vz: number) {
                    areaLights.push(new AreaLight(new Color(r,g,b), new Vector(x,y,z), new Vector(ux, uy, uz), new Vector(vx,vy,vz)))
    }

    set_sample_level (num: number) {
        this.samples = num
    }

    jitter_on() {
        this.jitter = true
    }

    jitter_off() {
        this.jitter = false
    }

    // turn reflection on or off for extra credit reflection part
    reflection_on() {
        this.enableReflections = true
    }

    reflection_off() {
        this.enableReflections = false
    }

    // turn motion blur on or off for extra credit motion blur part
    blur_on() {
        this.enableBlur = true
    }

    blur_off() {
        this.enableBlur = false
    }

    // turn depth of field on or off for extra credit depth of field part
    depth_on() {
        this.enableDepth = true
    }

    depth_off() {
        this.enableDepth = false
    }

    // COMMANDS FROM PART A

    // clear out all scene contents
    reset_scene() {
        this.set_eye(0,0,0,0,0,-1,0,1,0)
        this.set_fov(90);
        this.ambient_light(0,0,0);
        this.set_background(1,1,1)
        objects = [];
        lights= [];
        areaLights = [];
    }

    // create a new point light source
    new_light (r: number, g: number, b: number, x: number, y: number, z: number) {
        lights.push(new Light(new Color(r,g,b),x,y,z));
    }

    // set value of ambient light source
    ambient_light (r: number, g: number, b: number) {
        ambientLight = new AmbientLight(new Color(r,g,b));
    }

    // set the background color for the scene
    set_background (r: number, g: number, b: number) {
        backgroundColor = new Color(r,g,b);
    }

    // set the field of view
    DEG2RAD = (Math.PI/180)

    set_fov (theta: number) {
        fov = theta * this.DEG2RAD;
    }

    // // set the position of the virtual camera/eye
    // set_eye_position (x: number, y: number, z: number) {
    //     this.scene.camera.pos = new Vector(x,y,z)
    // }

    // set the virtual camera's viewing direction
    set_eye(x1: number, y1: number, z1: number, 
            x2: number, y2: number, z2: number, 
            x3: number, y3: number, z3: number) {
                camera = new Camera(new Vector(x1, y1, z1), new Vector(x2, y2, z2), Vector.norm(new Vector(x3, y3, z3)));
    }

    // create a new sphere.
    //
    // NOTE:  the final vx, vy, vz are only needed for optional motion blur part, 
    // and are the velocity of the object. The object is moving from x,y,z - vx,vy,vz to x,y,z + vx,vy,vz 
    // during the time interval being rendered.

    new_sphere (x: number, y: number, z: number, radius: number, 
                dr: number, dg: number, db: number, 
                k_ambient: number, k_specular: number, specular_pow: number, 
                vx?: number, vy?: number, vz?: number) {
                    objects.push(new Sphere(new Vector(x,y,z),radius,dr,dg,db,k_ambient,k_specular,specular_pow));
    }

    // INTERNAL METHODS YOU MUST IMPLEMENT

    // create an eye ray based on the current pixel's position
    private eyeRay(i: number, j: number): Ray {
        var d = 1 / (Math.tan( fov/2 ));
        var aspect_ratio = this.width/this.height
        var us = (-1 + ((2 * (i + 0.5)) / this.screenWidth)) * aspect_ratio
        var vs = -1 + ((2 * (j + 0.5)) / this.screenHeight);
        var direct = Vector.norm(Vector.plus(Vector.times(d, camera.w), Vector.plus(Vector.times(us, camera.u), Vector.times(vs, camera.v))))
        var ray : Ray = {start: camera.pos, dir : direct};
        return ray;
    }

    private traceRay(ray: Ray, depth: number = 0): Color {
        var tmin = 99999999;
        var closestObject = objects[0];
        var pixelColor: Color = backgroundColor;
        var kala: Color;
        for (var i = 0; i < objects.length; i++) {
            var t: number[] = objects[i].find_t(ray);
            if (t.length == 0) {
                tmin = tmin;
                closestObject = closestObject;
            } else if (t.length == 1) {
                
                if (t[0] > 0 && t[0] < tmin) {
                    tmin = t[0]
                    closestObject = objects[i]
                }
            } else if (t.length == 2) {
                var temp = 0;
                if (t[0] > 0 && t[1] < 0) {
                    temp = t[0]
                    if (temp < tmin) {
                        tmin = temp
                        closestObject = objects[i]
                    }
                } else if (t[0] < 0 && t[1] > 0) {
                    temp = t[1]
                    if (temp < tmin) {
                        tmin = temp
                        closestObject = objects[i]
                    }
                } else if (t[0] > 0 && t[1] > 0) {
                    temp = Math.min(t[0], t[1])
                    if (temp < tmin) {
                        tmin = temp
                        closestObject = objects[i]
                    }
                }
            }
        }
        if (tmin == 99999999) {
            pixelColor = backgroundColor;
        } else {
            var vecs = this.createDistribution();
            pixelColor = new Color(closestObject.dr, closestObject.dg, closestObject.db)
            var light = new Color(0,0,0)
            var aLight = new Color (0,0,0)
            for(var i = 0; i < lights.length; i++) {
                if (closestObject instanceof Disk) {
                    var N = closestObject.norm
                } else {
                    var N = Vector.norm(Vector.minus(Vector.plus(ray.start, Vector.times(tmin, ray.dir)), closestObject.origin))
                }
                var L = Vector.norm(Vector.minus(new Vector(lights[i].x, lights[i].y, lights[i].z) , Vector.plus(ray.start, Vector.times(tmin, ray.dir))))
                var NL = Math.max(0, Vector.dot(N,L))
                var V = Vector.norm(Vector.minus(ray.start, Vector.plus(ray.start, Vector.times(tmin, ray.dir))))
                var R = Vector.plus(Vector.times(-1, V), Vector.times(2 * Vector.dot(V, N), N))
                var tempRay : Ray = {start: Vector.plus(Vector.plus(ray.start, Vector.times(tmin, ray.dir)), Vector.times(0.001, N)), dir: L}
                var inShad = this.testRay(tempRay)
                if (!inShad) {
                    var kd = new Color(closestObject.dr,closestObject.dg,closestObject.db)
                    var cont = Color.scale(NL, kd)
                    cont = Color.times(cont, lights[i].color)
                    var ks = closestObject.k_specular
                    var scale = Color.scale(ks, lights[i].color)
                    var specpow = Math.max(0, Vector.dot(L, R))
                    specpow = Math.pow(specpow, closestObject.specular_pow)
                    var specl = Color.scale(specpow, scale)
                    var sum = Color.plus(cont, specl)
                    light = Color.plus(light, sum)
                }
            }
            for (var i = 0; i < areaLights.length; i++) {
                var adc = new Color (0,0,0)
                var msc = new Color (0,0,0)
                for (let temp of vecs) {
                    var pos = Vector.plus(areaLights[i].position, Vector.plus(Vector.times(temp.s, areaLights[i].u), Vector.times(temp.t, areaLights[i].v)))
                    if (closestObject instanceof Disk) {
                        var N = closestObject.norm
                    } else {
                        var N = Vector.norm(Vector.minus(Vector.plus(ray.start, Vector.times(tmin, ray.dir)), closestObject.origin))
                    }
                    var L = Vector.norm(Vector.minus(pos, Vector.plus(ray.start, Vector.times(tmin, ray.dir))))
                    var NL = Math.max(0, Vector.dot(N,L))
                    var V = Vector.norm(Vector.minus(ray.start, Vector.plus(ray.start, Vector.times(tmin, ray.dir))))
                    var R = Vector.plus(Vector.times(-1, V), Vector.times(2 * Vector.dot(V, N), N))
                    var tempRay : Ray = {start: Vector.plus(Vector.plus(ray.start, Vector.times(tmin, ray.dir)), Vector.times(0.001, N)), dir: L}
                    var inShad = this.testRay(tempRay)
                    if (!inShad) {
                        var kd = new Color(closestObject.dr,closestObject.dg,closestObject.db)
                        var cont = Color.scale(NL, kd)
                        cont = Color.times(cont, new Color(areaLights[i].color.r, areaLights[i].color.g, areaLights[i].color.b))
                        var ks = closestObject.k_specular
                        var scale = Color.scale(ks, new Color(areaLights[i].color.r, areaLights[i].color.g, areaLights[i].color.b))
                        var specpow = Math.max(0, Vector.dot(L, R))
                        specpow = Math.pow(specpow, closestObject.specular_pow)
                        var specl = Color.scale(specpow, scale)
                        adc = Color.plus(adc, cont)
                        if (Color.lightness(specl) > Color.lightness(msc)) {
                            msc = specl
                        } else {
                            msc = msc
                        }
                    }
                }
                adc = Color.scale(1 / vecs.length, adc)
                var sum = Color.plus(adc, msc)
                aLight = Color.plus(aLight, sum)
            }
            var ambientCol = ambientLight.color
            var ki = Color.scale(closestObject.k_ambient, ambientCol)
            ki = Color.times(ki, new Color(closestObject.dr, closestObject.dg, closestObject.db))
            pixelColor = Color.plus(ki, light)
            if (areaLights.length > 0) {
                pixelColor = Color.plus(pixelColor, aLight)
            }
        }
        return pixelColor;
    }

    // draw_scene is provided to create the image from the ray traced colors. 
    // 1. it renders 1 line at a time, and uses requestAnimationFrame(render) to schedule 
    //    the next line.  This causes the lines to be displayed as they are rendered.
    // 2. it uses the additional constructor parameters to allow it to render a  
    //    smaller # of pixels than the size of the canvas
    //
    // YOU WILL NEED TO MODIFY draw_scene TO IMPLEMENT DISTRIBUTION RAY TRACING!
    //
    // NOTE: this method now has three optional parameters that are used for the depth of
    // field extra credit part. You will use these to modify this routine to adjust the
    // eyeRays to create the depth of field effect.
    draw_scene(lensSize?: number, depth1?: number, depth2?: number) {

        // rather than doing a for loop for y, we're going to draw each line in
        // an animationRequestFrame callback, so we see them update 1 by 1
        var pixelWidth = this.width / this.screenWidth;
        var pixelHeight = this.height / this.screenHeight;
        var y = 0;
        
        this.clear_screen();

        var renderRow = () => {
            for (var x = 0; x < this.screenWidth; x++) {
                // HINT: if you implemented "createDistribution()" above, you can use it here
                let vecs = this.createDistribution()

                // HINT: you will need to loop through all the rays, if distribution is turned
                // on, and compute an average color for each pixel.

                var ray = this.eyeRay(x, y);
                var c = this.traceRay(ray);

                var color = Color.toDrawingColor(c)
                this.ctx.fillStyle = "rgb(" + String(color.r) + ", " + String(color.g) + ", " + String(color.b) + ")";
                this.ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth+1, pixelHeight+1);
            }
            
            // finished the row, so increment row # and see if we are done
            y++;
            if (y < this.screenHeight) {
                // finished a line, do another
                requestAnimationFrame(renderRow);            
            } else {
                console.log("Finished rendering scene")
            }
        }

        renderRow();
    }

    clear_screen() {
        this.ctx.fillStyle = this.canvasColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);

    }
}
export {RayTracer}