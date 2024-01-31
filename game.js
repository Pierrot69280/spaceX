import kaboom from "kaboom";
const k = kaboom()

kaboom({
    global: true,
    fullscreen:true,
    scale: 2,
    clearColor: [0, 0, 0, 1],
})

// ########################### SPRITE ################################

loadRoot('https://i.imgur.com/')
loadSprite('mario','wunHyEq.png')
loadSprite('block','M6rwarW.png')
loadSprite('gun', '12IgStq.png')
loadSprite('enemy','KPO3fR9.png')

//image de fond :
loadSprite('bg', 'WtSop5r.png')

// NATAN

loadSprite('astro', 'Q0FRlty.png')
loadSprite('battery', 'bOX5EXQ.png')
loadSprite('beam', 'fUwX4Jc.png')
loadSprite('beamsocket', '8cT5Yhy.png')
loadSprite('button', 'ThnSicB.png')
loadSprite('crate', 'Uz51WxL.png')
loadSprite('crate2', 'UPq5A74.png')
loadSprite('droplets', 'r13H16o.png')
loadSprite('dust', 'P0CwElc.png')
loadSprite('editorblock', '8cM0Be2.png')
loadSprite('explosion', 'NTmk76G.png')
loadSprite('explosion2', 'lOrfZSj.png')
loadSprite('jet', 'vaegfFS.png')
loadSprite('jet2', 'qtajq2q.png')
loadSprite('jet3', 'jtSXoc2.png')
loadSprite('messagebox', 'gUvvVXW.png')
loadSprite('pit', 'DFAfOnt.png')
loadSprite('pod', 'fnH45mO.png')
loadSprite('pod1', 'ylskanF.png')
loadSprite('portrait', 'gXUjnJr.png')
loadSprite('powerlight', 'uq3DEGN.png')
loadSprite('rocks', 'QzTqlac.png')
loadSprite('shipbits', 'oD1VIw6.png')
loadSprite('smoke', 'sjIQbV0.png')
loadSprite('socket', 'RhSljhH.png')
loadSprite('thinfont', 'eSsbWN1.png')
loadSprite('tiles', 'd87auk2.png')
loadSprite('timerswitch', 'UGMGRMu.png')






// ########################### SCENE GAME ################################


scene("game", () => {
    layers(["bg", "obj", "ui"], "obj")

    const imgLevelUn = add([
        sprite('bg'),
        scale(width() / 1920, height() /1080),
    ])

    // ------------------- MAP / CONFIG  ------------------

    const map = [
        '                                               ',
        '                                               ',
        '                                              ',
        '                                             ',
        '                                               ',
        '                                               ',
        '                                               ',
        '        /                                      ',
        '        ==                                       ',
        '                                               ',
        '             &                  g          &    ',
        '====================  = =  ===========================',

    ]

    const levelCfg = {
        width: 20,
        height: 20,
        "=": [sprite('block'), solid()],
        "/": [sprite('gun'), solid(), scale(0.02),'gun'],
        "&": [sprite('enemy'), solid(),body(), scale(1),'enemy', "dangerous"],



        // NATAN

        'a': [sprite('astro'), solid()],
        'b': [sprite('battery'), solid()],
        'c': [sprite('beam'), solid()],
        'd': [sprite('beamsocket'), solid()],
        'e': [sprite('button'), solid()],
        'f': [sprite('crate'), solid()],
        'g': [sprite('crate2'), solid(), scale(2)],
        'h': [sprite('droplets'), solid()],
        'i': [sprite('dust'), solid()],
        'j': [sprite('editorblock'), solid()],
        'k': [sprite('explosion'), ],
        'l': [sprite('explosion2'), ],
        'm': [sprite('jet'), solid()],
        'n': [sprite('jet2'), solid()],
        'o': [sprite('jet3'), solid()],
        'p': [sprite('messagebox'), ],
        'q': [sprite('pit'), solid()],
        'r': [sprite('pod'), solid(), scale(1.3), body(), "dangerous"],
        's': [sprite('pod1'), solid(), body()],
        't': [sprite('portrait'), ],
        'u': [sprite('powerlight'), solid()],
        'v': [sprite('rocks'), solid()],
        'w': [sprite('shipbits'), solid()],
        'x': [sprite('smoke'), ],
        'y': [sprite('socket'), solid()],
        'z': [sprite('thinfont'), ],
        ':': [sprite('tiles'), solid()],
        '%': [sprite('timerswitch'), solid()],


    }

    const ENEMY_SPEED = 20

    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0)
    })

    const gameLevel = addLevel(map, levelCfg)

// ----------------------- PLAYER ----------------------------

    const MOVE_SPEED = 150
    let CURRENT_JUMP_FORCE = 330

    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ])

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })


    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

    // ------------------------- BULLET --------------------------

    const BULLET_SPEED = 200

    function spawnBullet(p){
        add([
            rect(10,3),
            pos(p),
            origin('center'),
            color(0.5,0.5,1),
            'bullet'
        ])
    }

    let canShoot = false;

    player.collides('gun', (m) =>{
        destroy(m);
        canShoot = true;
    });

    keyPress('up', ()=>{
        if (canShoot) {
            spawnBullet(player.pos.add(0,-12));
        }
    });

    action('bullet', (b)=>{
        b.move(BULLET_SPEED,0)
    })

    // ----------------------- GUN -------------------------------


    player.collides('gun', (m) =>{
        destroy(m)
    })

    player.collides('crate2', (c) =>{
        destroy(c)
    })

    player.action(() => {

        if (player.pos.y >= height()) {
            go('lose');
        }
    });

    player.collides('dangerous', () => {
        go('lose');
    });

    // ---------------------- ENEMY -------------------------------

    collides('bullet','enemy',(b,e)=>{
        camShake(2)
        destroy(b)
        destroy(e)
        scoreLabel.value++
        // score.text = score.value

        scoreLabel.value += 99;
        scoreLabel.text = scoreLabel.value.toString();
    })



    // ---------------- SCORE ---------------------

    const scoreLabel = add([
        text('0'),
        pos(950, 50),
        scale(2),
        layer('ui'),
        {
            value:0,
        }
    ])

    // -------------------- TIMER --------------------

    const TIME_RESET= 0

    const timer = add([
        text('O'),
        pos(90,50),
        scale(2),
        layer('ui'),
        {
            time: TIME_RESET,
        },
    ])

    timer.action(()=>{
        timer.time += dt()
        timer.text = timer.time.toFixed(2)

        //timer inversé

        // if (timer.time <= 0){
        //     go('lose')
        // }
    })

})

// ########################### SCENE LOSE ################################

scene('lose',()=>{

    add([
        text('you lose'),
        origin('center'),
        scale(10),
        pos(width()/2, height()/2)
    ])
})
start('game')
