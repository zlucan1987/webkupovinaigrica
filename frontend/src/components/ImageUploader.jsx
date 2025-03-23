import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Spinner, ProgressBar } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { compressImage } from '../utils/imageUtils';

const ImageUploader = ({ onImageUpload, aspectRatio = 1, maxSize = 5, maxWidth = 1200, maxHeight = 1200 }) => {
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [originalFileSize, setOriginalFileSize] = useState(0);
    const [compressedFileSize, setCompressedFileSize] = useState(0);
    const imgRef = useRef(null);

    const onSelectFile = async (e) => {
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
        setOriginalFileSize(file.size);
        setCompressionProgress(10);
        
        try {
            // Kompresija slike prije prikaza
            setCompressionProgress(30);
            const compressedFile = await compressImage(file, maxWidth, maxHeight, 0.8);
            setCompressedFileSize(compressedFile.size);
            setCompressionProgress(70);
            
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSrc(reader.result);
                setShowModal(true);
                setCompressionProgress(100);
                
                // Resetiraj progress nakon 1 sekunde
                setTimeout(() => {
                    setCompressionProgress(0);
                }, 1000);
            });
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('Greška prilikom kompresije slike:', error);
            setError('Došlo je do greške prilikom obrade slike. Molimo pokušajte ponovno.');
            setCompressionProgress(0);
            
            // Ako kompresija ne uspije, koristi originalnu sliku
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSrc(reader.result);
                setShowModal(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onImageLoad = (e) => {
        const image = e.currentTarget;
        const { width, height, naturalWidth, naturalHeight } = image;
        
        // Izračunaj početnu veličinu izrezivanja na temelju omjera
        let cropWidth, cropHeight, cropX, cropY;
        
        // Koristim postotak za konzistentnost
        const cropWidthInPercent = 80; // Koristim 80% širine slike
        
        if (aspectRatio > 1) {
            // Pejzažni omjer (širina > visina)
            cropWidth = cropWidthInPercent;
            cropHeight = cropWidthInPercent / aspectRatio;
        } else {
            // Portretni ili kvadratni omjer (visina >= širina)
            cropHeight = cropWidthInPercent;
            cropWidth = cropWidthInPercent * aspectRatio;
        }
        
        // Centriraj izrezivanje
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
        
        console.log("ImageUploader.onImageLoad: Dimenzije slike:", {
            width, height, naturalWidth, naturalHeight,
            aspectRatio
        });
        
        console.log("ImageUploader.onImageLoad: Postavljam početno izrezivanje:", initialCrop);
        
        setCrop(initialCrop);
    };

    const getCroppedImg = (image, crop) => {
        // Provjeri ima li izrezivanje sve potrebne parametre
        if (!crop || !crop.width) {
            console.error("Nevažeći objekt izrezivanja:", crop);
            return Promise.reject("Nevažeći parametri izrezivanja");
        }
        
        // Zapisujem parametre izrezivanja za debugiranje
        console.log("ImageUploader.getCroppedImg: Parametri izrezivanja:", {
            width: crop.width,
            height: crop.height,
            x: crop.x,
            y: crop.y,
            unit: crop.unit
        });
        
        // Dohvati dimenzije slike
        const imageWidth = image.width;
        const imageHeight = image.height;
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;
        
        // Izračunaj faktore skaliranja između prikazane i prirodne veličine
        const scaleX = naturalWidth / imageWidth;
        const scaleY = naturalHeight / imageHeight;
        
        // Izračunaj dimenzije izrezivanja u pikselima (ne u postocima)
        // Ako je jedinica izrezivanja '%', pretvori u piksele na temelju prikazane veličine slike
        let cropWidthPx, cropHeightPx, cropXPx, cropYPx;
        
        if (crop.unit === '%') {
            cropWidthPx = (crop.width * imageWidth) / 100;
            cropHeightPx = (crop.height * imageHeight) / 100;
            cropXPx = (crop.x * imageWidth) / 100;
            cropYPx = (crop.y * imageHeight) / 100;
        } else {
            // Ako je jedinica izrezivanja 'px', koristi vrijednosti direktno
            cropWidthPx = crop.width;
            cropHeightPx = crop.height;
            cropXPx = crop.x;
            cropYPx = crop.y;
        }
        
        // Provjeri jesu li dimenzije valjane
        if (cropWidthPx <= 0 || cropHeightPx <= 0) {
            console.error("Nevažeće dimenzije izrezivanja:", { cropWidthPx, cropHeightPx });
            return Promise.reject("Nevažeće dimenzije izrezivanja");
        }
        
        // Kreiraj canvas s točnim dimenzijama izrezivanja
        const canvas = document.createElement('canvas');
        canvas.width = cropWidthPx;
        canvas.height = cropHeightPx;
        const ctx = canvas.getContext('2d');
        
        // Zapisujem sve izračunate vrijednosti za debugiranje
        console.log("ImageUploader.getCroppedImg: Detaljni izračuni:", {
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
        
        // Nacrtaj izrezani dio slike na canvas
        // Potrebno je skalirati koordinate i dimenzije izrezivanja da odgovaraju prirodnoj veličini slike
        ctx.drawImage(
            image,
            cropXPx * scaleX,      // izvorni x (skaliran na prirodnu veličinu)
            cropYPx * scaleY,      // izvorni y (skaliran na prirodnu veličinu)
            cropWidthPx * scaleX,  // izvorna širina (skalirana na prirodnu veličinu)
            cropHeightPx * scaleY, // izvorna visina (skalirana na prirodnu veličinu)
            0,                     // odredišni x
            0,                     // odredišni y
            cropWidthPx,           // odredišna širina
            cropHeightPx           // odredišna visina
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas je prazan');
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
            
            console.log("ImageUploader.handleUpload: Obrađujem izrezivanje s parametrima:", completedCrop);
            
            // Dohvati izrezanu sliku kao base64
            const croppedImageBase64 = await getCroppedImg(
                imgRef.current,
                completedCrop
            );
            
            console.log("ImageUploader.handleUpload: Uspješno izrezana slika, uploadam...");
            
            // Uploadaj izrezanu sliku
            await onImageUpload(croppedImageBase64);
            
            // Resetiraj stanje
            setShowModal(false);
            setSrc(null);
            setCrop(undefined);
            setCompletedCrop(null);
            setOriginalFileSize(0);
            setCompressedFileSize(0);
            
            console.log("ImageUploader.handleUpload: Upload završen");
        } catch (error) {
            console.error('Greška prilikom uploada slike:', error);
            setError('Došlo je do greške prilikom obrade ili uploada slike: ' + (error.message || error));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-uploader">
            <Form.Group controlId="imageUpload" className="mb-3">
                <Form.Label style={{ color: 'white' }}>Odaberite sliku s vašeg uređaja</Form.Label>
                <Form.Control 
                    type="file" 
                    accept="image/*"
                    onChange={onSelectFile}
                />
                <Form.Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Maksimalna veličina: {maxSize}MB. Podržani formati: JPEG, PNG, GIF.
                </Form.Text>
                {compressionProgress > 0 && (
                    <div className="mt-2">
                        <ProgressBar 
                            now={compressionProgress} 
                            label={`${compressionProgress}%`} 
                            variant="info" 
                            className="mb-2"
                        />
                        <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Optimizacija slike u tijeku...
                        </small>
                    </div>
                )}
                {compressedFileSize > 0 && originalFileSize > 0 && (
                    <div className="mt-2">
                        <small style={{ color: '#28a745' }}>
                            Slika kompresirana: {(originalFileSize / (1024 * 1024)).toFixed(2)}MB → {(compressedFileSize / (1024 * 1024)).toFixed(2)}MB 
                            ({Math.round(compressedFileSize / originalFileSize * 100)}% originalne veličine)
                        </small>
                    </div>
                )}
                {error && <div style={{ color: '#dc3545' }} className="mt-2">{error}</div>}
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
    maxSize: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number
};

export default ImageUploader;
