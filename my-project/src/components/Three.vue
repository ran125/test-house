<template>
  <!-- <div id="three">
  </div>-->
  <div ref="demo1"></div>
</template>
<script>
// import * as Three from "three";
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import ThreeBSP from "../resource/ThreeBSP.js";
import SceneUtils from "../resource/SceneUtils.js";
import WEBGL from "../resource/WebGL.js";

export default {
  name: "Three",
  data() {
    return {
      msg: "Welcome to Your Vue.js App7908098"
    };
  },

  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene();
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        this.VIEW_ANGLE,
        this.ASPECT,
        this.NEAR,
        this.FAR
      );
      this.camera.position.set(0, 1000, 1800);
      this.camera.lookAt(this.scene.position);
      this.camera.lookAt(0, 0, 0);
      this.scene.add(this.camera);
    },
    initRender() {
      // if (Detector.webgl)
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      // else renderer = new THREE.CanvasRenderer();
      //设置渲染器的大小为窗口的内宽度，也就是内容区的宽度。
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.demo1.append(this.renderer.domElement);

      this.renderer.setClearColor(0x4682b4, 1.0);
    },
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    initLight() {
      // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不同
      // A start, 第二个参数是光源强度
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1); //模拟远处类似太阳的光源
      directionalLight.position.set(0, 100, 0).normalize();
      this.scene.add(directionalLight);
      //A end
      let ambient = new THREE.AmbientLight(0xffffff, 1); //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0);
      this.scene.add(ambient);
      //let pointlight = new THREE.PointLight(0x000000,1.5,2000);
      //scene.add(pointlight);
    },
    createFloor() {
      let loader = new THREE.TextureLoader();
      loader.load(require("../images/floor.jpg"), texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        let floorGeometry = new THREE.BoxGeometry(1600, 1100, 1);
        let floorMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });
        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        this.scene.add(floor);
      });

      //茶色：0x58ACFA   透明玻璃色：0XECF1F3
      this.glass_material = new THREE.MeshBasicMaterial({
        color: 0xecf1f3
      });
      this.glass_material.opacity = 0.4;
      this.glass_material.transparent = true;

      let left_wall = this.returnWallObject(
        20,
        200,
        1100,
        0,
        this.matArrayB,
        -801,
        100,
        0
      );
      let left_cube = this.returnWallObject(
        20,
        110,
        1100,
        0,
        this.matArrayB,
        -801,
        100,
        0
      );
      this.createResultBsp(left_wall, left_cube, 1);
      this.createCubeWall(1, 110, 1100, 0, this.glass_material, -801, 100, 0);

      let right_wall = this.returnWallObject(
        20,
        200,
        1100,
        1,
        this.matArrayB,
        801,
        100,
        0
      );
      let right_cube = this.returnWallObject(
        20,
        110,
        1100,
        0,
        this.matArrayB,
        801,
        100,
        0
      );
      this.createResultBsp(right_wall, right_cube, 1);
      this.createCubeWall(1, 110, 1100, 0, this.glass_material, 801, 100, 0);
    },
    createResultBsp(bsp, less_bsp, mat, two_bsp) {
      let material = null;
      switch (mat) {
        case 1:
          material = new THREE.MeshPhongMaterial({
            color: 0x9cb2d1,
            specular: 0x9cb2d1,
            shininess: 30,
            transparent: true,
            opacity: 1
          });
          break;
        case 2:
          material = new THREE.MeshPhongMaterial({
            color: 0xafc0ca,
            specular: 0xafc0ca,
            shininess: 30,
            transparent: true,
            opacity: 1
          });
          break;
        default:
      }

      let sphere1BSP = new ThreeBSP(bsp);
      let cube2BSP = new ThreeBSP(less_bsp); //0x9cb2d1 淡紫,0xC3C3C3 白灰 , 0xafc0ca灰
      let resultBSP = sphere1BSP.subtract(cube2BSP);
      let result = resultBSP.toMesh(material);
      result.material.flatshading = THREE.FlatShading;
      result.geometry.computeFaceNormals(); //重新计算几何体侧面法向量
      result.geometry.computeVertexNormals();
      result.material.needsUpdate = true; //更新纹理
      result.geometry.buffersNeedUpdate = true;
      result.geometry.uvsNeedUpdate = true;
      if (two_bsp) {
        let result_bsp = new ThreeBSP(result);
        resultBSP = result_bsp.subtract(new ThreeBSP(two_bsp));
        result = resultBSP.toMesh(material);
      }
      this.scene.add(result);
    },
    createCubeWall(width, height, depth, angle, material, x, y, z) {
      let cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      let cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.rotation.y += angle * Math.PI; //-逆时针旋转,+顺时针
      this.scene.add(cube);
    },
    returnWallObject(width, height, depth, angle, material, x, y, z) {
      let cubeGeometry = new THREE.BoxGeometry(width, height, depth);
      let cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;
      cube.rotation.y += angle * Math.PI;
      return cube;
    },
    createWallMaterail() {
      console.log(typeof this.matArrayA);
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //前  0xafc0ca :灰色
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //后
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ); //上  0xd6e4ec： 偏白色
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ); //下
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //左    0xafc0ca :灰色
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //右

      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //前  0xafc0ca :灰色
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0x9cb2d1
        })
      ); //后  0x9cb2d1：淡紫
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ); //上  0xd6e4ec： 偏白色
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ); //下
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //左   0xafc0ca :灰色
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ); //右
    },
    createLayout() {
      // 墙面1 立方体比较长的面  左一
      this.createCubeWall(10, 200, 900, 0, this.matArrayB, -651, 100, 0);
      // 墙面2  立方体比较长的面   右一
      this.createCubeWall(10, 200, 900, 1, this.matArrayB, 651, 100, 0);
      // 墙面3 门对面的墙 立方体比较短的面
      this.createCubeWall(10, 200, 1310, 1.5, this.matArrayB, 0, 100, -451);

      // 墙面4   带门的面
      let wall = this.returnWallObject(
        1310,
        200,
        10,
        0,
        this.matArrayB,
        0,
        100,
        455
      );
      // 门框
      let door_cube = this.returnWallObject(
        200,
        180,
        10,
        0,
        this.matArrayB,
        -450,
        90,
        455
      );
      let window_cube = this.returnWallObject(
        500,
        120,
        10,
        0,
        this.glass_material,
        100,
        110,
        455
      ); //
      //bsp
      this.createResultBsp(wall, door_cube, 1, window_cube);
      //为墙面安装门,右门
      let loader = new THREE.TextureLoader();
      loader.load(require("../images/door_right.png"), texture => {
        let doorGeometry = new THREE.BoxGeometry(100, 180, 2);
        let doormaterial = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        });
        doormaterial.opacity = 1.0;
        doormaterial.transparent = true;
        this.door = new THREE.Mesh(doorGeometry, doormaterial);
        this.door.position.set(-50, 0, 0);
        // let door1 = this.door.clone();
        // door1.position.set(50, 0, 0);
        // door1.visible = false;

        this.leftdoor = new THREE.Mesh(doorGeometry, doormaterial);
        this.leftdoor.position.set(-150, 0, 0);

        this.dummy.add(this.door);
        this.dummy.add(this.leftdoor);
        this.dummy.position.set(-350, 90, 451);
        this.scene.add(this.dummy);
      });

      // 房间A:隔墙1
      this.createCubeWall(10, 200, 250, 0, this.matArrayA, -151, 100, 325);
      //房间A:隔墙2  无门
      this.createCubeWall(10, 200, 220, 0.5, this.matArrayA, -256, 100, 201);
      // 厨房：隔墙3
      this.createCubeWall(350, 200, 10, 0, this.matArrayA, 481, 100, 131);
      // 厨房：隔墙4 无门
      this.createCubeWall(10, 200, 200, 0, this.matArrayA, 301, 100, 225);
      // 房间B
      this.createCubeWall(350, 200, 10, 0, this.matArrayA, -471, 100, -50);
      //房间B  无门
      this.createCubeWall(200, 200, 10, 0.5, this.matArrayA, 0, 100, -350);
      // 房间C
      this.createCubeWall(220, 200, 10, 0, this.matArrayA, 540, 100, -50);
      //房间C 无门
      this.createCubeWall(200, 200, 10, 0.5, this.matArrayA, 250, 100, -350);
      //厕所
      let cube = this.returnWallObject(
        10,
        200,
        260,
        0.5,
        this.matArrayA,
        125,
        100,
        -250
      );
      //厕所门框
      let door_cube1 = this.returnWallObject(
        10,
        160,
        80,
        0.5,
        this.matArrayA,
        155,
        90,
        -250
      );
      this.createResultBsp(cube, door_cube1, 2);

      //茶色：0x58ACFA   透明玻璃色：0XECF1F3
      this.glass_material = new THREE.MeshBasicMaterial({
        color: 0x58acfa
      });
      this.glass_material.opacity = 0.6;
      this.glass_material.transparent = true;
      this.createCubeWall(1, 180, 80, 0.5, this.glass_material, 155, 90, -250);
    },
    //创建花盆
    createflowerpot() {
      this.initFlowerpotModel();
    },
    initFlowerpotModel() {
      this.generatePoints(10, 2, 2 * Math.PI);
    },
    //生成模型调用的方法
    generatePoints(segments, phiStart, phiLength) {
      // add 10 random spheres
      let points = []; //存储顶点位置的数组
      let height = 5;
      let count = 20;
      for (let i = 0; i < count; i++) {
        //将顶点坐标push进入数组
        points.push(new THREE.Vector3(Math.sin(i * 0.15) * height + 12, i, 0));
      }

      //创建一个存储顶点球体的对象
      let spGroup = new THREE.Object3D();
      let material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: false
      }); //声明顶点球体使用的纹理
      points.forEach(function(point) {
        let spGeom = new THREE.SphereGeometry(0.2); //实例化球形几何体
        let spMesh = new THREE.Mesh(spGeom, material); //生成网格
        spMesh.position.copy(point); //将当前顶点的坐标位置赋值给当前球体
        spGroup.add(spMesh); //添加到对象当中
      });
      // 将存储顶点球体的对象添加到场景当中
      // this.scene.add(spGroup);

      // 实例化一个THREE.LatheGeometry，并设置相关的信息
      this.latheGeometry = new THREE.LatheGeometry(
        points,
        segments,
        phiStart,
        phiLength
      );
      let group = new THREE.Group();
      /****
       * 花盆植物的基类
       */

      let latheMesh = this.createMesh();

      let rightplant1 = latheMesh.clone();
      rightplant1.position.set(700, 0, -200);
      group.add(rightplant1);
      let rightplant2 = latheMesh.clone();
      rightplant2.position.set(700, 0, 200);
      group.add(rightplant2);

      let leftplant1 = latheMesh.clone();
      leftplant1.position.set(-700, 0, -200);
      group.add(leftplant1);
      let leftplant2 = latheMesh.clone();
      leftplant2.position.set(-700, 0, 200);
      group.add(leftplant2);

      let frontplant1 = latheMesh.clone();
      frontplant1.position.set(-250, 0, 500);
      group.add(frontplant1);
      let frontplant2 = latheMesh.clone();
      frontplant2.position.set(450, 0, 500);
      group.add(frontplant2);
      this.scene.add(group);
    },
    createMesh() {
      let geom = this.latheGeometry;
      let meshMaterial = new THREE.MeshBasicMaterial({
        color: "#996633",
        side: THREE.DoubleSide
      });
      let mesh = new THREE.Mesh(geom, meshMaterial);
      this.scene.add(mesh);
      let loader = new THREE.TextureLoader();
      let texture = loader.load(require("../images/plant.png"));
      // ,texture => {});
      let plantGeometry = new THREE.PlaneBufferGeometry(40, 90, 1);
      let plantmaterial = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.DoubleSide,
        alphaTest: 0.5
      });
      plantmaterial.opacity = 1.0;
      plantmaterial.transparent = true;
      let group = new THREE.Group();
      let plant1 = new THREE.Mesh(plantGeometry, plantmaterial);
      plant1.position.set(0, 60, 0);
      for (let i = 0; i < 10; i++) {
        let plantitem = plant1.clone();
        plantitem.rotation.set(0, 360 / i, 0);
        group.add(plantitem);
      }
      group.add(mesh);
      return group;
      // this.scene.add(group);
      // 将两种材质都赋给几何体
      // let mesh = SceneUtils.createMultiMaterialObject(geom, [
      //   meshMaterial,
      //   wireFrameMat
      // ]);
    },
    initObject() {
      //墙纹理
      this.createWallMaterail();
      this.createFloor();
      this.createLayout();
    },
    //初始化函数
    init() {
      let door_state = true; //默认是门是关闭的
      let SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
      //let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
      (this.VIEW_ANGLE = 75),
        (this.ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT),
        (this.NEAR = 0.1),
        (this.FAR = 10000);
      this.materialArrayA = [];
      this.materialArrayB = [];
      this.matArrayA = []; //内墙
      this.matArrayB = []; //外墙
      this.dummy = new THREE.Object3D(); //仿制品
      this.clock = new THREE.Clock();

      this.initScene();
      this.initRender();
      this.initCamera();
      this.initControls();
      this.initLight();
      this.initObject();
      this.createflowerpot();
      this.animate();
      //监听键盘按键
      document.addEventListener("keydown", this.onkeyDown, false);
    },
    onkeyDown(event) {
      switch (event.keyCode) {
        case 13:
          console.log(event.keyCode);
          if (door_state) {
            this.dummy.rotation.y += 0.5 * Math.PI;
            door_state = false;
          } else {
            this.dummy.rotation.y -= 0.5 * Math.PI;
            door_state = true;
          }
          break;
        default:
          console.log(event.keyCode);
          break;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      // TWEEN.update();
      this.update();
    },
    update() {
      let delta = this.clock.getDelta();
      let moveDistance = 200 * delta;
      let rotateAngle = (Math.PI / 2) * delta;
      this.controls.update();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
