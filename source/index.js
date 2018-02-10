//

"use strict"

const PI = Math.PI

const UP = new THREE.Vector3( 0, 1, 0 )
const FORWARD = new THREE.Vector3( 1, 0, 0 )
const RIGHT = new THREE.Vector3( 0, 0, 1 )

const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight
const FOV = 75
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
const NEAR = 0.1, FAR = 100000

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )
document.body.appendChild( renderer.domElement )

const stats = new Stats()
stats.showPanel( 0 )
document.body.appendChild( stats.dom )

var loader = new THREE.CubeTextureLoader()
loader.setPath( '../../assets/cube_textures/space-cube/' )

var textureCube = loader.load( [
	"l.png", "r.png", // 'px.png', 'nx.png',
	"t.png", "b.png", // 'py.png', 'ny.png',
	"rr.png", "c.png", // 'pz.png', 'nz.png',
] )

var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } )
scene.background = textureCube

var keyboardState = {}

document.addEventListener( "keydown", function ( e ) {
	keyboardState[e.key] = true
} )

document.addEventListener( "keyup", function ( e ) {
	keyboardState[e.key] = false
} )

var bindings = [
	{
		key: "w",
		action: "up",
	},
	{
		key: "s",
		action: "down",
	},
]

var objects = []

setInterval( function () {
	for ( let object of objects ) {
		object.update()
		object.updateControls()
	}
}, 10 )

var camera = new THREE.PerspectiveCamera( FOV, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR )
camera.position.x = 0 // -50
camera.position.y = -10
camera.position.z = 30
camera.up.set( 0, 0, 1 )
	// // camera.position.fromArray( view.eye )
	// // camera.up.fromArray( view.up )
	// view.camera = camera

const controls = new THREE.OrbitControls( camera )

var bounds = {
	left: -20,
	right: 20,
	top: 10,
	bottom: -10,
}

var paddle = new Paddle( {

} )

function Paddle( args ) {
	this.size = new THREE.Vector3( 1, 4, 1 )
	this.mesh = new THREE.Mesh(
		new THREE.BoxGeometry( this.size.x, this.size.y, this.size.z ),
		new THREE.MeshLambertMaterial( {
			color: utils.randomColor(),
			// wireframe: true
		} ),
	)
	this.mesh.position.x = bounds.left + 5
	this.mesh.position.y = 0.5
	scene.add( this.mesh )
	this.position = this.mesh.position
}

const entities = []

var ball = new Ball()
entities.push( ball )

function Ball() {
	this.mesh = new THREE.Mesh(
		new THREE.SphereGeometry( 0.5, 32, 32 ),
		new THREE.MeshLambertMaterial( {
			color: utils.randomColor(),
			// wireframe: true
		} ),
	)
	this.position = this.mesh.position
	// this.mesh.position = this.position
	this.velocity = new THREE.Vector3( 0, 0, 0 )
	this.velocity.x = [ -1, 1 ].choose() * 0.1
	this.velocity.y = [ -1, 1 ].choose() * 0.1
	// this.velocity.x = utils.random( -0.1, 0.1 )
	// this.velocity.z = utils.random( -0.1, 0.1 )
	scene.add( this.mesh )
}

Ball.prototype.updatePhysics = function () {
	var r = 0.5 // this.mesh.geometry.radius
	// console.log( this.mesh.geometry )
	// this.mesh.geometry.radius = 100
	// this.velocity.multiplyScalar( 1.01 )
	// if ( this.position.x < paddle1 ) {
  //
	// } else if ( this.position.x > paddle1 ) {
  //
	// } else if ( 0 ) {
  //
	// }

	if ( this.position.x - r < paddle.position.x + paddle.size.x/2
		&& this.position.y < paddle.position.y + paddle.size.y/2
		&& this.position.y > paddle.position.y - paddle.size.y/2 ) {
		this.velocity.x = -this.velocity.x
	}

	// if ( this.position.x + r > paddle.position.x - paddle.size.x/2
	// 	&& this.position.y < paddle.position.y + paddle.size.y/2
	// 	&& this.position.y > paddle.position.y - paddle.size.y/2 ) {
	// 	this.velocity.x = -this.velocity.x
	// }

	if ( this.position.x + r > bounds.right ) {
		// console.log( "bounce" )
		this.velocity.x = -this.velocity.x
	} else if ( this.position.x - r < bounds.left ) {
		// console.log( "bounce" )
		this.velocity.x = -this.velocity.x
	} else if ( this.position.y + r > bounds.top ) {
		// console.log( "bounce" )
		this.velocity.y = -this.velocity.y
	} else if ( this.position.y - r < bounds.bottom ) {
		// console.log( "bounce" )
		this.velocity.y = -this.velocity.y
	}

	this.mesh.position.add( this.velocity )
	// this.mesh.position.clone( this.position )
}

