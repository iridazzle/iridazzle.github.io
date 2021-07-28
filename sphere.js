//adapted from https://codepen.io/soju22/pen/YgWqoZ
let scene = new THREE.Scene();
scene.add(new THREE.AmbientLight("#FFFFFF"));
scene.add(new THREE.HemisphereLight("#FFFFFF", "#000000", 1));
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geo = {
   n: 7, //number of objects => n^3
   r: 3, //max raduis
   m: 4 //margins
};

let dias = [], maxLength = (new THREE.Vector3(1, 1, 1)).multiplyScalar(geo.n * (geo.r + geo.m) / 2).length();

for (i = 0; i < geo.n; i++) {
   for (j = 0; j < geo.n; j++) {
      for (k = 0; k < geo.n; k++) {
            dia = makeDia(i, j, k);
            dias.push(dia);
      };
   };
};

animate();

window.addEventListener("resize", onWindowResize, false);

function makeDia(x, y, z) {
   let r = getR(geo.r);
   let geometry = new THREE.SphereGeometry(r, 30, 30);
   let color = randomColor();
   let material = new THREE.MeshLambertMaterial({color, transparent: true, opacity: 0.8});
   let dia = new THREE.Mesh(geometry, material);
   let pos = new THREE.Vector3((-geo.n / 2 + x) * (r + geo.m), (-geo.n / 2 + y) * (r + geo.m), (-geo.n / 2 + z) * (r + geo.m));

   dia.destination = pos;
   dia.vcoef =  0.05 - pos.length() * ((0.05 - 0.005) / maxLength);

   scene.add(dia);

   return dia;
};

function getR(maxR) {
   return Math.random() * maxR;
};

function randomColor() {
   var letters = "0123456789ABCDEF";
   var color = "#";
   for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
   };
   return color;
};


function animate() {
   requestAnimationFrame(animate);

   const time = Date.now() * 0.001;
   const l = maxLength * 0.7;
   let origin = new THREE.Vector3();
   origin.x = Math.sin(time * 0.9) * l;
   origin.y = Math.cos(time * 1.2) * l;
   origin.z = Math.cos(time * 0.7) * l;

   dias.forEach((dia) => {
      let dv = dia.destination.clone().add(origin).sub(dia.position);
      let d = dv.length();
      dv.normalize().multiplyScalar(d * dia.vcoef);
      dia.position.add(dv);
   });

   renderer.render(scene, camera);
};

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
};
