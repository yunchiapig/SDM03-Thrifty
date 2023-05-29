import { useState, useRef, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    IconButton, 
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Image as ImgComponent
  } from '@chakra-ui/react';
import { FaUpload } from 'react-icons/fa';
import { useStoreAdmin } from '../hooks/useStoreAdmin';

function CustomModal({setImageFile, storeImage}) {
    const {checkTokenExpiration} = useStoreAdmin();
    const boxHeight =  400 * 512 / 635;
    const boxWidth = 400
    const [initialImage, setInitialImg] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [croppedImage, setCroppedImage] = useState('');
    const [src, setSrc] = useState("")
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({width: 0, height: 0, x: 0, y: 0});

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleImageSelect = async(e) => {
      
        const file = e.target.files[0];
        if (!file) return;
        let src = URL.createObjectURL(file)
        setSrc(src);
        const img = await createImage(src);
        setInitialImg(img);
        setIsModalOpen(true);
    };
    
    const CloseModal = () => {
        setIsModalOpen(false);
    }
    
    const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
      image.src = url
    })

    const dataURLToFile = (dataURL, fileName) => {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
    
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
    
      return new File([u8arr], fileName, { type: mime });
    };

    const handleOK= async() => {
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.width * 512 / 635;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          initialImage,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
        //const imageData = ctx.getImageData(croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height);
        //ctx.putImageData(imageData, 0, 0);
        // Converting to base64
        const newImage = canvas.toDataURL('image/jpeg');
       
        setImageFile(dataURLToFile(newImage, 'newImage.jpeg'));
        setCroppedImage(newImage);
        CloseModal();
    };

    const handleCropChange = (crop) => {
        setCrop(crop);
    };

    const handleZoomChange = (zoom) => {
        setZoom(zoom);
    };

  
  return (
    <Box w = {{base: '330px', md:'635px'}} h = {{base: '268px', md: '512px'}} borderWidth='1px' borderRadius='lg' overflow='hidden'>
        {croppedImage === "" ? (storeImage === "default" ? <IconButton aria-label='Upload Image' w = 'full' h = 'full' icon={<FaUpload />} onClick={() => document.getElementById('image-input').click()} /> :
          <ImgComponent
            w = 'full' h = 'full'
            src= {storeImage}
            alt= "Store image"
            onClick={() => document.getElementById('image-input').click()} cursor='pointer'
          />) : 
          <ImgComponent w = 'full' h = 'full' src={croppedImage} onClick={() => document.getElementById('image-input').click()} cursor='pointer'/>}
        <Input type='file' accept="image/png, image/jpeg" id='image-input' display='none' onChange={handleImageSelect} cursor='pointer' />
        <Modal isOpen={isModalOpen} onClose={CloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crop Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {src && (
              <Box position="relative" width="400px" height="400px">
                <Cropper
                  image={src}
                  crop={crop}
                  zoom={zoom}
                  aspect={boxWidth/boxHeight}
                  onCropChange={handleCropChange}
                  onZoomChange={handleZoomChange}
                  onCropComplete={onCropComplete}
                />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={CloseModal}>
              Cancel
            </Button>
            <Button onClick={handleOK}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CustomModal;
