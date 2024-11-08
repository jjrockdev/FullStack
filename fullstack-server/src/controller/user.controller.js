import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { EMessage, Role, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import crypto from "crypto-js";
import { Decrypt, Encrypt, GenerateToken } from "../service/service.js";
export default class UserController{
    static async Login(req, res) {
        try {
            const { email, password } = req.body;
            const validate = await ValidateData({ email, password });
            if (validate.length > 0) {
                return SendError(res, 400, EMessage.BadRequest + validate.join(","));
            }
            const checkEmail = "select * from tb_user where email=?";
            connected.query(checkEmail, email, async(error, result) => {
                if (error) return SendError(res, 404, EMessage.NotFound, error);
                if (!result[0]) return SendError(res, 404, EMessage.NotFound);
                const decryptPassword = await Decrypt(result[0]['password']);
                if (decryptPassword !== password) {
                    return SendError(res, 404, EMessage.UnMatch);
                }
                const token = await GenerateToken(result[0]['userID']).toString();
                return SendSuccess(res, SMessage.Login, token);
            })
        } catch (error) {
            return SendError(res, 500, EMessage.Eserver, error);
        }
    }
    static async Register(req, res) {
        try {
        // request body
        const { userName, email,password, phoneNumber } = req.body;
        // validate data
        const validate = await ValidateData({
            userName,
            email,
            password,
            phoneNumber,
        });
        if (validate.length > 0) {
            return SendError(res, 400, EMessage.BadRequest + validate.join(","));
        }
        const userID = uuidv4();
        const datetime = new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");
        //check email already
        const select = "select * from tb_user where email=?";
        connected.query(select, email, async (error, isMatch) => {
            if(error) throw error
            if (isMatch[0])  return SendError(res,208,SMessage.EmailHaveAlready)
            // insert mysql
            const insert = `INSERT INTO tb_user(userID,userName,email,password,phoneNumber,role,createAt,updateAt) values (?,?,?,?,?,?,?,?)`;
            //const genPassword = crypto.AES.encrypt(password, "test").toString();
            const genPassword = await Encrypt(password);
            const data = [
            userID,
            userName,
            email,
            genPassword,
            phoneNumber,
            Role.user,
            datetime,
            datetime,
            ];
            connected.query(insert, data, (err) => {
                if (err) return SendError(res, 404, EMessage.Register, err);
                return SendCreate(res, SMessage.Register);
            });
        });
        } catch (error) {
            return SendError(res, 500, EMessage.Eserver, error);
        }
    }
}