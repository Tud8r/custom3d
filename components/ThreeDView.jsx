import React, { useCallback, useRef } from 'react';
import { View, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';

const modelObj = require('../assets/glob.obj');
const modelMtl = require('../assets/glob.mtl');
const textureFile = require('../assets/texture.png');

const treeObj = require('../assets/tree.obj');
const treeMtl = require('../assets/tree.mtl');
const treeTextureFile = require('../assets/texture.png');

const getDistance = (pointA, pointB) => {
  const dx = pointA.pageX - pointB.pageX;
  const dy = pointA.pageY - pointB.pageY;
  return Math.sqrt(dx * dx + dy * dy);
};

const ThreeDView = () => {
  const rendererRef = useRef(null);

  const isPressed = useRef(false);
  const isRotating = useRef(true);

  const distance = useRef(0);
  const startDistance = useRef(0);

  const objectRef = useRef(null);
  const treeRef = useRef(null);

  const touchStartX = useRef(0);
  const touchDifferenceX = useRef(0);

  const touchStartY = useRef(0);
  const touchDifferenceY = useRef(0);

  const rotatingSensitivity = useRef(0.07);
  const rotatingSensitivityWhileZooming = useRef(0.01);
  const zoomSensitivity = useRef(0.02);

  const zoomLimitIn = useRef(-3);
  const zoomLimitOut = useRef(15);

  const onContextCreate = useCallback(async (gl) => {
    console.log('Starting animation');
  
    const assetObj = Asset.fromModule(modelObj);
    const assetMtl = Asset.fromModule(modelMtl);
    const assetTexture = Asset.fromModule(textureFile);
  
    const assetTreeObj = Asset.fromModule(treeObj);
    const assetTreeMtl = Asset.fromModule(treeMtl);
    const assetTreeTexture = Asset.fromModule(treeTextureFile);
  
    try {
      await Promise.all([
        assetObj.downloadAsync(),
        assetMtl.downloadAsync(),
        assetTexture.downloadAsync(),
        assetTreeObj.downloadAsync(),
        assetTreeMtl.downloadAsync(),
        assetTreeTexture.downloadAsync(),
      ]);
    } catch (error) {
      console.error('Error downloading assets:', error);
      return;
    }
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);
  
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(assetTexture.localUri);
  
    const mtlLoader = new MTLLoader();
    mtlLoader.load(assetMtl.localUri, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
  
      objLoader.load(assetObj.localUri, (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material.map = texture;
          }
        });
  
        object.position.set(0, 0, 0);
        scene.add(object);
  
        objectRef.current = object;
  
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
  
        camera.position.copy(center);
        camera.position.z += size.z * 2;
        camera.lookAt(center);
  
        const treeTexture = textureLoader.load(assetTreeTexture.localUri);
        const addTree = (treeNumber) => {
          mtlLoader.load(assetTreeMtl.localUri, (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
    
            objLoader.load(assetTreeObj.localUri, (tree) => {
              tree.traverse((child) => {
                if (child.isMesh) {
                  child.material.map = treeTexture;
                  child.geometry.center();
                }
              });
              
              tree.position.set(0, 0, 0); // Position the tree at the origin
             
              // Define rotation in degrees
              const xe = Math.random() * 360; // Rotation around Z-axis
  
              const ze = Math.random() * 360;
  
  
  
              // Convert degrees to radians
              const xr = degreesToRadians(xe);
  
              const zr = degreesToRadians(ze);
              
              // Set rotation (assuming order XYZ)
              tree.rotation.set(xr, 0, zr);
  
  
              
      
              // Function to convert degrees to radians
              // Function to convert degrees to radians
              function degreesToRadians(degrees) {
                return degrees * (Math.PI / 180);
              }
              
              // Function to round values below a threshold to zero
              function threshold(value, threshold = 1e-6) {
                return Math.abs(value) < threshold ? 0 : value;
              }
               
              // Define Euler angles in degrees
              const pitchDegrees = xe;  // Rotation around X-axis
              const yawDegrees = 0;   // Rotation around Y-axis
              const rollDegrees = ze;   // Rotation around Z-axis
              
              // Convert degrees to radians
              const pitchRadians = degreesToRadians(pitchDegrees);
              const yawRadians = degreesToRadians(yawDegrees);
              const rollRadians = degreesToRadians(rollDegrees);
              
              // Create a THREE.Euler object with the rotation angles in radians
              const euler = new THREE.Euler(pitchRadians, yawRadians, rollRadians, 'XYZ'); // Order: XYZ
              
              // Create a rotation matrix from Euler angles
              const rotationMatrix = new THREE.Matrix4();
              rotationMatrix.makeRotationFromEuler(euler);
              
              // Define the vector to be rotated
              const vector = new THREE.Vector3(0, 1, 0); // Example: the "up" vector
              
              // Rotate the vector using the rotation matrix
              const rotatedVector = vector.clone().applyMatrix4(rotationMatrix);
              
              // Apply threshold to handle very small values
              const thresholdedVector = new THREE.Vector3(
                threshold(rotatedVector.x),
                threshold(rotatedVector.y),
                threshold(rotatedVector.z)
              );
              
              console.log('Original vector:', vector);
              console.log('Rotated vector:', thresholdedVector);
              console.log('Three:', treeNumber);
              
              const distance = 0.99;
  
              tree.position.set(rotatedVector.x*distance, rotatedVector.y*distance, rotatedVector.z*distance);
  
              treeRef.current = tree;
              object.add(tree);
    
              // Make the tree look at the origin (0, 0, 0)
    
              console.log('Tree and object positions:', object.position, tree.position);
            
            });
          });
        };
        for(let i = 0; i <2;i++){
        addTree();}

        
      });
    });
    
    const animate = () => {
      requestAnimationFrame(animate);
  
      if (isPressed.current && objectRef.current) {
        const deltaX = touchDifferenceX.current * rotatingSensitivity.current;
        const deltaY = touchDifferenceY.current * rotatingSensitivity.current;
  
        const quaternionX = new THREE.Quaternion();
        const quaternionY = new THREE.Quaternion();
  
        quaternionY.setFromAxisAngle(camera.up, deltaX);
  
        const cameraRight = new THREE.Vector3();
        camera.getWorldDirection(cameraRight);
        cameraRight.cross(camera.up).normalize();
        quaternionX.setFromAxisAngle(cameraRight, deltaY);
  
        const combinedQuaternion = new THREE.Quaternion();
        combinedQuaternion.multiplyQuaternions(quaternionY, quaternionX);
  
        objectRef.current.quaternion.premultiply(combinedQuaternion);
  
        touchStartY.current += touchDifferenceY.current;
        touchStartX.current += touchDifferenceX.current;
        touchDifferenceX.current = 0;
        touchDifferenceY.current = 0;
  
        if (startDistance.current && distance.current) {
          const futureZoom = camera.position.z + (startDistance.current - distance.current) * zoomSensitivity.current;
          if (futureZoom > zoomLimitIn.current && futureZoom < zoomLimitOut.current) {
            camera.position.z = futureZoom;
          }
          startDistance.current = distance.current;
        }
      }
  
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  
    rendererRef.current = renderer;
  
    return () => {
      console.log('Stopping animation');
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        isPressed.current = true;
        touchStartX.current = evt.nativeEvent.locationX;
        touchStartY.current = evt.nativeEvent.locationY;
      },
      onPanResponderMove: (evt, gestureState) => {
        isRotating.current = gestureState.numberActiveTouches === 1;
        if (!isRotating.current) {
          const [touch1, touch2] = evt.nativeEvent.touches;
          if (!startDistance.current) {
            startDistance.current = getDistance(touch1, touch2);
            distance.current = startDistance.current;
          } else {
            distance.current = getDistance(touch1, touch2);
          }
        } else {
          startDistance.current = 0;
          distance.current = 0;
        }

        if (isPressed.current) {
          touchDifferenceX.current = gestureState.vx;
          touchDifferenceY.current = gestureState.vy;
        }
      },
      onPanResponderRelease: () => {
        isPressed.current = false;
      },
      onPanResponderTerminate: () => {
        isPressed.current = false;
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

export default ThreeDView;