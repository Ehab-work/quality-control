import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import './ColorAnalyzer.css';

const ColorAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [blackRatio, setBlackRatio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    setLoading(true);
    setError('');
    setBlackRatio(null);

    try {
      const res = await axiosInstance.post('analyze-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBlackRatio(res.data.black_ratio);
    } catch (err) {
      setError("An error occurred during analysis.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="color-analyzer-page">
      <h2 className="section-title">Black Color Ratio Analyzer</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
      <button onClick={handleUpload} className="analyze-btn">
        {loading ? "Analyzing..." : "Upload and Analyze"}
      </button>

      {blackRatio !== null && (
        <p className="result-text">Black Color Ratio: <strong>{blackRatio}%</strong></p>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default ColorAnalyzer;
