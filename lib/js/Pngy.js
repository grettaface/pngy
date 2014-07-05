/*

 PNG Sprite class for having animated pngs

 Developed by: Bret Kruse (bret.kruse@gmail.com) bretalankruse.com

 This code does not claim to be perfect, but it does what I need it to do. I plan to continue improving and optimizing as I get time.

 Copyright (c) 2014 Bret Kruse

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

function Pngy(params) {

    /* Get the item from the DOM */
    var node = document.querySelectorAll(params.node)[0];

    var self = this,
        frameRate = 30,
        frameColumn = 0,
        frameRow = 0,

        width,
        height,
        fullWidth,
        fullHeight,
        animationLoop = false,
        horizFrames,
        vertFrames,
        dir = 1,
        fullLooping = false,
        curFrame = 0,
        currentAnimation = null,
        totalFrames = params.totalFrames,
        img = params.img,
        events = params.events,
        sequences = params.sequences,

    // for controlling the FPS
        now,
        then = Date.now(),
        delta;


    var inter;


    function init() {

        width = node.clientWidth;
        height = node.clientHeight;

        node.style.background = "transparent url(" + img + ") no-repeat 0 0";

        var image = new Image();

        image.onload = function () {

            fullWidth = image.width;
            fullHeight = image.height;

            horizFrames = fullWidth / width;
            vertFrames = (fullHeight / height) - 1;

            if (totalFrames == null || totalFrames == undefined) {
                totalFrames = horizFrames * (vertFrames + 1);
            }

            if (params.autoPlay) {
                self.play(dir);
            }

            if (params.loop) {
                fullLooping = true;
            }

        };

        image.src = img;


    }

    this.play = function (val) {

        dir = 1;
        self.pause();

        if (val == undefined) {
            val = dir;
        }

        if (frameColumn >= horizFrames) {
            frameColumn = 0;
        }

        moveFrame(val)

    };

    function moveFrame(val) {

        var interval = 1000 / frameRate;

        inter = requestAnimationFrame(function () {
            moveFrame(dir)
        });

        // determine whether to play based on frame rate
        now = new Date().getTime()
        delta = now - then;

        if (delta > interval) {

            var playing = true;
            frameColumn += dir;
            curFrame = frameColumn + ((frameRow) * horizFrames);

            // im at the end horizontally //
            if (curFrame == totalFrames || frameColumn == horizFrames) {
                // am I at the end vertically? or over the total number of frames specified?
                if (frameRow == vertFrames) {

                    frameRow = 0;

                    if (fullLooping == true) {
                        frameColumn = 0;
                    } else {
                        playing = false;
                        self.pause();
                    }

                    if (events['onComplete'] != undefined) {
                        var occb = events['onComplete'];
                        occb();
                    }

                } else {
                    frameRow++;
                    frameColumn = 0;
                }
            } else if (frameColumn < 0) {
                if (fullLooping == true) {

                    frameColumn = horizFrames - 1;
                    frameRow--;

                    if (frameRow < 0) {
                        self.setFrames(totalFrames - 1);
                    }

                } else {
                    playing = false;
                    self.pause();
                }
            }


            if (currentAnimation != null) {
                // get my start/stop //
                var ca = sequences[currentAnimation];

                if (curFrame == ca["start"] + 1) {
                    if (events['onAnimationStart'] != undefined) {
                        var oascb = events['onAnimationStart'];
                        oascb();
                    }
                }

                if (curFrame < ca['start']) {
                    if (dir == 1) {

                        self.setFrames(ca['start']);

                        if (!animationLoop) {
                            playing = false;
                            self.pause();
                        }
                    } else {
                        self.setFrames(ca['stop']);
                    }
                }

                if (curFrame > ca['stop']) {

                    if (dir == 1) {
                        if (!animationLoop) {
                            playing = false;
                            self.pause();
                        } else {
                            self.setFrames(ca['start']);
                        }
                    } else {
                        if (!animationLoop) {
                            playing = false;
                            self.pause();
                        } else {
                            self.setFrames(ca['stop']);
                        }
                    }

                    if (events['onAnimationComplete'] != undefined) {
                        var oaccb = events['onAnimationComplete'];
                        oaccb();
                    }
                }
            }

            if (events != undefined && events['onStep'] != undefined) {
                var scb = events['onStep'];
                scb();
            }

            if (curFrame == 1 && currentAnimation == null) {
                if (events['onStart'] != undefined) {
                    var oscb = events['onStart'];
                    oscb();
                }
            }

            if (playing) {
                node.style.backgroundPosition = 0 - (frameColumn * width) + "px " + (0 - (frameRow * height)) + "px";
            }

            //make sure to set the time for delay to prevent off time
            then = now - (delta % interval);

        }


    }

    this.pause = function () {
        cancelAnimationFrame(inter);
        inter = null;
    };

    this.reverse = function () {
        if (currentAnimation == null) {
            self.pause();
            dir = -1;
            cancelAnimationFrame(inter)
            inter = requestAnimationFrame(function () {
                moveFrame(dir)
            });
        }
    };

    this.reset = function () {
        curFrame = 0;
        frameRow = 0;
        frameColumn = 0;
        dir = 1;
        currentAnimation = null;
        node.style.backgroundPosition = 0 - (frameColumn * width) + "px 0";
        self.stopPlaying();
    };

    this.stopPlaying = function () {
        cancelAnimationFrame(inter);
        inter = null;
    };

    this.getDir = function () {
        return dir;
    };

    this.setDir = function (val) {
        dir = val;
    };

    this.getNode = function () {
        return node;
    };

    this.setFrames = function (val) {
        frameRow = Math.floor((val / horizFrames));
        frameColumn = val % horizFrames;
    };

    this.getFrames = function () {
        return horizFrames * vertFrames;
    };


    // Jump to specific frame and stop //
    this.gotoAndStop = function (val) {
        self.setFrames(val);
        self.stopPlaying();
        curFrame = val;
        node.style.backgroundPosition = 0 - (frameColumn * width) + "px " + (0 - (frameRow * height)) + "px";
    };

    // Jump to specific frame and play //
    this.gotoAndPlay = function (val) {
        currentAnimation = null;
        animationLoop = false;
        self.setLoop(false);
        self.setFrames(val);
        self.play();
    };


    // Play an animation sequence //
    this.playSequence = function (frame, loop) {
        self.setFrames(sequences[frame].start);
        currentAnimation = frame;
        animationLoop = loop;
        self.play();
    };

    // check if I am playing or not //
    this.isPlaying = function () {
        return inter != null;
    };

    this.getFrameNumber = function () {
        return curFrame;
    };

    this.setLoop = function (val) {
        fullLooping = val;
    };

    this.setFrameRate = function (val) {
        frameRate = val;
        this.pause();
        this.play();
    };

    this.kill = function () {
        cancelAnimationFrame(inter);
        inter = null;
        node.parentNode.removeChild(node);
    };


// RequestAnimationFrame Shim
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    init();

}