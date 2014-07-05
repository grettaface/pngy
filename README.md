PNGY
====

Pngy is a javascript object that allows for highly controllable png animations.
---


[View the demo](http://jsfiddle.net/grettaface/y9GLa/)


It has no dependencies other than Javascript. As long as you provide it with a spritesheet that it expects, it will do the rest. **Minified version is only 4kb!**

It provides users with much more control over animations without needing to use things like canvas. 

It gives you the flexibility to do things like:

- Play a linear animation with a png sprite sheet
- Play specific portions of that sprite sheet
- Play them in reverse  
- Adjust the frame rate
- Remove the animation from the DOM
- AND MORE!

Eventually, I would like to create robust docs for it. For the time being, view the demo file and the js file to see all that is currently available.

Setup
---


You will need to create a spritesheet with your image sequence. Make sure they are evenly spaced and the dimensions are a factor of the required div size. For example, if your div will be 100x100, make sure the final file dimensions are divisible by those values. The script will automatically determine the number of frames based on those dimensions.

I use Flash for my animations and create spritesheet from there. [Generating sprite sheets from Flash](http://www.adobe.com/devnet/flash/articles/using-sprite-sheet-generator.html)

When creating a spritesheet, I use a transparent rectangle behind the animation to ensure that each image is the same size. If you don't Flash will try to push the frames together thus breaking your animation.

The code
---

Create a new instance

var **png** = new Pngy(Object);



The object that is passed in holds the parameters for Pngy. It accepts the following:

**node**:String (required) = query string to search. i.e. "#pngy"

**img**:String (required) = path to spritesheet

**autoPlay**:Boolean (optional) = Should the animation auto play (Default = false)

**loop**:Boolean (optional) = Should the animation loop (Default = false)

**totalFrames**:Int (optional) = Total number of frames. This is only required if the spritesheet is not a complete grid. If it is a complete grid, the script will determine the number of frames automatically.

**sequences**:Object (optional) = These are the animation sequences that you will need to reference. In the example, the sequences are: 

	jump:   {start: 0,  stop: 33},
	blink:  {start: 34, stop: 42},
	idle:   {start: 42, stop: 55},
	look:   {start: 55, stop: 75},
	scared: {start: 76, stop: 85}

**events**:Object (optional) = The callbacks that you want to specify. Currently supported callbacks are:

	onStart: The start of the full animation
	onComplete: The end of the full animation
	onAnimationStart: The beginning of a sequence
	onAnimationComplete: The end of a sequence
	onStep: Called every frame.

**View the source of the demo for any additional clarification**



Testing
---

I cannot test on every platform but everything that I have tested on has worked. That includes:

- Chrome (current)
- Safari (current)
- Firefox (current)
- IE 8+
- iOS 6+
- Android 2.3+

Examples 
---
*( if you use it, send me a link and I can add your project )*

[Vitamin T UX infographic](http://vitamintalent.com/ux-statistic/)


Known issues
---
Mobile can only render images that are below certain megapixel values, otherwise it will scale the image and produce undesired results. [Explanation](http://stackoverflow.com/a/3891655)

If it looks like your animation is sliding while it is animating, that means that the frames are not evenly spaced out.

If the end of your animation blinks or is missing it means that you do not have a full grid and you are not specifying totalFrames.

Advice
---

I use [ImageOptim](https://imageoptim.com/) to fully optimize my spritesheets. It does an awesome job of lowering file size without effecting quality.




