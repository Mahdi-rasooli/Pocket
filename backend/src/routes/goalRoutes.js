const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { validateBody, validateObjectIdParam } = require('../middleware/validate');
const schemas = require('../schemas/goalSchemas');
const {
  list, create, update, remove, projections, addCollaborator, removeCollaborator,
} = require('../controllers/goalController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.post('/', validateBody(schemas.create), asyncHandler(create));
router.put('/:id', validateObjectIdParam('id'), validateBody(schemas.update), asyncHandler(update));
router.delete('/:id', validateObjectIdParam('id'), asyncHandler(remove));
router.get('/:id/projections', validateObjectIdParam('id'), asyncHandler(projections));
router.post('/:id/collaborators', validateObjectIdParam('id'), validateBody(schemas.inviteCollaborator), asyncHandler(addCollaborator));
router.delete(
  '/:id/collaborators/:userId',
  validateObjectIdParam('id'),
  validateObjectIdParam('userId'),
  asyncHandler(removeCollaborator)
);

module.exports = router;
