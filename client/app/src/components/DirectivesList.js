import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth_context';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Form, Button, Modal, Spinner } from 'react-bootstrap';

const DirectiveList = () => {
    const { auth, authDispatch } = useContext(AuthContext);
    const [directives, setDirectives] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    const handleCloseModal = () => {
        setShowModal(false);
        setNewDirectiveName('');
        setNewDirectiveContent('');
    };

    const handleSaveDirective = () => {
        const newDirective = {
          user_id: auth._id,
          name: newDirectiveName,
          directives: newDirectiveContent.split('\n'),
        };
      
        if (modalType === 'add') {
          axios.post('/api/directives', newDirective)
            .then((response) => {
              const savedDirective = {
                name: newDirectiveName,
                directives: newDirectiveContent.split('\n'),
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
                directives: newDirectiveContent.split('\n'),
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
        <Container>
            <Row>
            <Col>
                <div className="page-subtitle">
                <br />
                <h2>Directives</h2>
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
        </Container>
    );
};

export default DirectiveList;
