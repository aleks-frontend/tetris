const canvas = document.querySelector('#tetris');
const context = canvas.getContext('2d');

const scaleVal = 20;

context.scale(scaleVal, scaleVal);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

function colide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for ( let y = 0; y < m.length; ++y ) {
        for ( let x = 0; x < m[y].length; ++x ) {
            if ( m[y][x] !== 0 &&
                 ( arena[y + o.y] && arena[y + o.y][x + o.x] ) !== 0 ) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while ( h-- ) { // loop and increment h with each loop, when it gets to zero, it will return false
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x:0, y:0}, '#bada55');
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset, color = '#f00') {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if ( value !== 0 ) {
                context.fillStyle = color;
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if ( value !== 0 ) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

function playerDrop() {
    player.pos.y++;

    if ( colide(arena, player) ) {
        player.pos.y--;
        merge(arena, player);
        player.pos.y = 0;
    }

    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if ( colide(arena, player) ) player.pos.x -= dir;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if ( dropCounter > dropInterval ) playerDrop();

    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(canvas.width / scaleVal, canvas.height / scaleVal);

const player = {
    pos: {x: 5, y: 0},
    matrix: matrix
};

document.addEventListener('keydown', event => {
    if ( event.keyCode == 37 ) playerMove(-1); // left key
    if ( event.keyCode == 39 ) playerMove(1); // right key
    if ( event.keyCode == 40 ) playerDrop(); // down key
});

update();
