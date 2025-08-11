const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Assignment = require('../models/Assignments');
const { updateAssignment,getAssignments,addAssignment,deleteAssignment } = require('../controllers/assignmentController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddAssignment Function Test', () => {

  it('should create a new assignment successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Assignment", description: "Assignment description", assignedIntern: "Intern A", startDate: "2025-01-01", deadline: "2025-12-31" }
    };

    // Mock assignment that would be created
    const createdAssignment = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Assignment.create to return the createdAssignment
    const createStub = sinon.stub(Assignment, 'create').resolves(createdAssignment);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addAssignment(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdAssignment)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Assignment.create to throw an error
    const createStub = sinon.stub(Assignment, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Assignment", description: "Assignment description", assignedIntern: "Intern A", startDate: "2025-01-01", deadline: "2025-12-31" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addAssignment(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update assignment successfully', async () => {
    // Mock assignment data
    const assignmentId = new mongoose.Types.ObjectId();
    const existingAssignment = {
      _id: assignmentId,
      title: "Old Assignment",
      description: "Old Description",
      completed: false,
      deadline: new Date(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Assignment.findById to return mock assignment
    const findByIdStub = sinon.stub(Assignment, 'findById').resolves(existingAssignment);

    // Mock request & response
    const req = {
      params: { id: assignmentId },
      body: { title: "New Assignment", completed: true }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateAssignment(req, res);

    // Assertions
    expect(existingAssignment.title).to.equal("New Assignment");
    expect(existingAssignment.completed).to.equal(true);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 400 if trying to change assignedIntern', async () => {
  const assignmentId = new mongoose.Types.ObjectId();
  const doc = { _id: assignmentId, assignedIntern: 'A', save: sinon.stub() };
  sinon.stub(Assignment, 'findById').resolves(doc);

  const req = { params: { id: assignmentId }, body: { assignedIntern: 'B' } };
  const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

  await updateAssignment(req, res);

  expect(res.status.calledWith(400)).to.be.true;
  expect(res.json.calledWith({ message: 'Assigned intern cannot be changed.' })).to.be.true;
});

  it('should return 404 if assignment is not found', async () => {
    const findByIdStub = sinon.stub(Assignment, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateAssignment(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Assignment not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Assignment, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateAssignment(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetAssignment Function Test', () => {

  it('should return assignments for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock assignment data
    const assignments = [
      { _id: new mongoose.Types.ObjectId(), title: "Assignment 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Assignment 2", userId }
    ];

    // Stub Assignment.find to return mock assignments
    const findStub = sinon.stub(Assignment, 'find').resolves(assignments);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getAssignments(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(assignments)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Assignment.find to throw an error
    const findStub = sinon.stub(Assignment, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getAssignments(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteAssignment Function Test', () => {

  it('should delete a assignment successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock assignment found in the database
    const assignment = { remove: sinon.stub().resolves() };

    // Stub Assignment.findById to return the mock assignment
    const findByIdStub = sinon.stub(Assignment, 'findById').resolves(assignment);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAssignment(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(assignment.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Assignment deleted successfully' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if assignment is not found', async () => {
    // Stub Assignment.findById to return null
    const findByIdStub = sinon.stub(Assignment, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAssignment(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Assignment not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Assignment.findById to throw an error
    const findByIdStub = sinon.stub(Assignment, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAssignment(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});