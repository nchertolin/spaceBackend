const { hash, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../error/ApiError');

const ERROR_MESSAGE = {
    LOGPASS: 'Неверный логин или пароль',
    EXIST: 'Пользователь с таким логином уже существует',
    NOT_FOUND: 'Пользователь не найден',
    INCORRECT_PASSWORD: 'Некорректный пароль',
};

const generateJwt = (id, login) => sign(
    { id, login },
    process.env.SECRET_KEY,
    { expiresIn: '24h' },
);

const UserController = {
    async getOne(req, res, next) {
        const { id } = req.params;
        const user = await User.findOne(
            {
                where: { id },
                attributes: [
                    'login',
                    'name',
                ],
            },
        );
        if (!user) {
            return next(ApiError.badRequest((ERROR_MESSAGE.NOT_FOUND)));
        }
        return res.json(user);
    },
    async signup(req, res, next) {
        const { login, password } = req.body;
        if (!login || !password) {
            return next(ApiError.badRequest(ERROR_MESSAGE.LOGPASS));
        }
        const candidate = await User.findOne({ where: { login } });
        if (candidate) {
            return next(ApiError.badRequest(ERROR_MESSAGE.EXIST));
        }
        const hashPassword = await hash(password, 5);
        const user = await User.create({ login, password: hashPassword });
        const token = generateJwt(user.id, user.login);
        return res.json({ token, login: user.login });
    },

    async signin(req, res, next) {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { login } });
        if (!user) {
            return next(ApiError.badRequest(ERROR_MESSAGE.NOT_FOUND));
        }
        const comparePassword = compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest(ERROR_MESSAGE.INCORRECT_PASSWORD));
        }
        const token = generateJwt(user.id, user.login);
        return res.json({
            id: user.id, token, login: user.login, name: user.name,
        });
    },

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.login);
        return res.json({ token });
    },
};

module.exports = UserController;
