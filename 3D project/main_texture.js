
function init(geometry_choice, material_type) {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var loader = new THREE.TextureLoader();


    // INITIALIZE OBJECTS
    //plane
    var planeMaterial = getMaterial('phong', 'rgb(128,128,128)');
	var plane = getPlane(planeMaterial, 300);
    plane.rotation.x = Math.PI / 2;
	plane.name = 'plane-1';
	

    //light
    var leftLight = getSpotLight(3, 'rgb(255,220,180)');
    var rightLight = getSpotLight(3, 'rgb(255,220,180)');

    leftLight.position.x = -5;
    leftLight.position.y = 2;
    leftLight.position.z = -4;

    rightLight.position.x = 5;
    rightLight.position.y = 2;
    rightLight.position.z = -4;


    //load the cube map
    var path = './asset/cubemap/';
    var format = '.jpg'
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    //scene.background = reflectionCube;

    //manipulate materials
    var loader = new THREE.TextureLoader();
    planeMaterial.map = loader.load('./asset/texture/stone wall.jpg');
    planeMaterial.bumpMap = loader.load('./asset/texture/stone wall.jpg');
    planeMaterial.roughnessMap = loader.load('./asset/texture/stone wall.jpg');
    planeMaterial.bumpScale = 0.15;
    planeMaterial.metalness = 0.1;
    planeMaterial.roughness = 1.2;
    planeMaterial.envMap = reflectionCube;


    var object;
    
    switch (geometry_choice) {
        case ('box'):
            var boxMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var box = getBox(boxMaterial, material_type, 1.25, 1.25, 1.25);
            box.position.y += box.geometry.parameters.height / 2;

            object = box;
            break;

        case ('sphere'):
            var sphereMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var sphere = getSphere(sphereMaterial, material_type, 1.5, 36);
            sphere.position.y = sphere.geometry.parameters.radius + 0.5;

            sphereMaterial.envMap = reflectionCube;

            object = sphere;
            break;

        case ('cone'):
            var coneMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var cone = getCylinder(coneMaterial, material_type, 0, 1, 3, 36);
            cone.position.y += cone.geometry.parameters.height / 2;

            coneMaterial.envMap = reflectionCube;

            object = cone;
            break;

        case ('cylinder'):
            var cylinderMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var cylinder = getCylinder(cylinderMaterial, material_type, 1, 1, 2, 36);
            cylinder.position.y += cylinder.geometry.parameters.height / 2;

            cylinderMaterial.envMap = reflectionCube;

            object = cylinder;
            break;

        case ('wheel'):
            var wheelMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var wheel = getWheel(wheelMaterial, material_type, 1, 1.25, 36);
            wheel.position.y += wheel.geometry.parameters.outerRadius;

            object = wheel;
            break;

        case ('teapot'):
            var teapotMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var teapot = getTeapot(teapotMaterial, material_type, 0.5, 36);
            teapot.position.y += 1;

            object = teapot;
            break;

        case ('roundbox'):
            var roundboxMaterial = getMaterial(material_type, 'rgb(139,69,19)');
            var roundbox = getRoundbox(roundboxMaterial, material_type, 1.25, 1.25, 1.25, 2, 0.1);
            roundbox.position.y += roundbox.geometry.parameters.height / 2 + 0.25;

            object = roundbox;
            break;

        case ('earth'):
            var earthMaterial = getMaterial(material_type, 'rgb(255,255,255)');
            var earth = getSphere(earthMaterial, material_type, 1.5, 36);
            earth.position.y = earth.geometry.parameters.radius + 0.5;

            earthMaterial.map = loader.load('./asset/texture/world2.jpg');
            earthMaterial.bumpMap = loader.load('./asset/texture/earthbump2k.jpg');
            earthMaterial.bumpScale = 0.08;
            earthMaterial.shininess = 5;

            object = earth;
            break;

        case ('room'):
            var room = new THREE.GLTFLoader();
            room.load('./other geometries/untitled.gltf', (gltf) => {
                roomMesh = gltf.scene;
                scene.add(roomMesh);
                roomMesh.position.y += 0.5;
            });
            break;
    }



    var maps = ['map', 'bumpMap', 'roughnessMap'];
    maps.forEach(function (mapName) {
        var texture = planeMaterial[mapName];
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(15, 15);
    });
    

    //dat.gui
    var folder1 = gui.addFolder('light_1');
    folder1.add(leftLight, 'intensity', 0, 10);
    folder1.add(leftLight.position, 'x', -5, 15);
    folder1.add(leftLight.position, 'y', -5, 15);
    folder1.add(leftLight.position, 'z', -5, 15);

    var folder2 = gui.addFolder('light_2');
    folder2.add(rightLight, 'intensity', 0, 10);
    folder2.add(rightLight.position, 'x', -5, 15);
    folder2.add(rightLight.position, 'y', -5, 15);
    folder2.add(rightLight.position, 'z', -5, 15);

    var folder3 = gui.addFolder('materials');
    //folder3.add(sphereMaterial, 'shininess', 0, 1000);
    folder3.add(planeMaterial, 'shininess', 0, 1000);
	folder3.open();

	

    //add objects to scene

	if (geometry_choice != 'room') {
		object.name = 'object-1';
		scene.add(object);
    }


	scene.add(plane);
    scene.add(leftLight);
    scene.add(rightLight);


    var perspectiveCamera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );


    var orthographicCamera = new THREE.OrthographicCamera(
        -15,
        15,
        15,
        -15,
        1,
        1000
    );

    var camera = perspectiveCamera

    camera.position.x = 3.5;
    camera.position.y = 5;
    camera.position.z = 7;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120, 120, 120)');
    document.getElementById('webgl').appendChild(renderer.domElement);


	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	update(renderer, scene, camera, controls, geometry_choice);
    return scene;
}



