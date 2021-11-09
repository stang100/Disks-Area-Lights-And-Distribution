# Assignment 3b:  Disks, Area Lights, and Distribution Ray Tracing

In this project you will expand the ray tracer that you wrote for Project 3A. The new features that you will add are distribution ray tracing, and adding disk objects and area light sources to the scene description. Adding disks will allow you to create scenes that have more geometric richness, including flat planes upon which other objects may rest. Area light sources will allow the creation of soft shadows when distribution ray tracing is enabled. In addition to these new scene features, you will add shadows to your illumination equation. 

Distribution ray tracing will enable:
- Soft shadows for area light sources. You will cast more than one ray per pixel, and each shadow ray will be aimed at different places on the area light source. 
- Anti-aliasing of the scene. Casting multiple rays per eye ray (image pixel) will anti-alias the scene, reducing noticeable stair-steps at the edges of objects.  

There will also be opportunities to get extra credit on this assignment by implementing additional features (see below).

## Due: Tuesday November 9th, 11:59pm

## Rubric

1. (2 points) Correct ray/disk intersection
2. (1 point) Area light source behaves similarly to point light with no distribution 
3. (2 points) Shadows with hard edges created with no distribution 
4. (2 points) Distribution of eye rays created correctly for regular grid when no jitter requested
5. (1 point) Jittered distribution created correctly (randomly distributed within pixels)
6. (1 point) Area lights appear in highlights correctly with distribution
7. (1 point) Area lights cast soft shadows correctly with distribution

Bonus points for optional parts
1. (2 point) Reflection implemented correctly
2. (2 point) Either motion blur or depth of field implemented correctly

## Project Description

You have five primary goals for the first part of this project:

1. Create disk objects, including a ray/disk intersection routine 
2. Create area light sources
3. Enable shadow creation by light sources
4. Shoot multiple rays per pixel (super-sampling), and use these for anti-aliasing. 
5. Create multiple light rays per surface point being shaded, and use these for soft shadows as well as a specular highlights 

# Provided Code

The provided source code in `testRayTracer.ts` is similar to the same file in 3A, creating various scenes using the functions you will write. Each number key 1-0 plus - and = is assigned to a single scene function and pressing that key should reset the scene and create an image of the new one. The scenes are different than 3A. There are additional keys that adjust how many pixels are created (keys: q,w,e,r,t,y,u,i,o,p), and whether or not jittered sampling is enabled for soft shadows (keys: j,n).   If you choose to do any of the option parts of the assignment for extra credit, there are keys to turn on or off reflections (keys: g,v), motion blur (keys: k,m), and depth of field (keys: d,x).

As with 3A, the code in `rayTracer.ts` contains some code to get your started, along with empty functions used for scene setup.  There are new functions for area lights and disks (`new_disk()` and `area_light()`) that you will need to implement, and some new optional parameters on `new_sphere()` and `draw_scene()` that you will use with some of the option parts of the assignment. These are described below. As with 3A, feel free to define any classes, objects, data structures, and global variables that you want to accomplish this project.

We have included some additional hints and suggested methods in the code, which are marked appropriately.

You should modify the source code in any way you see fit, and comment your code (include placing your name in the header). The source code is written in Typescript. You are NOT allowed to use any graphics commands from libraries such as Three.js or native web libraries, all code must be your own. We are not using rasterization for this project, so you should not need any of these libraries.

# Scene Description Language

Each scene is described by calling several functions that set up and render the scene.  In addition to the test scenes, we have also provided empty functions for you to write in order to create and expand your ray tracer.  The empty functions from part A remain in the file, so you should incorporate your code from Part A in your program for Part B. Feel free to define any objects, data structures, and global variables that you want to accomplish this project.

Below are the new functions that you will need to implement for this assignment:

#### `new_disk  (x, y, z, radius, nx, ny, nz, dr, dg, db, k_ambient, k_specular, specular_power, vx?: number, vy?: number, vz?: number)

Specifies the creation of a disk with its center at `c = (x, y, z)`, with a given `radius`, and with a surface normal `n = (nx, ny, nz)`.  The diffuse color of the sphere is given by `dr, dg, db`.  The coefficient `k_ambient` specifies how much of the ambient light combines with the diffuse color of the surface.  For this project, we will assume that all specular highlights are white, and the brightness of the highlight is given by `k_specular`. The tightness of the highlight is guided by `specular_power`. 

