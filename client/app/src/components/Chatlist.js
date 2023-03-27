import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth_context';
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const Chatlist = () => {
    const { auth, authDispatch } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [newChatName, setNewChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add this line
    const history = useHistory();
  
    useEffect(() => {
        setIsLoading(true);
        fetchChats();
    }, []);
  
    const goToChat = (chatId) => {
      history.push(`/home/${chatId}`);
    };

    const fetchChats = async () => {
        try {
          const response = await axios.get(`/api/chats?user_id=${auth._id}`);
          setChats(response.data.data);
        } catch (error) {
          console.error('Error fetching chats:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
    const createNewChat = (e) => {
      e.preventDefault();
      setIsLoading(true);

      axios.post('/api/chatbot', {
              user_id: auth._id,
              chat_name: newChatName
          })
          .then((response) => {
              const newChats = [
                  ...chats,
                  {...response.data, chat_name: newChatName}
              ];
              setChats(newChats);
              setNewChatName('');
          }).finally(() => {
            setIsLoading(false);
          });
    };
  
    return (
        <Container>
          <Row>
            <Col>
              <h1>Chats</h1>
              {isLoading ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                <ListGroup>
                  {chats.map((chat) => (
                    <ListGroup.Item
                      key={chat._id}
                      onClick={() => goToChat(chat._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {chat.chat_name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form onSubmit={createNewChat}>
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    placeholder="New chat name"
                  />
                  <Button variant="primary" type="submit" className="ml-2" disabled={isLoading}>
                    Create
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      );
    };
    
export default Chatlist;
    