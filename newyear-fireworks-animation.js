let chars, particles, canvas, ctx, w, h, current;
let duration = 5000;
let str = ['Hola', 'Mi', 'Amor', 'Me', 'Encantas'];

init();
resize();
requestAnimationFrame(render);
addEventListener('resize', resize);

function makeChar(c){
    let tmp = document.createElement('canvas');
    let size = tmp.width = tmp.height = w<400?200:300;
    let tmpCtx = tmp.getContext('2d');
    tmpCtx.font = 'bold '+size+'px Arial';
    tmpCtx.fillStyle = 'white';
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size/2, size/2);
    let char2 = tmpCtx.getImageData(0,0,size,size);
    let char2particles = [];
    for(var i=0; char2particles.length< particles; i++){
        let x = size*Math.random();
        let y = size*Math.random();
        let offset = parseInt(y)*size*4 + parseInt(x)*4;
        if(char2.data[offset])
            char2particles.push([x-size/2,y-size/2])
    }
    return char2particles;
}

function init() {
    canvas = document.createElement('canvas');
    document.body.append(canvas);
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden'
    document.body.style.background = 'black'
    ctx = canvas.getContext('2d');
}

function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    particles = innerWidth<400? 55 : 99;
}

function makeChars(t) {
    let actual = parseInt(t / duration) % str.length;
    if (current === actual)
        return
    current = actual;
    chars = [...str[actual]].map(makeChar);
}

function render(t) {
    makeChars(t);
    requestAnimationFrame(render);
    ctx.fillStyle = '#00000010'
    ctx.fillRect(0, 0, w, h);
    chars.forEach((pts,i) => firework(t, i, pts));
}

function firework(t, i, pts) {
    t -= i*200;
    let id = i + chars.length*parseInt(t - t%duration);
    t = t % duration / duration;
    let dx = (i+1)*w/(1+chars.length);
    dx += Math.min(0.33, t)*100*Math.sin(id);
    let dy = h*0.5;
    dy += Math.sin(id*4547.411)*h*0.1;
    if (t < 0.33) {
      rocket(dx, dy, id, t*3);
    } else {
      explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t-0.33)*2));
    }
}

function rocket(x, y, id, t) {
  ctx.fillStyle = 'white';
  let r = 2-2*t + Math.pow(t, 15*t)*16;
  y = h - y*t;
  circle(x, y, r)
}

function explosion(pts, x, y, id, t) {
  let dy = (t*t*t)*20;
  let r = Math.sin(id)*1 + 3  
  r = t<0.5 ? (t+0.5)*t*r:r-t*r
  ctx.fillStyle = `hsl(${id*55}, 55%, 55%)`;
  pts.forEach((xy,i) => {
      if (i%20 === 0)
        ctx.fillStyle = `hsl(${id*55}, 55%, ${55+t*Math.sin(t*55+i)*45}%)`;
      circle(t*xy[0] + x, h - y + t*xy[1] + dy, r)
  });
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, 6.283);
  ctx.fill();
}