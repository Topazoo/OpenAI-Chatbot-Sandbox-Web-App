import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/Footer.css';

const Footer = () => {
  const [modelName, setModelName] = useState('GPT-3');

  const fetchModelName = async () => {
    try {
        const response = await axios.get(`/api/config?name=BASE_MODEL`);
        const model = response.data.data.find(d => d.name === "BASE_MODEL");
        if (model) {
            setModelName(model.value);
        }
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    fetchModelName();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">Powered by OpenAI | Model: {modelName}</div>
    </footer>
  );
};

export default Footer;