const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../models/userModel')

const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')

            const user_name = await Users.findOne({ username: newUserName })
            if(user_name) {
                return res.status(400).json({ msg: 'This user name already exists.'})
            }

            const userEmail = await Users.findOne({ email })
            if(userEmail) {
                return res.status(400).json({ msg: 'This email already exists.' })
            }

            if(password.length < 6) {
                return res.status(400).json({ msg: 'Password must be at least 6 characters.' })
            }

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname,
                email,
                gender,
                username: newUserName, 
                password: passwordHash
            })

            const accessToken = createAccessToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })

            await newUser.save()

            res.json({
                msg: 'Register Success!',
                access_token: accessToken,
                refresh_token: refreshToken,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
                .populate('followers following', 'avatar username fullname followers following')

            if(!user) {
                return res.status(400).json({ msg: 'This email does not exist.' })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({ msg: 'Password is incorrect.' })
            }

            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            res.json({
                msg: 'Login Success!',
                access_token: accessToken,
                refresh_token: refreshToken,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: 'Logged out!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const refreshToken = req.body.refreshToken
            if(!refreshToken) {
                return res.status(400).json({ msg: 'Please login now.' })
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) {
                    return res.status(400).json({ msg: 'Please login now.' })
                }

                const user = await Users
                    .findById(result.id)
                    .select('-password')
                    .populate('followers following', 'avatar username fullname followers following')

                if(!user) {
                    return res.status(400).json({ msg: 'This does not exist.' })
                }

                const accessToken = createAccessToken({ id: result.id })

                res.json({
                    user,
                    access_token: accessToken,
                })
            })
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = authCtrl