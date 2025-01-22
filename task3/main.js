document.addEventListener('DOMContentLoaded', start_script);


function start_script(){

    const brush_icon = document.querySelector("#brush");
    const eraser_icon = document.querySelector("#eraser");
    const eraser = document.querySelector('.eraser')
    const line_color_container = document.querySelector('.line-color-container');
    const color = document.querySelector("#color-picker");
    const canvas_bg_color = document.querySelector("#bg-color")

    
    const width_text = document.querySelector(".width-text")
    const width_val = document.querySelector(".width-val");

    
    const inc_btn = document.querySelector("button.inc-width");
    const dec_btn = document.querySelector("button.dec-width");


    const clear_btn = document.querySelector(".clear");
    const download_btn = document.querySelector("#download");


    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    
    let prevX = null;
    let prevY = null;
    let current_X = 0;
    let current_Y = 0;
    let mouse_coords = null;
    let is_drawing = false;
    let choice = "Brush";
    const BG_COLOR = "#ffffff";
    const PEN_COLOR = "#000000";

    setChoice()


    if (choice === "Brush"){
        ctx.lineWidth = 2;
        width_val.textContent = `${ctx.lineWidth}`;
    }

    else{
        ctx.lineWidth = 20;
        width_val.textContent = `${eraser.offsetWidth}`;
    }
    color.value = PEN_COLOR;
    canvas_bg_color.value = BG_COLOR;

    console.log(color.value);
    console.log(canvas_bg_color.value);

    
    ctx.strokeStyle = PEN_COLOR;
    
    canvas.style.backgroundColor = BG_COLOR;

    
    function setChoice(){
        width_text.textContent = `${choice} Size :`;
        if (choice === "Eraser"){
            eraser.style.display = "block";
            width_val.textContent = eraser.offsetWidth;
        } else{
            eraser.style.display = "none";
            width_val.textContent = ctx.lineWidth;
        }
    }

    function getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width;
        scaleY = canvas.height / rect.height;
    
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }

    
    function getEraserDimensions(){
        let width = eraser.offsetWidth;
        let height = eraser.offsetHeight;
        return {w: width, h: height};
    }


    
    function setAndDisplayEraserDimensions(action){
        eraser_dims = getEraserDimensions();

        if (action === "+"){
            eraser_dims.w += 1;
            eraser_dims.h += 1;
        }
        else if (action === "-"){
            eraser_dims.w -= 1;
            eraser_dims.h -= 1;
            if(eraser_dims.w <= 0){ eraser_dims.w = 1}
            if(eraser_dims.h <= 0){ eraser_dims.h = 1}
        }


        ctx.lineWidth = eraser_dims.w;
        

        eraser.style.width = `${eraser_dims.w}px`;
        eraser.style.height = `${eraser_dims.h}px`;
        width_val.textContent = `${eraser_dims.w}`;
    }
    

    
    function drawLine(e){
        mouse_coords = getMousePos(canvas, e)

        
        if(prevX == null || prevY == null || !is_drawing){
            prevX = mouse_coords.x;
            prevY = mouse_coords.y;
            return;
        }
        
        
        current_X = mouse_coords.x;
        current_Y = mouse_coords.y;

        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(current_X, current_Y);
        ctx.stroke();

        prevX = current_X;
        prevY = current_Y;
    }

    
    brush_icon.addEventListener('click', ()=>{
        eraser_icon.classList.remove("active");
        brush_icon.classList.add("active");
        choice = "Brush";
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        color.value = '#000000'
        line_color_container.style.display = "block";
        line_color_container.style.display = "flex";
        setChoice()
    });

    
    eraser_icon.addEventListener('click', ()=>{
        brush_icon.classList.remove('active');
        eraser_icon.classList.add("active");
        choice = "Eraser";
        color.value = canvas_bg_color.value;
        ctx.strokeStyle = `${canvas_bg_color.value}`;
        line_color_container.style.display = "none";
        setChoice()
    })

    
    inc_btn.addEventListener('click', ()=>{
        if (choice === "Brush"){
            ctx.lineWidth++;
            width_val.textContent = `${ctx.lineWidth}`;
        }
        else{
            setAndDisplayEraserDimensions("+")
        }
    })

    dec_btn.addEventListener('click', ()=>{
        if (choice === "Brush"){
            ctx.lineWidth--;
            if (ctx.lineWidth <=0){ctx.lineWidth = 1}
            width_val.textContent = `${ctx.lineWidth}`;
        }
        else{
            setAndDisplayEraserDimensions("-")
        }
    })

    
    color.addEventListener('change', (e)=>{
        if (choice === "Brush"){
            ctx.strokeStyle = `${color.value}`;
        }
    })


    canvas_bg_color.addEventListener('change', ()=>{
        canvas.style.backgroundColor=`${canvas_bg_color.value}`;
    })

    
    canvas.addEventListener("mousedown", (e) => {
        is_drawing = true;
    });

    canvas.addEventListener("mouseup", (e) => {
        is_drawing = false
    });



    canvas.addEventListener("mousemove", drawLine);


    

    clear_btn.addEventListener("click", () => {
        ctx.fillStyle = canvas_bg_color.value;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    download_btn.addEventListener("click", () => {
        let data = canvas.toDataURL("image/png")
        let a = document.createElement("a")
        a.href = data
        a.download = "drawing.png"
        a.click()
    })
}