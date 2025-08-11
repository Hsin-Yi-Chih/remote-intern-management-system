const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Feedback = require('../models/Feedback');
const { updateFeedback,getFeedbacks,addFeedback,deleteFeedback } = require('../controllers/feedbackController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;
afterEach(() => sinon.restore());

describe('AddFeedback Function Test', () => {
  it('should create a new feedback successfully', async () => {
    const userId = new mongoose.Types.ObjectId();

    const req = {
      user: { id: String(userId) }, 
      body: {
        assignedIntern: "Intern A",
        title: "New Feedback",
        comments: "Feedback description",
        visibility: "manager_intern"
      }
    };

    const createdFeedback = {
      _id: new mongoose.Types.ObjectId(),
      userId, 
      ...req.body
    };

    const createStub = sinon.stub(Feedback, 'create').resolves(createdFeedback);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await addFeedback(req, res);

    expect(createStub.calledOnce).to.be.true;
    const arg = createStub.firstCall.args[0];
    expect(arg).to.include(req.body);
    expect(String(arg.userId)).to.equal(req.user.id); 
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdFeedback)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    sinon.stub(Feedback, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: String(new mongoose.Types.ObjectId()) },
      body: {
        assignedIntern: "Intern A",
        title: "New Feedback",
        comments: "Feedback description",
        visibility: "manager_intern"
      }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await addFeedback(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});


describe('Update Function Test', () => {

  it('should update feedback successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const feedbackId = new mongoose.Types.ObjectId();

    const existingFeedback = {
      _id: feedbackId,
      userId,                          
      title: 'Old Feedback',
      comments: 'Old Comment',
      visibility: 'manager_intern',
      save: sinon.stub().resolvesThis(), 
    };
    sinon.stub(Feedback, 'findById').resolves(existingFeedback);

    const req = {
      user: { id: String(userId) },
      params: { id: String(feedbackId) },
      body: { title: 'New Feedback', comments: 'New', visibility: 'manager_only' }
    };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    await updateFeedback(req, res);

    expect(existingFeedback.title).to.equal('New Feedback');
    expect(existingFeedback.comments).to.equal('New');
    expect(existingFeedback.visibility).to.equal('manager_only');
    expect(res.status.called).to.be.false;   
    expect(res.json.calledOnce).to.be.true;
  });

  it('should return 403 if user does not own the feedback', async () => {
  const ownerId = new mongoose.Types.ObjectId();
  const otherUserId = new mongoose.Types.ObjectId();

  const doc = {
    _id: new mongoose.Types.ObjectId(),
    userId: ownerId, save: sinon.stub()
  };
  sinon.stub(Feedback, 'findById').resolves(doc);

  const req = {
    user: { id: String(otherUserId) }, 
    params: { id: String(doc._id) },
    body: { title: 'x' }
  };
  const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

  await updateFeedback(req, res);

  expect(res.status.calledWith(403)).to.be.true;
  expect(res.json.calledWith({ message: 'Forbidden' })).to.be.true;
});

  it('should return 404 if feedback is not found', async () => {
    sinon.stub(Feedback, 'findById').resolves(null);

    const req = {
      user: { id: String(new mongoose.Types.ObjectId()) },
      params: { id: String(new mongoose.Types.ObjectId()) },
      body: {}
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateFeedback(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Feedback not found' })).to.be.true;
  });

  it('should return 500 on error', async () => {
    sinon.stub(Feedback, 'findById').throws(new Error('DB Error'));

    const req = {
      user: { id: String(new mongoose.Types.ObjectId()) },
      params: { id: String(new mongoose.Types.ObjectId()) },
      body: {}
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateFeedback(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;
  });

});



describe('GetFeedback Function Test', () => {

  it('should return feedbacks for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();
    const uid = String(userId);

    // Mock feedback data
    const feedbacks = [
    { _id: new mongoose.Types.ObjectId(), title: "Feedback 1", userId: uid },
    { _id: new mongoose.Types.ObjectId(), title: "Feedback 2", userId: uid }
  ];

    // Stub Feedback.find to return mock feedbacks
    const findStub = sinon.stub(Feedback, 'find').resolves(feedbacks);

    // Mock request & response
    const req = { user: { id: uid } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

    // Call function
    await getFeedbacks(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId: uid })).to.be.true;
    expect(res.json.calledWith(feedbacks)).to.be.true;;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Feedback.find to throw an error
    const findStub = sinon.stub(Feedback, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getFeedbacks(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteFeedback Function Test', () => {

  it('should delete a feedback successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock feedback found in the database
    const feedback = { remove: sinon.stub().resolves() };

    // Stub Feedback.findById to return the mock feedback
    const findByIdStub = sinon.stub(Feedback, 'findById').resolves(feedback);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteFeedback(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(feedback.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Feedback deleted successfully' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if feedback is not found', async () => {
    // Stub Feedback.findById to return null
    const findByIdStub = sinon.stub(Feedback, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteFeedback(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Feedback not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Feedback.findById to throw an error
    const findByIdStub = sinon.stub(Feedback, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteFeedback(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});