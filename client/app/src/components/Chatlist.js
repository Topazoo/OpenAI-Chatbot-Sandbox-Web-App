import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/auth_context';
import { FaArrowLeft } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { useHistory, Link, useLocation, useParams } from 'react-router-dom';
import '../stylesheets/DirectivesList.css';

const Chatlist = () => {
    const { auth, authDispatch } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [newChatName, setNewChatName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const [directiveName, setDirectiveName] = useState(location.state?.directiveName || '');
    const { directiveId } = useParams();

    const [showHelpModal, setShowHelpModal] = useState(false);
    const toggleHelpModal = () => {
      setShowHelpModal(!showHelpModal);
    };

    const lastChatItemRef = useRef(null); 
    const scrollToLastChatItem = () => { 
        if (lastChatItemRef.current) {
            lastChatItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
              scrollToLastChatItem(); 
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
                    <div
                    style={{
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        paddingBottom: '1vw',
                    }}
                    >
                    <FaArrowLeft style={{ marginRight: '4px' }} />
                    <span>Directives List</span>
                    </div>
                </Link>
                <Button
                    variant="info"
                    onClick={toggleHelpModal}
                    style={{ float: 'right', marginTop: '-10px' }}
                >
                    Help
                </Button>
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
          <Row>
            <Col>
              <div className="list-container">
                <ListGroup>
                  {chats.map((chat, index) => (
                    <ListGroup.Item
                      key={chat._id}
                      onClick={() => goToChat(chat._id, chat.name)}
                      style={{ cursor: 'pointer' }}
                      ref={index === chats.length - 1 ? lastChatItemRef : null} // 5. Assign lastChatItemRef to the last chat item
                    >
                      {chat.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
          </Row>
          <Modal show={showHelpModal} onHide={toggleHelpModal}>
            <Modal.Header closeButton>
            <Modal.Title>Help</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <p>On this page, you can view and create chats for a specific directive.</p>
            <p>
                Think of a chat as an isolated "expirement." Dialogue will be saved for each
                chat but will not impact any other chats.
            </p>
            <p>
                To create a new chat, enter the chat name in the input field and click the "Create" button.
            </p>
            <p>
                Click on a chat to open the chat page and interact with the AI using the selected directive.
            </p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={toggleHelpModal}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </Container>
      );
    };
    
export default Chatlist;
    