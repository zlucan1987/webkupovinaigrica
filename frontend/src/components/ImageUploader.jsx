import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageUploader = ({ onImageUpload, aspectRatio = 1, maxSize = 5 }) => {
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const imgRef = useRef(null);

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Provjera tipa datoteke
        if (!file.type.match('image.*')) {
            setError('Molimo odaberite sliku (JPEG, PNG, GIF, itd.)');
            return;
        }
        
        // Provjera veličine datoteke (max 5MB)
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Slika ne smije biti veća od ${maxSize}MB`);
            return;
        }
        
        setError('');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setSrc(reader.result);
            setShowModal(true);
        });
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e) => {
        const image = e.currentTarget;
        const { width, height, naturalWidth, naturalHeight } = image;
        
        // Calculate the initial crop size based on the aspect ratio
        let cropWidth, cropHeight, cropX, cropY;
        
        // Use percentage-based crop for consistency
        const cropWidthInPercent = 80; // Use 80% of the image width
        
        if (aspectRatio > 1) {
            // Landscape aspect ratio (width > height)
            cropWidth = cropWidthInPercent;
            cropHeight = cropWidthInPercent / aspectRatio;
        } else {
            // Portrait or square aspect ratio (height >= width)
            cropHeight = cropWidthInPercent;
            cropWidth = cropWidthInPercent * aspectRatio;
        }
        
        // Center the crop
        cropX = (100 - cropWidth) / 2;
        cropY = (100 - cropHeight) / 2;
        
        const initialCrop = {
            unit: '%',
            width: cropWidth,
            height: cropHeight,
            x: cropX,
            y: cropY,
            aspect: aspectRatio
        };
        
        console.log("ImageUploader.onImageLoad: Image dimensions:", {
            width, height, naturalWidth, naturalHeight,
            aspectRatio
        });
        
        console.log("ImageUploader.onImageLoad: Setting initial crop:", initialCrop);
        
        setCrop(initialCrop);
    };

    const getCroppedImg = (image, crop) => {
        // Ensure crop has all required properties
        if (!crop || !crop.width) {
            console.error("Invalid crop object:", crop);
            return Promise.reject("Invalid crop parameters");
        }
        
        // Log crop parameters for debugging
        console.log("ImageUploader.getCroppedImg: Crop parameters:", {
            width: crop.width,
            height: crop.height,
            x: crop.x,
            y: crop.y,
            unit: crop.unit
        });
        
        // Get the image dimensions
        const imageWidth = image.width;
        const imageHeight = image.height;
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;
        
        // Calculate scale factors between displayed size and natural size
        const scaleX = naturalWidth / imageWidth;
        const scaleY = naturalHeight / imageHeight;
        
        // Calculate crop dimensions in pixels (not percentages)
        // If crop unit is '%', convert to pixels based on the displayed image size
        let cropWidthPx, cropHeightPx, cropXPx, cropYPx;
        
        if (crop.unit === '%') {
            cropWidthPx = (crop.width * imageWidth) / 100;
            cropHeightPx = (crop.height * imageHeight) / 100;
            cropXPx = (crop.x * imageWidth) / 100;
            cropYPx = (crop.y * imageHeight) / 100;
        } else {
            // If crop unit is 'px', use the values directly
            cropWidthPx = crop.width;
            cropHeightPx = crop.height;
            cropXPx = crop.x;
            cropYPx = crop.y;
        }
        
        // Ensure we have valid dimensions
        if (cropWidthPx <= 0 || cropHeightPx <= 0) {
            console.error("Invalid crop dimensions:", { cropWidthPx, cropHeightPx });
            return Promise.reject("Invalid crop dimensions");
        }
        
        // Create a canvas with the exact dimensions of the crop
        const canvas = document.createElement('canvas');
        canvas.width = cropWidthPx;
        canvas.height = cropHeightPx;
        const ctx = canvas.getContext('2d');
        
        // Log all the calculated values for debugging
        console.log("ImageUploader.getCroppedImg: Detailed calculations:", {
            imageWidth,
            imageHeight,
            naturalWidth,
            naturalHeight,
            scaleX,
            scaleY,
            cropWidthPx,
            cropHeightPx,
            cropXPx,
            cropYPx,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
        });
        
        // Draw the cropped portion of the image onto the canvas
        // We need to scale the crop coordinates and dimensions to match the natural image size
        ctx.drawImage(
            image,
            cropXPx * scaleX,      // source x (scaled to natural size)
            cropYPx * scaleY,      // source y (scaled to natural size)
            cropWidthPx * scaleX,  // source width (scaled to natural size)
            cropHeightPx * scaleY, // source height (scaled to natural size)
            0,                     // destination x
            0,                     // destination y
            cropWidthPx,           // destination width
            cropHeightPx           // destination height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result.split(',')[1];
                    resolve(base64data);
                };
            }, 'image/png');
        });
    };

    const handleUpload = async () => {
        if (!completedCrop || !imgRef.current) {
            setError('Molimo odaberite područje za izrezivanje slike');
            return;
        }
        
        try {
            setUploading(true);
            setError('');
            
            console.log("ImageUploader.handleUpload: Processing crop with parameters:", completedCrop);
            
            // Get the cropped image as base64
            const croppedImageBase64 = await getCroppedImg(
                imgRef.current,
                completedCrop
            );
            
            console.log("ImageUploader.handleUpload: Successfully cropped image, uploading...");
            
            // Upload the cropped image
            await onImageUpload(croppedImageBase64);
            
            // Reset the state
            setShowModal(false);
            setSrc(null);
            setCrop(undefined);
            setCompletedCrop(null);
            
            console.log("ImageUploader.handleUpload: Upload complete");
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Došlo je do greške prilikom obrade ili uploada slike: ' + (error.message || error));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-uploader">
            <Form.Group controlId="imageUpload" className="mb-3">
                <Form.Label>Odaberite sliku s vašeg uređaja</Form.Label>
                <Form.Control 
                    type="file" 
                    accept="image/*"
                    onChange={onSelectFile}
                />
                <Form.Text className="text-muted">
                    Maksimalna veličina: {maxSize}MB. Podržani formati: JPEG, PNG, GIF.
                </Form.Text>
                {error && <div className="text-danger mt-2">{error}</div>}
            </Form.Group>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Uredite sliku</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {src && (
                        <div className="crop-container">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={src}
                                    onLoad={onImageLoad}
                                    style={{ maxHeight: '70vh', maxWidth: '100%' }}
                                />
                            </ReactCrop>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Odustani
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleUpload}
                        disabled={!completedCrop || uploading}
                    >
                        {uploading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Učitavanje...
                            </>
                        ) : (
                            'Spremi sliku'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

ImageUploader.propTypes = {
    onImageUpload: PropTypes.func.isRequired,
    aspectRatio: PropTypes.number,
    maxSize: PropTypes.number
};

export default ImageUploader;
