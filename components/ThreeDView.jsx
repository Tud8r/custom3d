import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';

// Manually specify the asset paths
const modelObj = require('../assets/car.obj');
const modelMtl = require('../assets/car.mtl');
const textureFile = require('../assets/texture.png');

const ThreeDView = () => {
  const rendererRef = useRef(null);
  
  isPressed = false;

  const objectRef = useRef(null); // Ref to hold the loaded object
 
  const startRotationX = useRef(0);
  const startRotationY = useRef(0);

  const touchStartX = useRef(0);
  const touchMovingX = useRef(0);
  const touchDifferenceX = useRef(0);

  const touchStartY = useRef(0);
  const touchMovingY = useRef(0);
  const touchDifferenceY = useRef(0);

  sensivity=0.01;

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

      if (isPressed) {
        console.log(startRotationY.current, touchDifferenceX);
        objectRef.current.rotation.y += touchDifferenceX.current * sensivity;
        objectRef.current.rotation.x += touchDifferenceY.current * sensivity;

        touchStartX.current +=touchDifferenceX.current;
        touchStartY.current +=touchDifferenceY.current;
        touchDifferenceX.current = 0;
        touchDifferenceY.current = 0;
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
        
        startRotationX.current = objectRef.current.rotation.x;
        startRotationY.current = objectRef.current.rotation.y;

        isPressed = true;
        touchStartX.current = evt.nativeEvent.locationX; // Store initial touch position
        touchMovingX.current = evt.nativeEvent.locationX; // Initialize touchMovingX

        touchStartY.current = evt.nativeEvent.locationY; 
        touchMovingY.current = evt.nativeEvent.locationY;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isPressed) {
          touchMovingX.current = gestureState.moveX; // Update touchMovingX as touch moves
          touchDifferenceX.current = touchMovingX.current - touchStartX.current;

          touchMovingY.current = gestureState.moveY; // Update touchMovingX as touch moves
          touchDifferenceY.current = touchMovingY.current - touchStartY.current;
        }
      },
      onPanResponderRelease: () => {
        
        console.log('Touch end detected');
        isPressed = false;
      },
      onPanResponderTerminate: () => {
        console.log('Touch terminated');
        isPressed = false;
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
