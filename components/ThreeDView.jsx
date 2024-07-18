import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';
import { ColorNodeUniform } from 'three/examples/jsm/renderers/common/nodes/NodeUniform.js';

const modelObj = require('../assets/car.obj');
const modelMtl = require('../assets/car.mtl');
const textureFile = require('../assets/texture.png');


const getDistance = (pointA, pointB) => {
  const dx = pointA.pageX - pointB.pageX;
  const dy = pointA.pageY - pointB.pageY;
  return Math.sqrt(dx * dx + dy * dy);
};

const ThreeDView = () => {
  const rendererRef = useRef(null);
  
  const isPressed  = useRef(false);
  const isRotating = useRef(true);
  
  const distance = useRef(0);
  const startDistance = useRef(0);

  const objectRef = useRef(null); // Ref to hold the loaded object
 
  

  const touchStartX = useRef(0);
  const touchDifferenceX = useRef(0);

  const touchStartY = useRef(0);
  const touchDifferenceY = useRef(0);

  const rotatingSensivity = useRef(0.07);
  const rotatingSensivityWhileZooming = useRef(0.01)
  const zoomSensivity = useRef(0.02);

  const zoomLimitIn = useRef(-3);
  const zoomLimitOut = useRef(15);

  const onContextCreate = useCallback(async (gl) => {
    console.log('Starting animation');

    // Load assets
    const assetObj = Asset.fromModule(modelObj);
    const assetMtl = Asset.fromModule(modelMtl);
    const assetTexture = Asset.fromModule(textureFile);

    try {
      await Promise.all([
        assetObj.downloadAsync(),
        assetMtl.downloadAsync(),
        assetTexture.downloadAsync(),
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

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Load the texture
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(assetTexture.localUri);

    // Load materials and OBJ model
    const mtlLoader = new MTLLoader();
    mtlLoader.load(assetMtl.localUri, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);

      objLoader.load(assetObj.localUri, (object) => {
        // Apply the texture to the material
        object.traverse((child) => {
          if (child.isMesh) {
            child.material.map = texture;
          }
        });

        object.position.set(0, 0, -5);
        
        scene.add(object);

        objectRef.current = object;

        // Adjust camera position relative to loaded object
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        camera.position.copy(center);
        camera.position.z += size.z * 2; // Adjust distance from object
        camera.lookAt(center);
      });
    });
    
    // Setup basic scene
    const animate = () => {
      requestAnimationFrame(animate);

      if (isPressed.current) {
        
        objectRef.current.rotation.y += touchDifferenceX.current * rotatingSensivity.current;
        objectRef.current.rotation.x += touchDifferenceY.current * rotatingSensivity.current;

        touchStartY.current +=touchDifferenceY.current;
        touchStartX.current +=touchDifferenceX.current;
        touchDifferenceX.current = 0;
        touchDifferenceY.current = 0;
        
        
          let futureZoom = camera.position.z +(startDistance.current - distance.current)*zoomSensivity.current;
          if(futureZoom > zoomLimitIn.current && futureZoom < zoomLimitOut.current)
            camera.position.z =futureZoom;
  
          
    


          startDistance.current = distance.current;
          //console.log(camera.position.z);
        
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    rendererRef.current = renderer;

    return () => {
      console.log('Stopping animation');
      // Clean up listeners if needed
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        

        
        isPressed.current = true;

        touchStartX.current = evt.nativeEvent.locationX; // Store initial touch position

        touchStartY.current = evt.nativeEvent.locationY; 
      },
      onPanResponderMove: (evt, gestureState) => {
        isRotating.current = gestureState.numberActiveTouches === 1;
        if(!isRotating.current) {
          const [touch1, touch2] = evt.nativeEvent.touches;
          //console.log(touchStartX1.current, touchDifferenceX1.current);

          if(!startDistance.current){
            startDistance.current = getDistance(touch1, touch2);
            distance.current = startDistance.current;
          }
          else
            distance.current = getDistance(touch1, touch2);
          
        }
        else{
          
          startDistance.current=0;
          distance.current=0; 

        }

        if (isPressed.current) {
          touchDifferenceX.current = gestureState.vx;

          touchDifferenceY.current = gestureState.vy;
        }
      },
      onPanResponderRelease: () => {
        
        console.log('Touch end detected');
        isPressed.current = false;
        
        
      },
      onPanResponderTerminate: () => {
        console.log('Touch terminated');
        isPressed.current = false;
        
      
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        {...panResponder.panHandlers} // Attach panHandlers to GLView
      />
    </View>
  );
};

export default ThreeDView;
