import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadingManager = new THREE.LoadingManager();
export const textureLoader = new THREE.TextureLoader(loadingManager);
export const gltfLoader = new GLTFLoader(loadingManager);