The optional parameters `vx, vy, vz` are only needed for optional motion blur part of the assignment. They represent the velocity of the object. The object is moving from `x,y,z - vx,vy,vz` to `x,y,z + vx,vy,vz` during the time interval being rendered.

#### `area_light (r, g, b, x, y, z, ux, uy, uz, vx, vy, vz)`

Create an area light source at center position `c = (x,y,z)` and its color `(r, g, b)`. Your code should allow at least 10 area light sources.  The vectors `u = (ux, uy, uz)` and `v = (vx, vy, vz)` define a rectangle that gives off light. Specifically, points on the light source can be parameterized by values `s` and `t` in the range of `[-1, 1]`, which define points at positions `p = c + su + tv`. 

When only a single eye ray (no distribution) is used, area lights behave similarly to point lights, shooting a single light ray to their center point.

When more than one ray is used for each pixel (set by the `set_sample_level()` command), you should calculate shadows based on distribution ray tracing.  For each of the rays for a given pixel, you will calculate a distribution of sample positions on the area light source and use them as the light positions for shadow rays. You should calculate these sample positions on the area light by varying s and t in a grid pattern, l. 

For each of these rays you will compute the light contribution in two steps.  For the diffuse contribution, you should compute the contribution per ray, including shadowing, and then average the contribution for all light rays.  For the specular component, if any of the light rays is not shadowed, then you should compute the full specular contribution for that point.

As with point light sources, you do not actually draw the area light sources.  

#### `set_sample_level (level)`  

This method saves the sample level. The `level` is the amount of rays that will be shot per-pixel, for the purposes of anti-aliasing and soft shadows (distribution ray tracing). For level = 1, the default, just a single ray will be shot per-pixel, and all shadows will be hard shadows. For integer values of level greater than one, you will shoot multiple rays per pixel, and these rays will be spaced evenly through different sub-pixels in the pixel in a square grid pattern.  When level = 2, you will shoot 2 x 2 = 4 rays.  For level = 3, shoot 3 x 3 = 9 rays.  In general, you will shoot level x level rays per pixel. The final color of a pixel should be the average of the colors from each of these rays.

When using area light sources (see above) you will be shooting shadow rays towards various parts of the area light sources.  This will give you the effect of soft shadows.

This command is not found in any specific test scene.  Instead, various levels of sampling are set by typing one of the following characters before you render a scene: "qwertyuiop".   Typing "q" sets the sample level to 1.  Typing "w" sets it to 2, and so on up to "p" setting the sample level to 10 (which cause 10x10 = 100 rays to be shot per pixel).

#### `jitter_off()`

This is the default setting for whether to perform jittered sampling.  When jitter is off, you will use a regular grid pattern for creating the position samples on area light sources. Your "soft" shadows will look like overlapping dark regions. Like the `set_sample_level()` command, this command is not used in any particular scene.  Instead, you type the character "n" before rendering a given scene.

#### `jitter_on()`

When jitter is turned on, you will add a slight bit of randomness to the eye rays and the positions of sample on the rectangle for area light sources.  The result will be that your antialiasing and soft shadows will be more smooth than what you get without jitter.  The soft shadows may appear to be noisy for small values used in `set_sample_level()`.  When using higher sample levels, the noise will be reduced.  Type the letter "j" before rendering a scene to call this command.  The regular grid and jittered samples should be selected as described on this slide in the recorded lecture.

<img src="distributions.png" width="400">


#### `reflection_on()`and `reflection_off()`

An optional extra credit part of the assignment is to implement reflected rays (see below).  Pressing the "g" key turns on reflected rays, and "v" turns off reflected rays.  Default is off.

#### `blur_on()` and `blur_off()`

An optional extra credit part of the assignment is to implement motion blur (see below).  Pressing the "k" key turns on motion blur, and "m" turns off motion blur.  Default is off.

#### `depth_on()` and `depth_off()`

An optional extra credit part of the assignment is to implement depth of field (see below).  Pressing the "d" key turns on depth of field, and "x" turns off depth of field.  Default is off.

## Commands Modified from Part A

Below are the methods that you implemented in part A this assignment that have changed:

#### `new_sphere  (x, y, z, radius, dr, dg, db, k_ambient, k_specular, specular_power, vx?: number, vy?: number, vz?: number)`

The optional parameters vx, vy, vz are only needed for optional motion blur part of the assignment. They represent the velocity of the object. The object is moving from `x,y,z - vx,vy,vz` to `x,y,z + vx,vy,vz` during the time interval being rendered.

#### `draw_scene(lensSize?: number, depth1?: number, depth2?: number)`

