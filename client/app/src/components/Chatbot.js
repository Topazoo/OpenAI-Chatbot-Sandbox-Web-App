import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef} from 'react';
import { AuthContext } from '../context/auth_context';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, ListGroup, Spinner  } from 'react-bootstrap';
import '../stylesheets/Chatbot.css';

const Chatbot = () => {
  const location = useLocation();

  const { chatId } = useParams();
  const { auth } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatName, setChatName] = useState(location.state?.chatName || 'Chat');
  const [directiveId, setDirectiveId] = useState(location.state?.directiveId);
  const [directiveName, setDirectiveName] = useState(location.state?.directiveName || '');

  const [callError, setCallError] = useState('');

  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const formatError = (error) => {
    const errorMessage = error.response?.data?.error;
    if(errorMessage !== undefined) {
        return `: [${errorMessage}]\n`;
    }

    return '\n';
  };

  const sendMessage = (e) => {
    e.preventDefault();
    setIsSending(true);
  
    axios
      .post('/api/chatbot', {
        user_chat: input,
        chat_id: chatId,
        user_id: auth._id,
      })
      .then((response) => {
        const newMessages = [
          ...messages,
          { role: 'user', content: input },
          { role: 'assistant', content: response.data.data },
        ];
        setMessages(newMessages);
        setInput('');
      })
      .catch((error) => {
        const errorMessage = `There was an error sending your message${formatError(error)}Please try again.`;
        console.error(errorMessage);
        setCallError(errorMessage);
      })
      .finally(() => {
        setIsSending(false);
      });
  };  

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chatbot?chat_id=${chatId}&user_id=${auth._id}&directive_id=${directiveId}`);
      setMessages(response.data.data);
    } catch (error) {
      const errorMessage = `There was an loading your messages${formatError(error)}Please reload the page.`;
      console.error(errorMessage);
      setCallError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const fetchChatData = async () => {
    try {
        const response = await axios.get(`/api/chats?user_id=${auth._id}&_id=${chatId}`);
        const chat = response.data.data.find(d => d._id === chatId);
        if (chat) {
            setChatName(chat.name);
            setDirectiveId(chat.directive_id);
        }
    } catch (error) {
        const errorMessage = `There was an loading chat metadata${formatError(error)}Please reload the page.`;
        console.error(errorMessage);
        setCallError(errorMessage);
    }
  };

  const fetchDirectiveName = async () => {
    try {
        const response = await axios.get(`/api/directives?user_id=${auth._id}&_id=${directiveId}`);
        const directive = response.data.data.find(d => d._id === directiveId);
        if (directive) {
            setDirectiveName(directive.name);
        }
    } catch (error) {
        const errorMessage = `There was an loading directive metadata${formatError(error)}Please reload the page.`;
        console.error(errorMessage);
        setCallError(errorMessage);
    }
  };

  const renderMessage = (message, index) => (
    <ListGroup.Item
      key={index}
      className={`${message.role} message-content`}
    >
      {message.content}
    </ListGroup.Item>
  );
  
  useEffect(() => {
    fetchChatData();
  }, []);

  useEffect(() => {
    if(directiveId !== undefined) {
        fetchMessages();
        fetchDirectiveName();
    }
  }, [directiveId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container className="chatbot-container">
        <br></br>
      <Row className="mb-2">
        <Col>
          <Link to={`/home/${directiveId}/chats`}>
            <div style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', paddingBottom: '1vw' }}>
              <FaArrowLeft style={{ marginRight: '4px' }} />
              <span>{`Chats using the "${directiveName}" Directive`}</span>
            </div>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
            <div className="page-subtitle">
                <h2>{chatName}</h2>
            </div>
            {isLoading ? (
             <div className="d-flex align-items-center">
                <Spinner animation="border" role="status" className="mr-2">
                    <span className="sr-only">Loading...</span>
                </Spinner>
                <span>Loading chat... (can take ~30s)</span>            
            </div>
            ) : (
                <ListGroup style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    {messages.map(renderMessage)}
                    {callError && (
                        <ListGroup.Item className="error">
                        {callError}
                        </ListGroup.Item>
                    )}
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
            <Button type="submit" className="ml-2" disabled={isSending}>
              {isSending ? (
                <Spinner animation="border" size="sm" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                <i className="fas fa-arrow-right"></i>
              )}
            </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chatbot;
