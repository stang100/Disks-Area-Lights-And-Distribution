import {RayTracer} from "./rayTracer"

// A class for our application state and functionality
class TestRT extends RayTracer {
    
    constructor (div: HTMLElement) {
        super(div, 500, 600, 500, 600)

        document.addEventListener("keydown", (event) => {
            this.keyPressed(event.key)
        });

        this.clear_screen()
    }

    keyPressed(key: string) {
        console.log ("key pressed\n");
        switch(key) {

            // scenes
            case '`':  this.scene_00(); break;
            case '1':  this.scene_01(); break;
            case '2':  this.scene_02(); break;
            case '3':  this.scene_03(); break;
            case '4':  this.scene_04(); break;
            case '5':  this.two_spheres_ambient(); break;
            case '6':  this.one_disk(); break;
            case '7':  this.five_disks(); break;
            case '8':  this.three_intersecting_disks(); break;
            case '9':  this.two_spheres_point_light(); break;
            case '0':  this.two_spheres_area_light(); break;
            case '-':  this.colored_lights(); break;
            case '=':  this.three_spheres_disc_area_light(); break;

            // setting the per-pixel sample level (shoot more rays)
            case 'q':  this.set_sample_level (1); break;
            case 'w':  this.set_sample_level (2); break;
            case 'e':  this.set_sample_level (3); break;
            case 'r':  this.set_sample_level (4); break;
            case 't':  this.set_sample_level (5); break;
            case 'y':  this.set_sample_level (6); break;
            case 'u':  this.set_sample_level (7); break;
            case 'i':  this.set_sample_level (8); break;
            case 'o':  this.set_sample_level (9); break;
            case 'p':  this.set_sample_level (10); break;
            
            // turn on or off jittered sanpling
            case 'j':  this.jitter_on(); break;
            case 'n':  this.jitter_off(); break;

            // turn on or off reflections (optional)
            case 'g':  this.reflection_on(); break;
            case 'v':  this.reflection_off(); break;

            // turn on or off motion blur (optional)
            case 'k':  this.blur_on(); break;
            case 'm':  this.blur_off(); break;

            // turn on or off depth blur (optional)
            case 'd':  this.depth_on(); break;
            case 'x':  this.depth_off(); break;
        }
    }
      
      scene_00() {
        console.log ("start of scene_00\n");
        
        this.reset_scene();
        this.set_background (0.9, 0.4, 0.5);

        this.draw_scene();
      }

      // one diffuse red sphere
      scene_01() {
        
        console.log ("start of scene_01\n");
        
        this.reset_scene();
        this.set_background (0.4, 0.4, 0.9);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1, 7, 4, 5);
        
        //  sphere: x,y,z, radius, diff_red, diff_green, diff_blue, k_ambient, k_spec, k_pow
        this.new_sphere (0, 0, -4,  1, 0.9, 0.0, 0.0, 0.0, 0.0, 1.0);
        