var leftBarrier = new THREE.Mesh(
	new THREE.BoxGeometry( 1, bounds.top - bounds.bottom, 1 ),
	new THREE.MeshLambertMaterial( {
		color: utils.randomColor(),
		// wireframe: true
	} ),
)
scene.add( leftBarrier )
leftBarrier.position.x = bounds.left
leftBarrier.position.z = 0.5

var rightBarrier = new THREE.Mesh(
	new THREE.BoxGeometry( 1, bounds.top - bounds.bottom, 1 ),
	new THREE.MeshLambertMaterial( {
		color: utils.randomColor(),
		// wireframe: true
	} ),
)
scene.add( rightBarrier )
rightBarrier.position.x = bounds.right
rightBarrier.position.z = 0.5

var topBarrier = new THREE.Mesh(
	new THREE.BoxGeometry( bounds.right - bounds.left, 1, 1 ),
	new THREE.MeshLambertMaterial( {
		color: utils.randomColor(),
		// wireframe: true
	} ),
)
scene.add( topBarrier )
topBarrier.position.y = bounds.top
topBarrier.position.z = 0.5

var bottomBarrier = new THREE.Mesh(
	new THREE.BoxGeometry( bounds.right - bounds.left, 1, 1 ),
	new THREE.MeshLambertMaterial( {
		color: utils.randomColor(),
		// wireframe: true
	} ),
)
scene.add( bottomBarrier )
bottomBarrier.position.y = bounds.bottom
bottomBarrier.position.z = 0.5

var ambientLight = new THREE.AmbientLight( 0x404040 )
scene.add( ambientLight )

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 )
scene.add( directionalLight )
directionalLight.position.set( 100, 100, 100 )

var grassTexture = new THREE.TextureLoader().load( '../../assets/textures/grass.jpg' );
grassTexture.repeat.set( 100, 100 )
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping

var ground = new THREE.Mesh(
	new THREE.PlaneGeometry( 100, 100, 10, 10 ),
	new THREE.MeshLambertMaterial( {
		// color: 0x00ff00,
		// opacity: 0.1,
		// transparent: false,
		// wireframe: true,
		map: grassTexture,
		side: THREE.DoubleSide,
	} ),
)
scene.add( ground )
ground.position.z = -0.1
// ground.rotation.x = Math.PI/2

// var axisHelper = new THREE.AxisHelper( 5 )
// scene.add( axisHelper )
// axisHelper.position.z = 5

var colorCenterLine = new THREE.Color( "rgba(255, 0, 255, 0.1)" )
var colorGrid = new THREE.Color( "rgba(0, 255, 255, 0.1)" )

// var gridHelper = new THREE.GridHelper( 100, 100, colorCenterLine, colorGrid )
// scene.add( gridHelper )
// gridHelper.rotation.x = Math.PI*0.5

// physics loop
setInterval( updatePhysics, 10 )
function updatePhysics() {
	for ( let entity of entities ) {
		entity.updatePhysics()
	}
}

// controls loop
setInterval( updateControls, 10 )
function updateControls() {
	for ( let binding of bindings ) {
		if ( keyboardState[ binding.key ] ) {
			console.log( binding )
			switch ( binding.action ) {
				case "up":
					paddle.position.y += 0.1
					break
				case "down":
					paddle.position.y -= 0.1
					break
			}
			// control.action
		}
	}
}

function render() {
	stats.begin()
	// const SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight

	// renderer.setViewport( left, top, width, height );
	// renderer.setClearColor( view.background );
	// renderer.setClearColor( new THREE.Color( "#000" ) )

	// camera.aspect = width / height
	// camera.updateProjectionMatrix()

	renderer.render( scene, camera )
	stats.end()
	// controls.update()
	requestAnimationFrame( render )
}
requestAnimationFrame( render )

function onWindowResize() {
	renderer.setSize( window.innerWidth, window.innerHeight )
}
window.addEventListener( 'resize', onWindowResize, false )
