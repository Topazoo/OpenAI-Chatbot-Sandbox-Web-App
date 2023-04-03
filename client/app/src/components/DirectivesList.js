import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth_context';
import '../stylesheets/DirectivesList.css';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Form, Button, Modal, Spinner } from 'react-bootstrap';

const DirectiveList = () => {
    const { auth, authDispatch } = useContext(AuthContext);
    const [directives, setDirectives] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [modalDirectiveId, setModalDirectiveId] = useState(null);
    const [newDirectiveName, setNewDirectiveName] = useState('');
    const [newDirectiveContent, setNewDirectiveContent] = useState('');
    const history = useHistory();

    useEffect(() => {
        setIsLoading(true);
        fetchDirectives();
    }, []);

    const fetchDirectives = async () => {
        try {
        const response = await axios.get(`/api/directives?user_id=${auth._id}`);
        setDirectives(response.data.data);
        } catch (error) {
        console.error('Error fetching directives:', error);
        } finally {
        setIsLoading(false);
        }
    };

    const handleShowModal = (type, directiveId) => {
        setModalType(type);
        setModalDirectiveId(directiveId);
        if (type === 'edit') {
          const directive = directives.find(d => d._id === directiveId);
          if (directive) {
            setNewDirectiveName(directive.name);
            setNewDirectiveContent(directive.directives.join('\n'));
          }
        }
        setShowModal(true);
    };

    const toggleHelpModal = () => {
        setShowHelpModal(!showHelpModal);
    };
    const handleShowExample = () => {
        setShowExample(!showExample);
      };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewDirectiveName('');
        setNewDirectiveContent('');
    };

    const handleSaveDirective = () => {
        const newDirective = {
          user_id: auth._id,
          name: newDirectiveName,
          directives: newDirectiveContent.split('\n').filter(line => line.trim() !== ''),
        };
      
        if (modalType === 'add') {
          axios.post('/api/directives', newDirective)
            .then((response) => {
              const savedDirective = {
                name: newDirectiveName,
                directives: newDirectiveContent.split('\n').filter(line => line.trim() !== ''),
                _id: response.data._id
              };
              setDirectives([...directives, savedDirective]);
              handleCloseModal();
            });
        } else if (modalType === 'edit') {
          newDirective._id = modalDirectiveId;
          axios.put(`/api/directives`, newDirective)
            .then((response) => {
              const savedDirective = {
                name: newDirectiveName,
                directives: newDirectiveContent.split('\n').filter(line => line.trim() !== ''),
                _id: modalDirectiveId
              };
              const updatedDirectives = directives.map(directive => (
                directive._id === modalDirectiveId ? savedDirective : directive
              ));
              setDirectives(updatedDirectives);
              handleCloseModal();
            });
        }
      };
      
    const goToChatList = (directiveId, directiveName) => {
        history.push({
            pathname: `/home/${directiveId}/chats`,
            state: { directiveName: directiveName },
        });
    };

    return (
        <Container className='body-container'>
            <Row>
            <Col>
                <div className="page-subtitle">
                    <br />
                    <h2 style={{ display: 'inline' }}>Directives</h2>
                    <Button variant="info" onClick={toggleHelpModal} style={{ float: 'right' }}>
                        Help
                    </Button>
                </div>
                {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
                ) : (
                <ListGroup>
                    {directives.map((directive) => (
                        <ListGroup.Item
                            key={directive._id}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            onClick={() => goToChatList(directive._id, directive.name)}
                            >
                            <div>{directive.name}</div>
                            <Button
                                variant="secondary"
                                onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal('edit', directive._id);
                                }}
                            >
                                Edit
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                )}
            </Col>
            </Row>
            <Row className="mt-3">
            <Col>
                <Button variant="primary" onClick={() => handleShowModal('add')}>
                Add Directive
                </Button>
            </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'add' ? 'Add Directive' : 'Edit Directive'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    value={newDirectiveName}
                    onChange={(e) => setNewDirectiveName(e.target.value)}
                    placeholder="Enter directive name"
                />
                </Form.Group>
                <Form.Group>
                <Form.Label>Commands (one per line)</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={5}
                    value={newDirectiveContent}
                    onChange={(e) => setNewDirectiveContent(e.target.value)}
                    placeholder="Enter commands"
                />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Close
                </Button>
                <Button variant="primary" onClick={handleSaveDirective}>
                Save
                </Button>
            </Modal.Footer>
            </Modal>
            <Modal show={showHelpModal} onHide={toggleHelpModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>On this page you can create or edit custom chatbot <b>Directives</b>.</p>
                    <p>Chatbot "Directives" are <i>overall rules or instructions the chatbot should follow</i> when responding to user input.</p>
                    <p>Once you have created a custom directive you can select it from the Directives list to start creating chats governed by your custom directive.</p>
                    <p>For an example and inspiration creating a custom directive, select "Show Example".</p>
                    <Button variant="secondary" onClick={handleShowExample}>
                    Show Example
                    </Button>
                    {showExample && (
                    <div className='modal-example'>
                        <h5>Example Directive:</h5>
                        <p>Name: Tweet Classifier</p>
                        <p>Commands:</p>
                        <pre className='modal-pre'>
                        You are a chatbot tasked with classifying the sentiment of tweets.{'\n'}
                        You should classify the tweet as positive, negative or neutral.{'\n'}
                        You should ask the user to input a tweet and then output the tweet with the classification{'\n'}
                        ---{'\n'}
                        Examples:{'\n'}
                        AI: Please enter a tweet:{'\n'}
                        User: The amusement park was fun!{'\n'}
                        AI: Tweet - The amusement park was fun! | Sentiment - Positive{'\n'}
                        AI: Please enter another tweet:{'\n'}
                        User: The food was ok{'\n'}
                        AI: Tweet - The food was ok | Sentiment - Neutral{'\n'}
                        ---{'\n'}
                        Start with the following output to prompt the user: "Please enter a Tweet"
                        </pre>
                    </div>
                    )}
                    <p style={{"paddingTop": "15px"}}>Note that the AI is fickle and may respond differently, even to the same prompt.</p>
                    <p>Specificity, examples and some trial and error are necessary :)</p>
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

export default DirectiveList;