//=============================================  FUNCTION FOR PROJECT  =============================================

function getObj(geometry, material, material_type) {
	var obj;
	if (material_type == "point") {
		obj = new THREE.Points(geometry, material);
	}
	else {
		obj = new THREE.Mesh(geometry, material);
	}

	return obj;
}


// CREATE BOX
function getBox(material, material_type, width, height, depth) {
	var geometry = new THREE.BoxGeometry(width, height, depth);
    var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


// CREATE BOXES MATRIX
function getBoxGrid(amount, separationMultiplier) {
    separationMultiplier = 1 + separationMultiplier;
    var group = new THREE.Group();
    for (var i = 0; i < amount; i++) {
        var obj = getBox(1, 1, 1);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 1; j < amount; j++) {
            var obj = getBox(1, 1, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.z = j * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            group.add(obj);
        }
    }
    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;
    return group;
}


// CREATE SPHERE
function getSphere(material, material_type, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
	var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


// CREATE CONE
function getCone(material, material_type, radius, height, segments) {
    var geometry = new THREE.ConeGeometry(radius, height, segments, segments);
	var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


// CREATE CYLINDER
function getCylinder(material, material_type, radiusTop, radiusBottom, height, segments) {
    var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments, segments);
	var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


// CREATE TORUS (CLOSED CURVED WHEEL)
function getTorus(material, material_type, radius, tubeRadius, segments) {
    var geometry = new THREE.TorusGeometry(radius, tubeRadius, segments, segments);
	var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


// CREATE WHEEL
function getWheel(material, material_type, innerRadius, outerRadius, segments) {
    var geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, segments);
	var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


// CREATE TEAPOT
function getTeapot(material, material_type, size, segments) {
    var geometry = new TeapotGeometry(size, segments);
	var obj = getObj(geometry, material, material_type);
    obj.castShadow = true;

    return obj;
}


//CREATE ROUNDED BOX
function getRoundbox(material, material_type, width, height, depth, segments, radius) {
	var geometry = new RoundedBoxGeometry(width, height, depth, segments, radius);
	var obj = getObj(geometry, material, material_type);
	obj.castShadow = true;

	return obj;
}


// CREATE PLANE
function getPlane(material, size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    var obj = new THREE.Mesh(geometry, material);  
    obj.receiveShadow = true;

    return obj;
}


//CREATE MATERIAL
function getMaterial(type, color) {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 'rgb(255,255,255)' : color,
        side: THREE.DoubleSide
    };

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
        case 'line':
            selectedMaterial = new THREE.MeshBasicMaterial({
                color: 'rgb(153, 255, 255)',
                linewidth: 1,
                transparent: false,
                wireframe: true,
            });
            break;
        case 'point':
            selectedMaterial = new THREE.ParticleBasicMaterial({ transparent: true, size: 0.035 });
            break;
    }

    return selectedMaterial;
}


// CREATE LIGHT SOURCE
function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function getSpotLight(intensity, color) {
    color = color === undefined ? 'rgb(255,255,255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.bias = 0.001;
    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;
    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight(0x555555, intensity);
    light.castShadow = true;
    return light;
}


// CONTROL ANIMATION
function update(renderer, scene, camera, controls, geometry_choice) {
    renderer.render(
        scene,
        camera
    );
    controls.update();

    /*
    var boxGrid = scene.getObjectByName('boxGrid');

    var timeElapsed = clock.getElapsedTime();
    boxGrid.children.forEach(function (child, index) {
        var x = timeElapsed * 5 + index;
        child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001;
        //child.position.y = child.scale.y / 2;
    });
    */

	if (geometry_choice != 'room') {
		var plane = scene.getObjectByName('plane-1');
		var object = scene.getObjectByName('object-1');

		var value = 0.003;
		plane.rotation.z += value;
		object.rotation.y -= value;
    }
	

	requestAnimationFrame(function () {
		update(renderer, scene, camera, controls, geometry_choice);
    });
    
}


//var scene = init(Math.PI / 2);




