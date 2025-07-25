import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const API_BASE_URL = 'http://localhost:5000';
    const GALLERY_ENDPOINT = '/api/gallery';

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        fetchPhotos();
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}${GALLERY_ENDPOINT}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setPhotos(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching photos:', error);
            setError('Failed to load gallery images. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const openPhotoView = (photo) => {
        setSelectedPhoto(photo);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    };

    const closePhotoView = () => {
        setSelectedPhoto(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    const styles = {
        container: {
            padding: '20px',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        },
        heading: {
            color: '#333',
            margin: '20px 0',
            fontSize: isMobile ? '24px' : '32px'
        },
        gallery: {
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: isMobile ? '10px' : '20px',
            padding: '10px 0'
        },
        photoCard: {
            cursor: 'pointer',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            backgroundColor: '#fff',
            ':hover': {
                transform: 'scale(1.05)'
            }
        },
        photoImg: {
            width: '100%',
            height: isMobile ? '150px' : '200px',
            objectFit: 'cover',
            display: 'block'
        },
        caption: {
            padding: '10px',
            textAlign: 'center',
            fontSize: isMobile ? '12px' : '14px',
            color: '#555',
            backgroundColor: '#f9f9f9'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%'
        },
        modalImage: {
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain'
        },
        modalClose: {
            position: 'absolute',
            top: '-40px',
            right: '0',
            fontSize: '30px',
            color: 'white',
            cursor: 'pointer',
            background: 'none',
            border: 'none'
        },
        modalCaption: {
            position: 'absolute',
            bottom: '-30px',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'white',
            padding: '5px'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px'
        },
        errorContainer: {
            padding: '20px',
            backgroundColor: '#ffeeee',
            color: '#ff0000',
            borderRadius: '8px',
            margin: '20px 0'
        },
        emptyContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '20px'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Our Gallery</h1>
            
            {loading ? (
                <div style={styles.loadingContainer}>
                    <p>Loading gallery...</p>
                </div>
            ) : error ? (
                <div style={styles.errorContainer}>
                    <p>{error}</p>
                </div>
            ) : photos.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <p>No photos in the gallery yet.</p>
                    {/* Only show admin link if you want users to access it */}
                    {/* <p><Link to="/admin/gallery">Admin Gallery</Link></p> */}
                </div>
            ) : (
                <div style={styles.gallery}>
                    {photos.map((photo, index) => (
                        <div 
                            key={photo._id || index} 
                            style={styles.photoCard}
                            onClick={() => openPhotoView(photo)}
                        >
                            <img 
                                src={`${API_BASE_URL}${photo.src}`} 
                                alt={photo.caption || "Gallery image"} 
                                style={styles.photoImg}
                            />
                            {photo.caption && (
                                <div style={styles.caption}>{photo.caption}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            {selectedPhoto && (
                <div style={styles.modal} onClick={closePhotoView}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.modalClose} onClick={closePhotoView}>×</button>
                        <img 
                            src={`${API_BASE_URL}${selectedPhoto.src}`} 
                            alt={selectedPhoto.caption || "Gallery image"} 
                            style={styles.modalImage}
                        />
                        {selectedPhoto.caption && (
                            <div style={styles.modalCaption}>{selectedPhoto.caption}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;