The three new optional parameters are used for the depth of field extra credit part. You will use these to modify this routine to adjust the eye rays to create the depth of field effect eyeRays.  `lensSize` represents the size of the lens (the area that the origin of the eyeRays should be spread over). `depth1` represents the distance along the eye ray that the lens sits at. `depth2` is the distance along the eye ray that is the focal plane.  

# Results for Main assignment

NOTE: all of the images here are generated with the parameters `super(div, 500, 600, 250, 300)` in the constructor, except the final high quality renders at the bottom.

Below are the images that your program should generate for the sample scenes, when you press the keys "1234567890-=". No scene is generated when the program starts, you will just see a light yellow canvas. 

<img src="scene1.png" width="200"> <img src="scene2.png" width="200"> <img src="scene3.png" width="200"> <img src="scene4.png" width="200"> <img src="scene5.png" width="200"> <img src="scene6.png" width="200"> <img src="scene7.png" width="200"> <img src="scene8.png" width="200"> <img src="scene9.png" width="200"> <img src="scene0.png" width="200"> <img src="scene-.png" width="200"> <img src="scene=.png" width="200">

(Note: these and other images, are store in full resolution in the project, if you would like to examine them closer.)

Each of these scenes will be slightly improved if you turn on supersampling before rendering them, which performs anti-aliasing, soft shadows, and area light specular highlights.  Because you will shoot and average together multiple slightly different rays per pixel, the silhouettes of objects will blend together more cleanly instead of showing stair-steps, the shadows will be smoother, and the specular highlights will fill in. To get these anti-aliased images, you should type the character "r" before rendering the given scene, which sets the sample level to 4, and type the character "j" to turn on jittering.

<img src="scene1-rj.png" width="200"> <img src="scene2-rj.png" width="200"> <img src="scene3-rj.png" width="200"> <img src="scene4-rj.png" width="200"> <img src="scene5-rj.png" width="200"> <img src="scene6-rj.png" width="200"> <img src="scene7-rj.png" width="200"> <img src="scene8-rj.png" width="200"> <img src="scene9-rj.png" width="200"> <img src="scene0-rj.png" width="200"> <img src="scene--rj.png" width="200"> <img src="scene=-rj.png" width="200">

If we zoom in on the final scene, we can see the antialiasing on the sphere edges, the area shadows (combined with the sharp point shadow) and the highlights from the area and point light.

<img src="scene=-rj-zoom.png" width="400">

Here is this final image, with various levels of antialiasing (qweru) and non-jittered distributions:

<img src="three-spheres.png" width="200"> <img src="three-spheres-w.png" width="200"> <img src="three-spheres-e.png" width="200"> <img src="three-spheres-r.png" width="200"> <img src="three-spheres-u.png" width="200">

Here is this same final image, with jittered distributions:

<img src="three-spheres-j.png" width="200"> <img src="three-spheres-wj.png" width="200"> <img src="three-spheres-ej.png" width="200"> <img src="three-spheres-rj.png" width="200"> <img src="three-spheres-uj.png" width="200">

Especially without only 1 ray, or with a small number of rays, you can see very dramatic differences between the two, with the results getting better as the number of rays increases.

# Submission

In addition to your code, you should generate an image using the command "pj=" at a full resolution of 500x600.  Name this file "submission-<your-gt-email-id>.png" and include it in the top level folder.

# Optional Components

In this assignment you have the option of implementing two additional features for extra credit.

## Extra credit 1:  Reflection (2 point)

For this extra credit, you will implement reflection rays. For each ray that strikes a triangle, if the maximum reflection depth (initially set as 5 on the line `maxDepth = 5;`) has been reached, you should not add any more reflections. Otherwise, you should generate a new reflection ray (by reflecting the current ray around the surface normal) and cast it into the scene. The color contribution of that ray should be adjusted using the `k_specular` surface property and added to the color of the pixel.

You should only generate one reflected ray per incoming ray, even if there are distributed rays being computed.

Here is this images from above, stating with no distribution and continuing with jittered distributions above) (these would be generated with "g=", "jg=", "wjg=", "ejg=", "rjg=" and "ujg="):

<img src="three-spheres-g.png" width="200"> <img src="three-spheres-jg.png" width="200"> <img src="three-spheres-wjg.png" width="200"> <img src="three-spheres-ejg.png" width="200"> <img src="three-spheres-rjg.png" width="200"> <img src="three-spheres-ujg.png" width="200"> 

Finally, here is a high quality "pjg=" run at full resolution:

