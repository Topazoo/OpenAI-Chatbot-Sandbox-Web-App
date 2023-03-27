import axios from 'axios';
import { useParams, useHistory, Link } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef} from 'react';
import { AuthContext } from '../context/auth_context';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, ListGroup, Spinner  } from 'react-bootstrap';
import '../stylesheets/Chatbot.css';

const Chatbot = () => {
  const { chatId } = useParams();
  const { auth, authDispatch } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();

    axios.post('/api/chatbot', {
            user_chat: input,
            chat_id: chatId,
            user_id: auth._id
        })
        .then((response) => {
            const newMessages = [
                ...messages,
                { "role": "user", "content": input },
                { "role": "assistant", "content": response.data.data }
            ];
            setMessages(newMessages);
            setInput('');
        });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chatbot?chat_id=${chatId}&user_id=${auth._id}&include_directives=false`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const renderMessage = (message, index) => (
    <ListGroup.Item key={index} className={`${message.role} message-content`}>
      {message.content}
    </ListGroup.Item>
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container className="chatbot-container">
      <Row className="mb-2">
        <Col>
          <Link to="/">
            <div style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
              <FaArrowLeft style={{ marginRight: '4px' }} />
              <span>Back to Chat List</span>
            </div>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
            <h1>Chatbot</h1>
            {isLoading ? (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
            ) : (
            <ListGroup style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                {messages.map(renderMessage)}
                <div ref={bottomRef} />
            </ListGroup>
            )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form onSubmit={sendMessage}>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your message"
              />
              <Button type="submit" className="ml-2">
                <i className="fas fa-arrow-right"></i>
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chatbot;