        this.draw_scene();
      }
      
      // two spheres
      scene_02() {
        
        console.log ("start of scene_02\n");
        
        this.reset_scene();
        this.set_background (0.12, 0.1, 0.2);
        
        this.set_fov (60.0);
        this.set_eye (4,0,0, 1,0,0, 0,1,0);
        
        this.new_light (1, 1, 1, 7, 7, -5);
        this.ambient_light (0.1, 0.1, 0.4);
        
        this.new_sphere (0, 0, 0,       1,   0, 0.5, 0,   0.6, 1, 200);
        this.new_sphere (1, 0.6, -1,  0.3,   0.6, 0, 0,   0.5, 0, 0);
        
        this.draw_scene();
      }
      
      // one sphere lit by multiple colored lights
      scene_03() {
        
        console.log ("start of scene_03\n");
        
        this.reset_scene();
        this.set_background (0.2, 0.4, 0.9);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (0.8, 0.2, 0.2, 3, 4, 0);
        this.new_light (0.2, 0.8, 0.2, -3, 4, 0);
        this.new_light (0.2, 0.2, 0.8, 0, 4, -5);
        
        this.ambient_light (0.2, 0.2, 0.2);
        
        this.new_sphere (0, 0.5, -3, 1, 0.8, 0.8, 0.8, 0.2, 0, 0);
        
        this.draw_scene();
      }
      
      // several spheres that intersect each other
      scene_04() {
        
        console.log ("start of scene_04\n");
        
        this.reset_scene();
        this.set_background (0.9, 0.4, 0.2);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1, 2.5, 1, 0);
        
        this.ambient_light (0.2, 0.2, 0.2);
        
        // body
        this.new_sphere (0.6, 0, -3, 0.5, 0.8, 0.8, 0.8, 0.2, 0, 0);
        this.new_sphere (0, 0, -3, 0.45, 0.8, 0.8, 0.8, 0.2, 0, 0);
        this.new_sphere (-0.6, 0, -3, 0.4, 0.8, 0.8, 0.8, 0.2, 0, 0);
        this.new_sphere (-1.1, 0, -3, 0.35, 0.8, 0.8, 0.8, 0.2, 0, 0);
        
        // eyes
        this.new_sphere (0.8, 0.3, -2.65, 0.1, 0.2, 0.2, 0.7, 0.2, 1, 125);
        this.new_sphere (0.5, 0.3, -2.6, 0.095, 0.2, 0.2, 0.7, 0.2, 1, 125);
        
        // nose
        this.new_sphere (0.62, 0.1, -2.5, 0.09, 0.2, 0.7, 0.2, 0.2, 0, 0);
        
        this.draw_scene();
      }
      
    // two red spheres, one with high ambient shading component
    two_spheres_ambient() {
      
        console.log ("start of two_spheres_ambient\n");
        this.reset_scene();
        
        this.set_background (0.2, 0.2, 0.2);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1, 7, 7, 5);
        this.ambient_light (0.4, 0.4, 0.4);
        
        // two spheres, one with high ambient component
        this.new_sphere (-1.1, 0, -4,  1,  0.9, 0.0, 0.0,  0.0,  0.5, 10.0);
        this.new_sphere ( 1.1, 0, -4,  1,  0.9, 0.0, 0.0,  0.7,  0.5, 10.0);
        
        this.draw_scene();
      
        console.log ("end of two_spheres_ambient\n");
      }
      
      // one red disk
      one_disk() {
        
        console.log ("start of one_disk\n");
        this.reset_scene();

        this.set_background (0.4, 0.4, 0.9);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1,   0, 4, 5);
        
        this.new_disk (0, 0, -4,  1,  0, 0, 1,  0.9, 0, 0,  0,  0, 1);
        
        this.draw_scene();
      
        console.log ("end of one_disk\n");
      }
      
      // five disks of different orientations
      five_disks() {
        
        console.log ("start of five_disks\n");
        this.reset_scene();

        this.set_background (0.4, 0.4, 0.9);
        
        this.set_fov (60.0);
        this.set_eye (0,0,10, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1,   0, 5, 10);
        
        this.new_disk (-4.4, 0, 0,  1,  0, 1, 0.1,  1, 0, 0,  0,  0, 1);
        this.new_disk (-2.2, 0, 0,  1,  0, 1, 0.4,  1, 0.6, 0.2,  0,  0, 1);
        this.new_disk (   0, 0, 0,  1,  0, 1, 0.7,  0.9, 0.9, 0,  0,  0, 1);
        this.new_disk ( 2.2, 0, 0,  1,  0, 1, 1.4,  0, 1, 0,  0,  0, 1);
        this.new_disk ( 4.4, 0, 0,  1,  0, 0, 1.0,  0, 1, 1,  0,  0, 1);
        
        this.draw_scene();
      
        console.log ("end of five_disks\n");
      }
      
      // three intersecting disks
      three_intersecting_disks() {
        
        console.log ("start of three_intersecting_disks\n");
        this.reset_scene();

        this.set_background (0.4, 0.4, 0.9);
        
        this.set_fov (60.0);
        this.set_eye (1.2, 1.3, 3, -0.344548, -0.373261, -0.861372, -0.13862, 0.92772, -0.34656);
        
        this.new_light (1.2, 1.2, 1.2,   2, 4, 6);
        this.ambient_light (1, 1, 1);
        
        this.new_disk (0, 0, 0,  1,  1, 0, 0,  0.9, 0, 0,  0.2,  0, 1);
        this.new_disk (0, 0, 0,  1,  0, 1, 0,  0, 0.9, 0,  0.2,  0, 1);
        this.new_disk (0, 0, 0,  1,  0, 0, 1,  0, 0, 0.9,  0.2,  0, 1);
        
        this.draw_scene();
      
        console.log ("end of three_intersecting_disks\n");
      }
      
      // two spheres and an this.area light source
      three_spheres_disc_area_light() {
        
        console.log ("start of four_spheres_area_light\n");
        this.reset_scene();

        this.set_background (0.05, 0.05, 0.05);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1.2,   -2, 4, -1);

        this.area_light (1, 1, 1,   3, 5, 1,   1, 0, -0.5,   0, 2, -0.25);
        this.ambient_light (0.1, 0.1, 0.1);
        
        this.new_sphere ( 0,   0, -4,      1,    0.5, 0.3, 0.3,  0.2, 0.7, 100);

        // extra velocity for the light source, will be ignored unless motion blur is enabled and implemented
        this.new_sphere ( 1.1, -0.5, -3,   0.5,  0.3, 0.6, 0.1,  0.2, 0.7, 100, -0.5,0,0);
        this.new_sphere (-0.5, -0.6, -2,   0.4,  0.4, 0.1, 0.8,  0.2, 0,   100);
        
        this.new_disk (0, -1, 0, 70.0, 0, 1, 0,  0.2, 0.2, 0.2,  0.0, 0.1, 100);

        // extra depth of field parameters.  Lens is 0.3 wide, 0.5 in front of the eye, and focused 3 units ahead 
        // (near the rightmost sphere).  Very extreme DOF.
        this.draw_scene(0.3, 0.5, 3);   
      
        console.log ("end of four_spheres_area_light\n");
      }
      
      // several spheres and disks that intersect each other
      worm() {
        
        console.log ("start of worm\n");
        this.reset_scene();

        this.set_background (0.4, 0.4, 0.9);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
        
        this.new_light (1, 1, 1,  1.2, 1, 0);
        
        this.ambient_light (0.2, 0.2, 0.2);
        
        // body
        this.new_sphere (0.6, 0, -3, 0.5, 0.8, 0.8, 0.8, 0.2, 0, 0);
        this.new_sphere (0, -0.3, -3, 0.45, 0.8, 0.8, 0.8, 0.2, 0, 0);
        this.new_sphere (-0.6, -0.3, -3, 0.4, 0.8, 0.8, 0.8, 0.2, 0, 0);
        this.new_sphere (-1.1, -0.3, -3, 0.35, 0.8, 0.8, 0.8, 0.2, 0, 0);
        
        // eyes
        this.new_sphere (0.75, 0.2, -2.6, 0.1, 0.2, 0.2, 0.7, 0.2, 0, 0);
        this.new_sphere (0.45, 0.2, -2.6, 0.095, 0.2, 0.2, 0.7, 0.2, 0, 0);
        
        // nose
        this.new_sphere (0.62, 0.0, -2.5, 0.09, 0.2, 0.7, 0.2, 0.2, 0, 0);
        
        // ears
        
        this.new_disk (0.35, 0.4, -2.7,  0.2,  0, 0, 1,  0.8, 0.2, 0.3,  0.2, 0, 0);
        this.new_disk (0.85, 0.4, -2.7,  0.2,  0, 0, 1,  0.8, 0.2, 0.3,  0.2, 0, 0);
      
        this.draw_scene();
      
        console.log ("end of worm\n");
      }
      
      // two spheres with point light shadows
      two_spheres_point_light() {
        
        console.log ("start of two_spheres_point_light\n");
        this.reset_scene();

        this.set_background (0.2, 0.1, 0.1);
        
        this.set_fov (60.0);
        this.set_eye (4,0,0, 0,0,0, 0,1,0);
        
        this.new_light (1, 1, 1, 7, 7, -5);
        this.ambient_light (0.4, 0.4, 0.4);
        
        this.new_sphere (0, 0, 0,     1,   0, 0.5, 0,   1.0, 0.7, 200);
        this.new_sphere (1, 0.6, -1,  0.3, 0.6, 0, 0,   0.5, 0.1, 100);
        
        this.draw_scene();
      
        console.log ("end of two_spheres_point_light\n");
      }
      
      // two spheres and an this.area light source
      two_spheres_area_light() {
        
        console.log ("start of two_spheres_area_light\n");
        this.reset_scene();

        this.set_background (0.1, 0.2, 0.05);
        
        this.set_fov (60.0);
        this.set_eye (4,0,0, 0,0,0, 0,1,0);
        
        this.area_light (1, 1, 1,   7, 7, -5,   0, 0, -3,   0, 3, 0);
        this.ambient_light (0.4, 0.4, 0.4);
        
        this.new_sphere (0, 0, 0,  1,  0.6, 0, 0,  1.0, 0.7, 20);
        this.new_sphere (1, 0.6, -1,  0.3,  0, 0.6, 0,  0.5, 0, 0);
        
        this.draw_scene();
      
        console.log ("end of two_spheres_area_light\n");
      }
      
      // one sphere lit by multiple colored lights, floating above a disk
      colored_lights() {
        
        console.log ("start of colored_lights\n");
        this.reset_scene();

        this.set_background (0.0, 0.0, 0.0);
        
        this.set_fov (60.0);
        this.set_eye (0,0,0, 0,0,-1, 0,1,0);
                
        this.area_light (0.8, 0.2, 0.2,   3, 4,  0,  2, 0, 0,  0, 0, 2);
        this.area_light (0.2, 0.8, 0.2,  -3, 4,  0,  2, 0, 0,  0, 0, 2);
        this.area_light (0.2, 0.2, 0.8,   0, 4, -5,  2, 0, 0,  0, 0, 2);
        
        this.ambient_light (0.2, 0.2, 0.2);
        
        this.new_sphere (0, 0.5, -3.5, 1, 0.8, 0.8, 0.8, 0.2, 0, 0);
        
        this.new_disk (0, -0.8, 0, 7.0, 0, 1, 0,  0.8, 0.8, 0.8,  0.0, 1, 1000);
        
        this.draw_scene();
      
        console.log ("end of colored_lights\n");
      }
      
      // dummy function, not really used
      draw() {
      }      
}

// a global variable for our state
var tracer: TestRT


// main function, to keep things together and keep the variables created self contained
function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    tracer = new TestRT(div);
}

exec()