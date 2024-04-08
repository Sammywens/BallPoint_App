import express from 'express';
import getUsers from '../controllers/Users/getUser.js';
import createNewUser from '../controllers/Users/registerUser.js';
import updateUser from '../controllers/Users/updateUser.js';
import deleteUser from '../controllers/Users/deleteUser.js';
import verifyJWT from '../middleware/verifyJwt.js';


const router = express.Router();
//Use middleware in all users routes.
// router.use(verifyJWT);


router.get('/', verifyJWT, getUsers);
router.post('/create', createNewUser);
router.patch('/:id', verifyJWT, updateUser);
router.delete('/delete', verifyJWT, deleteUser);


export default router;