<img src="3-sphere-refl.png" width="400">

#### Submission

Inform your TA that you did this extra credit.  In addition to your code, you should generate an image using the command "pjg=" at a full resolution of 500x600.  Name this file "submission-reflection-<your-gt-email-id>.png" and include it in the top level folder.

## Extra credit 2: Motion Blur or Depth of Field (2 points)

You may earn a second extra credit point, only after you do the first extra credit, by implementing either motion blur or depth of field effects.

### Motion Blur

Motion blur is implemented on moving objects by observing that a single image captures a scene over a period of time.  During that time, the moving objects in the scene are captured at all locations they are in during that time period, with the results averaged together.  To using distribution ray tracing, we select a different location for each moving object for each ray shot. 

We have provided optional velocity values for the sphere and disk.  This velocity represents a +/- value around the objects location during the frame time, with the object being anywhere from  `x,y,z - vx,vy,vz` to `x,y,z + vx,vy,vz` during the time interval.  For each ray, you should chose one position for the object randomly, and render the scene using that time.  When many rays are shot per eye ray, using a different time for each ray will result in an average pixel color over many possible object locations.  A sample image on the final scene is this, captured by typing "pjgk="

<img src="motion-blur.png" width="400">

#### Submission

Inform your TA that you did this extra credit.  In addition to your code, you should generate an image using the command "pjgk=" at a full resolution of 500x600.  Name this file "submission-blur-<your-gt-email-id>.png" and include it in the top level folder.

### Depth of Field

Depth of field is implemented by simulating a more realistic lens projection.  Our basic ray tracer shoots a ray from a single center of projection (a pinhole camera).  Real cameras have lenses with larger apertures, that collect light rays arriving at many directions, and focusing them on the image plane.  

Simulating a real lens is complicated (see the book, or sources on the internet).  Here, we simulate it with the following parameters for an eye ray:
- `lensSize` represents the size of the lens (the area that the origin of the eyeRays should be spread over)
- `depth1` represents the distance along the eye ray that the lens sits at
- `depth2` is the distance along the eye ray that is the focal plane.

The approach you should take is as follows.  When you have a distribution for an eye ray, instead of jittering the direction of the ray through the viewplane, you will instead 
- position a rectangle of size "viewplane pixel size * lensSize" along the eye ray at distance "depth1".
- distributed points over that rectangle
- use those points as the origin of your distribution rays, with their direction pointing at the point "depth2" distance along the original eye ray

In this way, each pixel creates a set of rays that focus through a single focal distance.

Averaging these values should generate an image with a depth of field effect, like this one captured by typing "pjgd="

<img src="depth-of-field.png" width="400">

#### Submission

Inform your TA that you did this extra credit.  In addition to your code, you should generate an image using the command "pjgd=" at a full resolution of 500x600.  Name this file "submission-depth-<your-gt-email-id>.png" and include it in the top level folder.

# Authorship Rules

The code that you turn in should be entirely your own. You are allowed to talk to other members of the class and to the instructor and the TA’s about general implementation of the assignment. It is also fine to seek the help of others for general Typescript and Web programming questions. You may not, however, use code that anyone other than yourself has written. The only exceptions are that you should use your code from Project 1A and the source code that we provide for this project. Code that is explicitly not allowed includes code taken from the Web, github, from books, from other students, or from any source other than yourself. You should not show your code to other students. Feel free to seek the help of the instructor and the TA's for suggestions about debugging your code.

# Submission

You will check out the project from GitHub Classroom, and submit it there.  

**Do Not Change the names** of the existing files (e.g., index.html, rayTracer.ts, etc).  The TAs need to be able to test your program as follows:

1. cd into the directory and run ```npm install```
2. run with ```npm run dev```
3. visit ```http://localhost:3000/index.html```

Please test that your submission meets these requirements.  For example, after you check in your final version of the assignment to github, check it out again to a new directory and make sure everything builds and runs correctly.
 
## Development Environment

The development environment is the same as used in previous assignments.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Computer Graphics CS3451 Fall 2021</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.blairmacintyre.me" property="cc:attributionName" rel="cc:attributionURL">Blair MacIntyre</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

The intent of choosing (CC BY-NC-SA 4.0) is to allow individuals and instructors at non-profit entities to use this content.  This includes not-for-profit schools (K-12 and post-secondary). For-profit entities (or people creating courses for those sites) may not use this content without permission (this includes, but is not limited to, for-profit schools and universities and commercial education sites such as Corsera, Udacity, LinkedIn Learning, and other similar sites).
