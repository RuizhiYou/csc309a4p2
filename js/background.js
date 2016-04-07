
        var max_width = window.innerWidth, max_hight = window.innerHeight, NumOfPoints = 25;//initial the max width, hight and num of points in main page
        
        var canvas = document.getElementById('canvas');//get the object
        canvas.width = max_width,//set the max width
        canvas.height = max_hight;//set the max hight
        var context = canvas.getContext('2d');
        context.strokeStyle = 'rgba(0,0,0,0.5)',//initial the stroke style
        context.strokeWidth = 1,//set the stroke's width
        context.fillStyle = 'rgba(0,0,0,0.2)';//fill the color into the point
        var circleList = [];
        window.addEventListener('resize', function(event){
            max_width = window.innerWidth;
            max_hight = window.innerHeight;
            canvas.width = max_width,//set the max width
            canvas.height = max_hight;//set the max hight
            resize();
        
        });
        function Line (x, y, _x, _y, o) {
            this.origin_X = x,//initial x of the line
            this.origin_Y = y,//initial y of the line
            this.end_X = _x,//where x end of the line
            this.end_Y = _y,//where y end of the line
            this.o = o;//transparency of the line
        }

        function Circle(x, y, r, currX, currY){//initialize the origin of circle here
            this.x = x,//initialize the x
            this.y = y,//initialize the y
            this.r = r,//initialize the radius
            this.currX = currX,//new x where it moves to
            this.currY = currY;//new y where it moves to
        }

        function random_Num(max, _min) {//generates a random number within the max and min
            var min = arguments[1] || 0;
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        function drawCricle (cxt, x, y, r, currX, currY) {
            var circle = new Circle(x, y, r, currX, currY)
            cxt.beginPath()
            cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
            cxt.closePath()
            cxt.fill();
            return circle;
        }

        function drawLine (cxt, x, y, _x, _y, o) {//connect the two point 
            var line = new Line(x, y, _x, _y, o)//create the new line here
            cxt.beginPath()
            cxt.strokeStyle = 'rgba(0,0,0,'+ o +')'//make the line to stroke
            cxt.moveTo(line.origin_X, line.origin_Y)//the destination where the line moves to by x
            cxt.lineTo(line.end_X, line.end_Y)//the desination where the line moves to by y
            cxt.closePath()
            cxt.stroke();

        }
        function resize(){
            canvas.width = window.innerWidth,//set the max width
            canvas.height = window.innerHeight;//set the max hight
            context.fillStyle = 'rgba(0,0,0,0.2)';
        }
        function origin() {//creates origin for each new pinte in html, and limit the number of points that will be generated in html
            circleList = [];
            for (var i = 0; i < NumOfPoints; i++) {//counts down the number of the points that have been drawn
                circleList.push(drawCricle(context, random_Num(max_width), random_Num(max_hight), random_Num(15, 2), random_Num(10, -10)/40, random_Num(10, -10)/40));
            }
            draw();
            resize();
        }


        function draw() {//make each small part to move by updating the x and y
            context.clearRect(0,0,canvas.width, canvas.height);//clean the old line here
            for (var i = 0; i < NumOfPoints; i++) {//loop the circle in the circleList
                drawCricle(context, circleList[i].x, circleList[i].y, circleList[i].r);
            }
            for (var i = 0; i < NumOfPoints; i++) {//loop the circle in the circleList
                for (var j = 0; j < NumOfPoints; j++) {
                    if (i + j < NumOfPoints) {
                        var A = Math.abs(circleList[i+j].x - circleList[i].x),
                            B = Math.abs(circleList[i+j].y - circleList[i].y);
                        var lineLength = Math.sqrt(A*A + B*B);//get the area
                        var C = 1/lineLength*7-0.009;
                        var lineOpacity = C > 0.03 ? 0.03 : C;
                        if (lineOpacity > 0) {
                            drawLine(context, circleList[i].x, circleList[i].y, circleList[i+j].x, circleList[i+j].y, lineOpacity);
                        }
                    }
                }
            }
        }


        window.onload = function () {
            origin();
            setInterval(function () {//load the function to start drawing
                for (var i = 0; i < NumOfPoints; i++) {
                    var cir = circleList[i];
                    cir.x += cir.currX;
                    cir.y += cir.currY;
                    if (cir.x > max_width) cir.x = 0;
                    else if (cir.x < 0) cir.x = max_width;
                    if (cir.y > max_hight) cir.y = 0;
                    else if (cir.y < 0) cir.y = max_hight;
                    
                }
                draw();
            }, 16);
        }

