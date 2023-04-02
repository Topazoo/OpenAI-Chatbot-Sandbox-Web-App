import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth_context';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useHistory, Link, useLocation, useParams } from 'react-router-dom';

const Chatlist = () => {
    const { auth, authDispatch } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [newChatName, setNewChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const [directiveName, setDirectiveName] = useState(location.state?.directiveName || '');
    const { directiveId } = useParams();

  
    useEffect(() => {
        setIsLoading(true);
        fetchChats();
        fetchDirectiveName();
    }, []);
  
    const goToChat = (chatId, chatName) => {
        history.push({
          pathname: `/home/chats/${chatId}`,
          state: { chatName: chatName, directiveId: directiveId, directiveName: directiveName },
        });
      };

    const fetchChats = async () => {
        try {
          const response = await axios.get(`/api/chats?user_id=${auth._id}&directive_id=${directiveId}`);
          setChats(response.data.data);
        } catch (error) {
          console.error('Error fetching chats:', error);
        } finally {
          setIsLoading(false);
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
            console.error('Error fetching directive name:', error);
        }
    };
  
    const createNewChat = (e) => {
      e.preventDefault();
      setIsLoading(true);

      const newChat = {
        user_id: auth._id,
        directive_id: directiveId,
        name: newChatName
      };

      axios.post('/api/chats', newChat)
          .then((response) => {
              const newChats = [
                  ...chats,
                  {_id: response.data._id, ...newChat}
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
                    <br></br>
                    <Link to="/home">
                    <div style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', paddingBottom: '1vw' }}>
                        <FaArrowLeft style={{ marginRight: '4px' }} />
                        <span>Directives List</span>
                    </div>
                    </Link>
                </Col>
            </Row>
          <Row>
            <Col>
              <div className="page-subtitle">
                <br></br>
                <h2>Chats</h2>
                <h5>{`Using the "${directiveName}" Directive`}</h5>
              </div>
              {isLoading ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                <ListGroup>
                  {chats.map((chat) => (
                    <ListGroup.Item
                      key={chat._id}
                      onClick={() => goToChat(chat._id, chat.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {chat.name}
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
    