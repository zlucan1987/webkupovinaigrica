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

    const onImageLoad = () => {
        const cropWidthInPercent = 80;
        
        const crop = {
            unit: '%',
            width: cropWidthInPercent,
            x: (100 - cropWidthInPercent) / 2,
            aspect: aspectRatio
        };
        
        setCrop(crop);
    };

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions
        const cropWidth = crop.width * (image.width / 100);
        const cropHeight = crop.height || (cropWidth / aspectRatio);
        const cropX = crop.x * (image.width / 100);
        const cropY = crop.y * (image.height / 100);
        
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        ctx.drawImage(
            image,
            cropX * scaleX,
            cropY * scaleY,
            cropWidth * scaleX,
            cropHeight * scaleY,
            0,
            0,
            cropWidth,
            cropHeight
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
        if (!completedCrop || !imgRef.current) return;
        
        try {
            setUploading(true);
            const croppedImageBase64 = await getCroppedImg(
                imgRef.current,
                completedCrop
            );
            
            await onImageUpload(croppedImageBase64);
            setShowModal(false);
            setSrc(null);
            setCrop(undefined);
            setCompletedCrop(null);
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Došlo je do greške prilikom uploada slike');
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
