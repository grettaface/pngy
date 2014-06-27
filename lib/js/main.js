var sploosh;

window.onload = function(){
    sploosh = new Pngy({
            node: "#pngy",
            img: "lib/img/sploosh.png",
            autoPlay: true,
            loop: true,
            totalFrames: 85,
            sequences :{
                jump:   {start: 0,  stop: 33},
                blink:  {start: 34, stop: 42},
                idle:   {start: 42, stop: 55},
                look:   {start: 55, stop: 75},
                scared: {start: 76, stop: 85}

            },
            events:{
                onAnimationStart: function(){
                    document.getElementById("sequenceStartCallback").value += ("sequence animation start\n")
                },
                onAnimationComplete: function(){
                    document.getElementById("sequenceCompleteCallback").value += ("sequence animation complete\n")
                },
                onStart: function(){
                    document.getElementById("startCallback").value += ("full animation start\n")
                },
                onComplete: function(){
                    document.getElementById("completeCallback").value += ("full animation complete\n")
                },
                onStep: function(){
                    console.log("step callback");
                    document.getElementById("currentFrame").value = sploosh.getFrameNumber();
                }
            }
        }
    )
}